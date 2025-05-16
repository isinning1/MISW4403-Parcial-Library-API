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

  const libroMock: Libro = { id: 5, titulo: 'Libro A' } as Libro;
  const bibliotecaMock: Biblioteca = {
    id: 1,
    nombre: 'Biblioteca A',
    direccion: 'Calle 123',
    ciudad: 'Bogotá',
    horarioAtencion: '8am - 6pm',
    libros: [],
  } as Biblioteca;

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
      bibliotecaRepo.findOne.mockResolvedValueOnce({ ...bibliotecaMock });
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
      bibliotecaRepo.findOne.mockResolvedValue({ ...bibliotecaMock });
      libroRepo.findOne.mockResolvedValue(null);
      await expect(service.addBookToLibrary(1, 5)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if libro already associated', async () => {
      bibliotecaRepo.findOne.mockResolvedValue({
        ...bibliotecaMock,
        libros: [libroMock],
      });
      libroRepo.findOne.mockResolvedValue(libroMock);
      await expect(service.addBookToLibrary(1, 5)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findBooksFromLibrary', () => {
    it('should return books from library', async () => {
      bibliotecaRepo.findOne.mockResolvedValue({
        ...bibliotecaMock,
        libros: [libroMock],
      });

      const result = await service.findBooksFromLibrary(1);
      expect(result).toEqual([libroMock]);
    });

    it('should throw NotFoundException if biblioteca not found', async () => {
      bibliotecaRepo.findOne.mockResolvedValue(null);
      await expect(service.findBooksFromLibrary(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBookFromLibrary', () => {
    it('should return the specific book from library', async () => {
      bibliotecaRepo.findOne.mockResolvedValue({
        ...bibliotecaMock,
        libros: [libroMock],
      });

      const result = await service.findBookFromLibrary(1, 5);
      expect(result).toEqual(libroMock);
    });

    it('should throw NotFoundException if book not associated', async () => {
      bibliotecaRepo.findOne.mockResolvedValue({
        ...bibliotecaMock,
        libros: [],
      });

      await expect(service.findBookFromLibrary(1, 5)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateBooksFromLibrary', () => {
    it('should update library with given book IDs', async () => {
      bibliotecaRepo.findOne.mockResolvedValue({ ...bibliotecaMock });
      libroRepo.findByIds.mockResolvedValue([libroMock]);
      bibliotecaRepo.save.mockResolvedValue({
        ...bibliotecaMock,
        libros: [libroMock],
      });

      const result = await service.updateBooksFromLibrary(1, [5]);
      expect(result.libros).toHaveLength(1);
      expect(result.libros[0].id).toBe(5);
    });

    it('should throw BadRequestException if some books not found', async () => {
      bibliotecaRepo.findOne.mockResolvedValue({ ...bibliotecaMock });
      libroRepo.findByIds.mockResolvedValue([]);

      await expect(service.updateBooksFromLibrary(1, [5])).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if biblioteca not found', async () => {
      bibliotecaRepo.findOne.mockResolvedValue(null);
      await expect(service.updateBooksFromLibrary(1, [5])).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteBookFromLibrary', () => {
    it('should remove the book from the library', async () => {
      const bibliotecaConLibro = {
        ...bibliotecaMock,
        libros: [libroMock],
      };

      bibliotecaRepo.findOne.mockResolvedValue(bibliotecaConLibro);
      bibliotecaRepo.save.mockResolvedValue({
        ...bibliotecaConLibro,
        libros: [],
      });

      await expect(
        service.deleteBookFromLibrary(1, 5),
      ).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if biblioteca not found', async () => {
      bibliotecaRepo.findOne.mockResolvedValue(null);
      await expect(service.deleteBookFromLibrary(1, 5)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if book not associated', async () => {
      bibliotecaRepo.findOne.mockResolvedValue({
        ...bibliotecaMock,
        libros: [],
      });

      await expect(service.deleteBookFromLibrary(1, 5)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
