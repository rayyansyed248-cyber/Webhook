/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEvent } from './entities/payment-event.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { Logger } from 'winston';

@Injectable()
export class WebhookService {
  private transporter;
  constructor(
    @InjectRepository(PaymentEvent)
    private paymentEventRepo: Repository<PaymentEvent>,
    private configService: ConfigService,
    @Inject('winston') private logger: Logger,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async handleWebHook(payload: any, signature: string) {
    const secret = this.configService.get('WEBHOOK_SECRET');
    const computedSiganture = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    console.log('Computed Signature:', computedSiganture);
    this.logger.info('Payload received', payload);

    if (computedSiganture !== signature) {
      throw new BadRequestException('Invalid Siganture');
    }

    if (
      !payload.eventType ||
      !payload.paymentId ||
      !payload.amount ||
      !payload.status
    ) {
      throw new BadRequestException('Missing required fields in payload');
    }

    //Idempotency: check for duplicate paymentId

    const existingEvent = await this.paymentEventRepo.findOne({
      where: { paymentId: payload.paymentId },
    });

    if (existingEvent && existingEvent.processingStatus === 'processed') {
      this.logger.warn(
        `Duplicate event received for paymentId: ${payload.paymentId}`,
      );
      return { message: 'Event already processed' };
    }

    //Save event to DB
    let event = existingEvent || new PaymentEvent();
    event.eventType = payload.eventType;
    event.paymentId = payload.paymentId;
    event.amount = payload.amount;
    event.status = payload.status;

    try {
      event = await this.paymentEventRepo.save(event);

      switch (payload.eventType) {
        case 'payment.created':
          if (payload.status === 'succeeded') {
            this.logger.info('Started sending email for payload', payload);
            await this.transporter.sendMail({
              from: this.configService.get('EMAIL_FROM'),
              to: payload.userEmail,
              subject: `Payment Confirmation : ${payload.paymentId}`,
              text: `Your payment of amount $${payload.amount} has been successfully processed.`,
            });

            event.processingStatus = 'processed';
            this.logger.info(
              `Payment succeeded email sent for paymentId: ${payload.paymentId}`,
            );
          }
          break;
        default:
          event.processingStatus = 'failed';
          event.errorMessage = 'Payment Failed';
      }

      await this.paymentEventRepo.save(event);
      this.logger.info(`Webhook processed for paymentId: ${payload.paymentId}`);

      return { message: 'Event processed successfully' };
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error.message}`);
      if (!existingEvent) {
        event.processingStatus = 'failed';
        event.errorMessage = error.message;
        await this.paymentEventRepo.save(event);
      }
      throw new BadRequestException('Webhook processing error');
    }
  }
}
