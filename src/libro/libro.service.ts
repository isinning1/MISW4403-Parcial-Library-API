// src/libro/libro.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';
import { LibroDto } from './libro.dto';

@Injectable()
export class LibroService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
  ) {}

  async findAll(): Promise<Libro[]> {
    return this.libroRepository.find({ relations: ['bibliotecas'] });
  }

  async findOne(id: number): Promise<Libro> {
    const libro = await this.libroRepository.findOne({
      where: { id },
      relations: ['bibliotecas'],
    });
    if (!libro) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }
    return libro;
  }

  async create(data: LibroDto): Promise<Libro> {
    if (new Date(data.fechaPublicacion) > new Date()) {
      throw new BadRequestException(
        'La fecha de publicación no puede ser futura',
      );
    }
    const nuevoLibro = this.libroRepository.create(data);
    return this.libroRepository.save(nuevoLibro);
  }

  async update(id: number, data: Partial<LibroDto>): Promise<Libro> {
    const libro = await this.findOne(id);
    if (data.fechaPublicacion && new Date(data.fechaPublicacion) > new Date()) {
      throw new BadRequestException(
        'La fecha de publicación no puede ser futura',
      );
    }
    Object.assign(libro, data);
    return this.libroRepository.save(libro);
  }

  async delete(id: number): Promise<void> {
    const libro = await this.findOne(id);
    await this.libroRepository.remove(libro);
  }
}
