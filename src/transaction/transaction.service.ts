import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createTransactionDto: CreateTransactionDto) {
    return this.prismaService.transaction.create({
      data: createTransactionDto,
    });
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
