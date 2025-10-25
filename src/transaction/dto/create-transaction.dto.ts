import { IsString, IsOptional, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

enum Status {
  CREATED = 'CREATED',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED',
}

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsUUID()
  @IsNotEmpty()
  accountID: string;
}