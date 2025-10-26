import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { AccountApiResponse } from './dto/account.dto';
import { KafkaService } from "src/kafka/kafka.service";

@Injectable()
export class TransactionService {
  constructor(
    private readonly prismaService: PrismaService, 
    private readonly httpService: HttpService,
    private readonly kafkaService: KafkaService
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {

    const { accountId, description } = createTransactionDto;

    let accountApiResponse = await this.httpService.axiosRef.get<AccountApiResponse>(
    `http://localhost:3001/v1/accounts/${accountId}`,
    );

    const {account} = accountApiResponse.data;

    if (!account) {
      throw new Error('Transaction creation failed: Account not found');
    }

    if (account.status == 'new' || account.status == 'active') {
      await this.kafkaService.send({
        accountId,
        description,
        status: 'CREATED',
      });
      return this.prismaService.transaction.create({
        data: { accountId, description, status: 'CREATED' },
      });
    } else {
      return this.prismaService.transaction.create({
        data: { accountId, description, status: 'FAILED' },
      });
    }
  }

  findAll() {
    return this.prismaService.transaction.findMany();
  }

  findOne(id: number) {
    return this.prismaService.transaction.findUnique({
      where: { id },
    });
  }

  async fraud(id: number) {
    const transaction = await this.findOne(id);
    
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.status !== "FRAUD" && transaction.status !== "FAILED") {
      const newTransaction =  await this.prismaService.transaction.update({
        where: { id },
        data: { status: "FRAUD" },
      });

      await this.kafkaService.send(newTransaction, null);
      return newTransaction;
    } else throw new Error("Transaction is not in a valid status");
  }
}
