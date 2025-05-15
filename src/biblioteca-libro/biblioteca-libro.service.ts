import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Biblioteca } from '../biblioteca/biblioteca.entity';
import { Libro } from '../libro/libro.entity';

@Injectable()
export class BibliotecaLibroService {
  constructor(
    @InjectRepository(Biblioteca)
    private readonly bibliotecaRepository: Repository<Biblioteca>,

    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
  ) {}

  async addBookToLibrary(
    bibliotecaId: number,
    libroId: number,
  ): Promise<Biblioteca> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });

    if (!biblioteca) {
      throw new NotFoundException(
        `Biblioteca con ID ${bibliotecaId} no encontrada`,
      );
    }

    const libro = await this.libroRepository.findOne({
      where: { id: libroId },
    });
    if (!libro) {
      throw new NotFoundException(`Libro con ID ${libroId} no encontrado`);
    }

    const yaAsociado = biblioteca.libros.some((l) => l.id === libro.id);
    if (yaAsociado) {
      throw new BadRequestException(
        'El libro ya está asociado a la biblioteca',
      );
    }

    biblioteca.libros.push(libro);
    return this.bibliotecaRepository.save(biblioteca);
  }

  async findBooksFromLibrary(bibliotecaId: number): Promise<Libro[]> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });

    if (!biblioteca) {
      throw new NotFoundException(
        `Biblioteca con ID ${bibliotecaId} no encontrada`,
      );
    }

    return biblioteca.libros;
  }

  async findBookFromLibrary(
    bibliotecaId: number,
    libroId: number,
  ): Promise<Libro> {
    const libros = await this.findBooksFromLibrary(bibliotecaId);
    const libro = libros.find((l) => l.id === libroId);

    if (!libro) {
      throw new NotFoundException(
        `Libro con ID ${libroId} no asociado a la biblioteca`,
      );
    }

    return libro;
  }

  async updateBooksFromLibrary(
    bibliotecaId: number,
    librosIds: number[],
  ): Promise<Biblioteca> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });

    if (!biblioteca) {
      throw new NotFoundException(
        `Biblioteca con ID ${bibliotecaId} no encontrada`,
      );
    }

    const libros = await this.libroRepository.findByIds(librosIds);

    if (libros.length !== librosIds.length) {
      throw new BadRequestException('Uno o más libros no existen');
    }

    biblioteca.libros = libros;
    return this.bibliotecaRepository.save(biblioteca);
  }

  async deleteBookFromLibrary(
    bibliotecaId: number,
    libroId: number,
  ): Promise<void> {
    const biblioteca = await this.bibliotecaRepository.findOne({
      where: { id: bibliotecaId },
      relations: ['libros'],
    });

    if (!biblioteca) {
      throw new NotFoundException(
        `Biblioteca con ID ${bibliotecaId} no encontrada`,
      );
    }

    const libroAsociado = biblioteca.libros.find((l) => l.id === libroId);

    if (!libroAsociado) {
      throw new NotFoundException(
        `Libro con ID ${libroId} no está asociado a la biblioteca`,
      );
    }

    biblioteca.libros = biblioteca.libros.filter((l) => l.id !== libroId);
    await this.bibliotecaRepository.save(biblioteca);
  }
}
