import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [PrismaModule, HttpModule],
})
export class TransactionModule {}
  