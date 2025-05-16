import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BibliotecaLibroService } from './biblioteca-libro.service';

@Controller('libraries/:libraryId/books')
export class BibliotecaLibroController {
  constructor(
    private readonly bibliotecaLibroService: BibliotecaLibroService,
  ) {}

  @Post(':bookId')
  @HttpCode(HttpStatus.OK)
  async addBookToLibrary(
    @Param('libraryId', ParseIntPipe)
    libraryId: number,
    @Param('bookId', ParseIntPipe)
    bookId: number,
  ) {
    return await this.bibliotecaLibroService.addBookToLibrary(
      libraryId,
      bookId,
    );
  }

  @Get()
  async findBooksFromLibrary(
    @Param('libraryId', ParseIntPipe)
    libraryId: number,
  ) {
    return await this.bibliotecaLibroService.findBooksFromLibrary(libraryId);
  }

  @Get(':bookId')
  async findBookFromLibrary(
    @Param('libraryId', ParseIntPipe)
    libraryId: number,
    @Param('bookId', ParseIntPipe)
    bookId: number,
  ) {
    return await this.bibliotecaLibroService.findBookFromLibrary(
      libraryId,
      bookId,
    );
  }

  @Put()
  async updateBooksFromLibrary(
    @Param('libraryId', ParseIntPipe)
    libraryId: number,
    @Body()
    bookIds: number[],
  ) {
    return await this.bibliotecaLibroService.updateBooksFromLibrary(
      libraryId,
      bookIds,
    );
  }

  @Delete(':bookId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBookFromLibrary(
    @Param('libraryId', ParseIntPipe)
    libraryId: number,
    @Param('bookId', ParseIntPipe)
    bookId: number,
  ) {
    await this.bibliotecaLibroService.deleteBookFromLibrary(libraryId, bookId);
  }
}
