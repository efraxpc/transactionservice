import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { AccountApiResponse } from './dto/account.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prismaService: PrismaService, 
    private readonly httpService: HttpService) {}

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
}
