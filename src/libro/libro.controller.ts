// src/libro/libro.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LibroService } from './libro.service';
import { LibroDto } from './libro.dto';
import { Libro } from './libro.entity';

@Controller('books')
export class LibroController {
  constructor(private readonly libroService: LibroService) {}

  @Get()
  findAll(): Promise<Libro[]> {
    return this.libroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Libro> {
    return this.libroService.findOne(id);
  }

  @Post()
  create(@Body() libroDto: LibroDto): Promise<Libro> {
    return this.libroService.create(libroDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() libroDto: LibroDto,
  ): Promise<Libro> {
    return this.libroService.update(id, libroDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.libroService.delete(id);
  }
}
