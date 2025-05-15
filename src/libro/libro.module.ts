// src/libro/libro.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroService } from './libro.service';
import { LibroController } from './libro.controller';
import { Libro } from './libro.entity';
import { Biblioteca } from '../biblioteca/biblioteca.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Libro, Biblioteca])],
  providers: [LibroService],
  controllers: [LibroController],
  exports: [LibroService],
})
export class LibroModule {}
