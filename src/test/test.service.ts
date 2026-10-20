import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  constructor(@Inject('UUID') private readonly uuid: () => string) {}

  getId(): string {
    return this.uuid();
  }
}