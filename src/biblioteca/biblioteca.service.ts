import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Biblioteca } from './biblioteca.entity';
import { Libro } from '../libro/libro.entity';

@Injectable()
export class BibliotecaService {
  constructor(
    @InjectRepository(Biblioteca)
    private repo: Repository<Biblioteca>,

    @InjectRepository(Libro)
    private libroRepo: Repository<Libro>,
  ) {}

  async findAll() {
    return this.repo.find({ relations: ['libros'] });
  }

  async findOne(id: number) {
    const biblioteca = await this.repo.findOne({
      where: { id },
      relations: ['libros'],
    });
    if (!biblioteca) throw new NotFoundException('Biblioteca no encontrada');
    return biblioteca;
  }

  async create(data: Partial<Biblioteca>) {
    if (data.horarioAtencion && !this.validarHorario(data.horarioAtencion)) {
      throw new BadRequestException(
        'Horario inválido: la hora de apertura debe ser menor a la de cierre (formato esperado: HH:MM-HH:MM)',
      );
    }
    const biblioteca = this.repo.create(data);
    return this.repo.save(biblioteca);
  }

  async update(id: number, data: Partial<Biblioteca>) {
    const biblioteca = await this.findOne(id);
    if (data.horarioAtencion && !this.validarHorario(data.horarioAtencion)) {
      throw new BadRequestException(
        'Horario inválido: la hora de apertura debe ser menor a la de cierre (formato esperado: HH:MM-HH:MM)',
      );
    }
    Object.assign(biblioteca, data);
    return this.repo.save(biblioteca);
  }

  async delete(id: number) {
    const biblioteca = await this.findOne(id);
    return this.repo.remove(biblioteca);
  }

  private validarHorario(horario: string): boolean {
    const partes = horario.split('-');
    if (partes.length !== 2) {
      return false;
    }

    const [inicio, fin] = partes.map((h) => h.trim());

    const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regexHora.test(inicio) || !regexHora.test(fin)) {
      return false;
    }

    return inicio < fin;
  }

  async addBookToLibrary(libraryId: number, bookId: number) {
    const biblioteca = await this.findOne(libraryId);
    const libro = await this.libroRepo.findOne({ where: { id: bookId } });
    if (!libro) throw new NotFoundException('Libro no encontrado');
    biblioteca.libros.push(libro);
    return this.repo.save(biblioteca);
  }

  async findBooksFromLibrary(libraryId: number): Promise<Libro[]> {
    const biblioteca = await this.findOne(libraryId);
    return biblioteca.libros;
  }

  async findBookFromLibrary(
    libraryId: number,
    bookId: number,
  ): Promise<Libro | undefined> {
    const biblioteca = await this.findOne(libraryId);
    return biblioteca.libros.find((book) => book.id === bookId);
  }

  async updateBooksFromLibrary(libraryId: number, bookIds: number[]) {
    const biblioteca = await this.findOne(libraryId);
    const libros = await this.libroRepo.findByIds(bookIds);
    biblioteca.libros = libros;
    return this.repo.save(biblioteca);
  }

  async deleteBookFromLibrary(libraryId: number, bookId: number) {
    const biblioteca = await this.findOne(libraryId);
    biblioteca.libros = biblioteca.libros.filter((book) => book.id !== bookId);
    return this.repo.save(biblioteca);
  }
}
