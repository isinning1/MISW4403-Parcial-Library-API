import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Biblioteca } from './biblioteca.entity';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaController } from './biblioteca.controller';
import { Libro } from '../libro/libro.entity';
import { LibroModule } from '../libro/libro.module';

@Module({
  imports: [TypeOrmModule.forFeature([Biblioteca, Libro]), LibroModule],
  providers: [BibliotecaService],
  controllers: [BibliotecaController],
})
export class BibliotecaModule {}
