import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentEvent } from '../webhook/entities/payment-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEvent])],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
