import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaService } from './biblioteca.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Biblioteca } from './biblioteca.entity';
import { Libro } from '../libro/libro.entity';
import { BadRequestException } from '@nestjs/common';

describe('BibliotecaService', () => {
  let service: BibliotecaService;

  const mockBibliotecaRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockLibroRepo = {
    findOne: jest.fn(),
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BibliotecaService,
        {
          provide: getRepositoryToken(Biblioteca),
          useValue: mockBibliotecaRepo,
        },
        {
          provide: getRepositoryToken(Libro),
          useValue: mockLibroRepo,
        },
      ],
    }).compile();

    service = module.get<BibliotecaService>(BibliotecaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('debe lanzar excepción si el horario es inválido (inicio >= fin)', async () => {
      const dto = {
        horarioAtencion: '18:00-08:00',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar excepción si el horario es inválido (formato incorrecto)', async () => {
      const dto = {
        horarioAtencion: 'malformato',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('debe guardar biblioteca si el horario es válido', async () => {
      const dto = {
        nombre: 'Biblioteca A',
        horarioAtencion: '08:00-17:00',
      };

      const mockSave = { id: 1, ...dto };

      mockBibliotecaRepo.create.mockReturnValue(mockSave);
      mockBibliotecaRepo.save.mockResolvedValue(mockSave);

      const result = await service.create(dto);
      expect(result).toEqual(mockSave);
    });
  });

  describe('findAll()', () => {
    it('debe retornar todas las bibliotecas', async () => {
      const data = [{ id: 1 }, { id: 2 }];
      mockBibliotecaRepo.find.mockResolvedValue(data);

      const result = await service.findAll();
      expect(result).toEqual(data);
    });
  });

  describe('findOne()', () => {
    it('debe retornar una biblioteca por ID', async () => {
      const data = { id: 1, nombre: 'Biblio' };
      mockBibliotecaRepo.findOne.mockResolvedValue(data);

      const result = await service.findOne(1);
      expect(result).toEqual(data);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      mockBibliotecaRepo.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(999)).rejects.toThrow(
        'Biblioteca no encontrada',
      );
    });
  });

  describe('update()', () => {
    it('debe actualizar una biblioteca si el horario es válido', async () => {
      const data = { nombre: 'Actualizada', horarioAtencion: '09:00-18:00' };
      const bibliotecaExistente = { id: 1, nombre: 'Anterior' };

      mockBibliotecaRepo.findOne.mockResolvedValue(bibliotecaExistente);
      mockBibliotecaRepo.save.mockResolvedValue({
        ...bibliotecaExistente,
        ...data,
      });

      const result = await service.update(1, data);
      expect(result).toEqual({ id: 1, ...data });
    });

    it('debe lanzar BadRequestException si el horario es inválido', async () => {
      const data = { horarioAtencion: '18:00-08:00' };
      const bibliotecaExistente = { id: 1 };

      mockBibliotecaRepo.findOne.mockResolvedValue(bibliotecaExistente);

      await expect(service.update(1, data)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete()', () => {
    it('debe eliminar una biblioteca existente', async () => {
      const biblioteca = { id: 1, nombre: 'A borrar' };
      mockBibliotecaRepo.findOne.mockResolvedValue(biblioteca);
      mockBibliotecaRepo.remove.mockResolvedValue(biblioteca);

      const result = await service.delete(1);
      expect(result).toEqual(biblioteca);
    });
  });

  describe('addBookToLibrary()', () => {
    it('debe agregar un libro existente a una biblioteca', async () => {
      const biblioteca = { id: 1, libros: [] };
      const libro = { id: 10 };

      mockBibliotecaRepo.findOne.mockResolvedValue(biblioteca);
      mockLibroRepo.findOne.mockResolvedValue(libro);
      mockBibliotecaRepo.save.mockResolvedValue({
        ...biblioteca,
        libros: [libro],
      });

      const result = await service.addBookToLibrary(1, 10);
      expect(result.libros).toContain(libro);
    });

    it('debe lanzar NotFoundException si el libro no existe', async () => {
      mockBibliotecaRepo.findOne.mockResolvedValue({ id: 1, libros: [] });
      mockLibroRepo.findOne.mockResolvedValue(undefined);

      await expect(service.addBookToLibrary(1, 999)).rejects.toThrow(
        'Libro no encontrado',
      );
    });
  });

  describe('findBooksFromLibrary()', () => {
    it('debe retornar los libros asociados a la biblioteca', async () => {
      const libros = [{ id: 1 }, { id: 2 }];
      mockBibliotecaRepo.findOne.mockResolvedValue({ id: 1, libros });

      const result = await service.findBooksFromLibrary(1);
      expect(result).toEqual(libros);
    });
  });

  describe('findBookFromLibrary()', () => {
    it('debe retornar el libro específico si está asociado', async () => {
      const libro = { id: 5 };
      mockBibliotecaRepo.findOne.mockResolvedValue({ id: 1, libros: [libro] });

      const result = await service.findBookFromLibrary(1, 5);
      expect(result).toEqual(libro);
    });

    it('debe retornar undefined si el libro no está asociado', async () => {
      mockBibliotecaRepo.findOne.mockResolvedValue({ id: 1, libros: [] });

      const result = await service.findBookFromLibrary(1, 99);
      expect(result).toBeUndefined();
    });
  });

  describe('updateBooksFromLibrary()', () => {
    it('debe reemplazar todos los libros asociados', async () => {
      const biblioteca = { id: 1, libros: [] };
      const nuevosLibros = [{ id: 1 }, { id: 2 }];

      mockBibliotecaRepo.findOne.mockResolvedValue(biblioteca);
      mockLibroRepo.findByIds.mockResolvedValue(nuevosLibros);
      mockBibliotecaRepo.save.mockResolvedValue({
        ...biblioteca,
        libros: nuevosLibros,
      });

      const result = await service.updateBooksFromLibrary(1, [1, 2]);
      expect(result.libros).toEqual(nuevosLibros);
    });
  });

  describe('deleteBookFromLibrary()', () => {
    it('debe eliminar el libro específico de la biblioteca', async () => {
      const libros = [{ id: 1 }, { id: 2 }];
      const biblioteca = { id: 1, libros };

      mockBibliotecaRepo.findOne.mockResolvedValue(biblioteca);
      mockBibliotecaRepo.save.mockResolvedValue({ id: 1, libros: [{ id: 2 }] });

      const result = await service.deleteBookFromLibrary(1, 1);
      expect(result.libros).toEqual([{ id: 2 }]);
    });
  });
});
