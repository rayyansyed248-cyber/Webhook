import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { PaymentEvent } from './webhook/entities/payment-event.entity';
import { LoggerModule } from './logger/logger.module';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [PaymentEvent],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    WebhookModule,
    LoggerModule,
    PaymentsModule,
  ],
  controllers: [AppController, PaymentsController],
  providers: [AppService],
})
export class AppModule {}
