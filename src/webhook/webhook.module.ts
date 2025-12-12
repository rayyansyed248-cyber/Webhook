import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEvent } from './entities/payment-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEvent])],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
