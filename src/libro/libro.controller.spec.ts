// src/libro/libro.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LibroController } from './libro.controller';
import { LibroService } from './libro.service';
import { LibroDto } from './libro.dto';
import { Libro } from './libro.entity';

describe('LibroController', () => {
  let controller: LibroController;
  let service: jest.Mocked<LibroService>;

  const mockLibro: Libro = {
    id: 1,
    titulo: 'El Principito',
    autor: 'Antoine de Saint-Exupéry',
    fechaPublicacion: new Date('1943-04-06'),
    isbn: '1234567890',
    bibliotecas: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibroController],
      providers: [
        {
          provide: LibroService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockLibro]),
            findOne: jest.fn().mockResolvedValue(mockLibro),
            create: jest.fn().mockResolvedValue(mockLibro),
            update: jest.fn().mockResolvedValue(mockLibro),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<LibroController>(LibroController);
    service = module.get(LibroService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of libros', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockLibro]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single libro by id', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockLibro);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should create a libro', async () => {
    const dto: LibroDto = {
      titulo: 'Nuevo Libro',
      autor: 'Autor X',
      fechaPublicacion: new Date().toISOString(),
      isbn: '9876543210',
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockLibro);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should update a libro by id', async () => {
    const dto: LibroDto = {
      titulo: 'Libro Actualizado',
      autor: 'Autor Z',
      fechaPublicacion: new Date().toISOString(),
      isbn: '0987654321',
    };
    const result = await controller.update(1, dto);
    expect(result).toEqual(mockLibro);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a libro by id', async () => {
    const result = await controller.delete(1);
    expect(result).toBeUndefined();
    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
