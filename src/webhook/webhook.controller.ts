import {
  Body,
  Controller,
  Post,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('payment')
  async handlePaymentWebHook(
    @Body() payload: any,
    @Headers('x-webhook-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing signature header');
    }

    return this.webhookService.handleWebHook(payload, signature);
  }
}
