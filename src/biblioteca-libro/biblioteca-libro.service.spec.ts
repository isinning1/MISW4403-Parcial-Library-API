import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaLibroService } from './biblioteca-libro.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Biblioteca } from '../biblioteca/biblioteca.entity';
import { Libro } from '../libro/libro.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BibliotecaLibroService', () => {
  let service: BibliotecaLibroService;
  let bibliotecaRepo: { [key: string]: jest.Mock };
  let libroRepo: { [key: string]: jest.Mock };

  beforeEach(async () => {
    bibliotecaRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    libroRepo = {
      findOne: jest.fn(),
      findByIds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BibliotecaLibroService,
        {
          provide: getRepositoryToken(Biblioteca),
          useValue: bibliotecaRepo,
        },
        {
          provide: getRepositoryToken(Libro),
          useValue: libroRepo,
        },
      ],
    }).compile();

    service = module.get<BibliotecaLibroService>(BibliotecaLibroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addBookToLibrary', () => {
    it('should associate a book to a library', async () => {
      const bibliotecaMock = {
        id: 1,
        nombre: 'Biblioteca A',
        direccion: 'Calle 123',
        ciudad: 'Bogotá',
        horarioAtencion: '8am - 6pm',
        libros: [],
      } as Biblioteca;

      const libroMock = {
        id: 5,
        titulo: 'Libro A',
      } as Libro;

      bibliotecaRepo.findOne.mockResolvedValueOnce(bibliotecaMock);
      libroRepo.findOne.mockResolvedValueOnce(libroMock);
      bibliotecaRepo.save.mockResolvedValueOnce({
        ...bibliotecaMock,
        libros: [libroMock],
      });

      const result = await service.addBookToLibrary(1, 5);

      expect(result.libros).toHaveLength(1);
      expect(result.libros[0].id).toBe(5);
    });

    it('should throw NotFoundException if biblioteca not found', async () => {
      bibliotecaRepo.findOne.mockResolvedValue(null);
      await expect(service.addBookToLibrary(1, 5)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if libro not found', async () => {
      const bibliotecaMock = {
        id: 1,
        nombre: 'Biblioteca A',
        direccion: 'Calle 123',
        ciudad: 'Bogotá',
        horarioAtencion: '8am - 6pm',
        libros: [],
      } as Biblioteca;

      bibliotecaRepo.findOne.mockResolvedValue(bibliotecaMock);
      libroRepo.findOne.mockResolvedValue(null);

      await expect(service.addBookToLibrary(1, 5)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if libro already associated', async () => {
      const libroMock = {
        id: 5,
        titulo: 'Libro A',
      } as Libro;

      const bibliotecaMock = {
        id: 1,
        nombre: 'Biblioteca A',
        direccion: 'Calle 123',
        ciudad: 'Bogotá',
        horarioAtencion: '8am - 6pm',
        libros: [libroMock],
      } as Biblioteca;

      bibliotecaRepo.findOne.mockResolvedValue(bibliotecaMock);
      libroRepo.findOne.mockResolvedValue(libroMock);

      await expect(service.addBookToLibrary(1, 5)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
