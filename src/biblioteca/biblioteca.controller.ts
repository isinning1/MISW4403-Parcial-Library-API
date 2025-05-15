// src/biblioteca/biblioteca.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { BibliotecaService } from './biblioteca.service';
import { Biblioteca } from './biblioteca.entity';

@Controller('libraries')
export class BibliotecaController {
  constructor(private readonly bibliotecaService: BibliotecaService) {}

  @Get()
  findAll(): Promise<Biblioteca[]> {
    return this.bibliotecaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Biblioteca> {
    return this.bibliotecaService.findOne(id);
  }

  @Post()
  create(@Body() biblioteca: Partial<Biblioteca>): Promise<Biblioteca> {
    return this.bibliotecaService.create(biblioteca);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() biblioteca: Partial<Biblioteca>,
  ): Promise<Biblioteca> {
    return this.bibliotecaService.update(id, biblioteca);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<Biblioteca> {
    return this.bibliotecaService.delete(id);
  }
}
