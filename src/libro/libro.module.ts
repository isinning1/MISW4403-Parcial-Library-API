import { Module } from '@nestjs/common';
import { LibroService } from './libro.service';
import { LibroController } from './libro.controller';

@Module({
  providers: [LibroService],
  controllers: [LibroController]
})
export class LibroModule {}
