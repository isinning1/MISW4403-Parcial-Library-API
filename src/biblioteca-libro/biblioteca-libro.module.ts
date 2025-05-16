import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { BibliotecaLibroController } from './biblioteca-libro.controller';
import { Biblioteca } from '../biblioteca/biblioteca.entity';
import { Libro } from '../libro/libro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Biblioteca, Libro])],
  providers: [BibliotecaLibroService],
  controllers: [BibliotecaLibroController],
})
export class BibliotecaLibroModule {}
