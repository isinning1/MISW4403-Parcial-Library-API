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
});
