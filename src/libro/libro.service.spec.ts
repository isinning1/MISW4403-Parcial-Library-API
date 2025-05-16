// src/libro/libro.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LibroService } from './libro.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Libro } from './libro.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { LibroDto } from './libro.dto';

describe('LibroService', () => {
  let service: LibroService;
  let repo: jest.Mocked<Repository<Libro>>;

  const mockLibro: Libro = {
    id: 1,
    titulo: 'Libro 1',
    autor: 'Autor A',
    fechaPublicacion: new Date('2020-01-01'),
    isbn: '1234567890',
    bibliotecas: [],
  };

  beforeEach(async () => {
    const repoMock: Partial<jest.Mocked<Repository<Libro>>> = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibroService,
        {
          provide: getRepositoryToken(Libro),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<LibroService>(LibroService);
    repo = module.get(getRepositoryToken(Libro));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('debe retornar todos los libros', async () => {
      const libros = [mockLibro];
      repo.find.mockResolvedValue(libros);

      const result = await service.findAll();
      expect(result).toEqual(libros);
    });
  });

  describe('findOne()', () => {
    it('debe retornar un libro por ID', async () => {
      repo.findOne.mockResolvedValue(mockLibro);

      const result = await service.findOne(1);
      expect(result).toEqual(mockLibro);
    });

    it('debe lanzar NotFoundException si no existe el libro', async () => {
      repo.findOne.mockResolvedValue(undefined as unknown as Libro);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create()', () => {
    it('debe lanzar BadRequestException si la fecha de publicación es futura', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const dto: LibroDto = {
        titulo: 'Nuevo Libro',
        autor: 'Autor B',
        fechaPublicacion: futureDate.toISOString(),
        isbn: '0987654321',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('debe guardar el libro si la fecha es válida', async () => {
      const dto: LibroDto = {
        titulo: 'Libro OK',
        autor: 'Autor B',
        fechaPublicacion: new Date('2020-01-01').toISOString(),
        isbn: '0987654321',
      };

      const created: Libro = {
        id: 2,
        ...dto,
        fechaPublicacion: new Date(dto.fechaPublicacion),
        bibliotecas: [],
      };

      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(result).toEqual(created);
    });
  });

  describe('update()', () => {
    it('debe actualizar un libro si la fecha es válida', async () => {
      const dto: Partial<LibroDto> = {
        titulo: 'Actualizado',
        fechaPublicacion: new Date('2020-01-01').toISOString(),
      };

      const existing: Libro = { ...mockLibro };
      const updated: Libro = {
        ...mockLibro,
        ...dto,
        fechaPublicacion: dto.fechaPublicacion
          ? new Date(dto.fechaPublicacion)
          : mockLibro.fechaPublicacion,
      };

      repo.findOne.mockResolvedValue(existing);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(1, dto);
      expect(result.titulo).toBe('Actualizado');
    });

    it('debe lanzar BadRequestException si la fecha es futura', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      repo.findOne.mockResolvedValue({ ...mockLibro });

      await expect(
        service.update(1, {
          fechaPublicacion: futureDate.toISOString(),
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete()', () => {
    it('debe eliminar un libro existente', async () => {
      repo.findOne.mockResolvedValue(mockLibro);
      repo.remove.mockResolvedValue(mockLibro);

      await expect(service.delete(1)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(mockLibro);
    });
  });
});
