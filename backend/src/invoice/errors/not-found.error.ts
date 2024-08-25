import { NotFoundException as _NotFoundException } from '@nestjs/common';

export class NotFoundException extends _NotFoundException {
  constructor(id: number | undefined) {
    super(`Invoice with ID ${id} not found`);
  }
}
