import { Transform, Type } from 'class-transformer';
import { IsOptional, IsInt, IsPositive, IsDateString } from 'class-validator';

export class GetAllInvoicesDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  limit?: number;
}

export class GetInvoiceByIdParamsDto {
  @IsInt()
  @Type(() => Number)
  id: number;
}

export class GetTotalAmountByDueDateDto {
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => new Date(value))
  dueDate?: Date;
}
