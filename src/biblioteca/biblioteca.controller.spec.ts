import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaController } from './biblioteca.controller';
import { BibliotecaService } from './biblioteca.service';
import { Biblioteca } from './biblioteca.entity';

describe('BibliotecaController', () => {
  let controller: BibliotecaController;
  let service: BibliotecaService;

  const mockService = {
    findAll: jest.fn().mockResolvedValue([
      { id: 1, nombre: 'Biblioteca 1' },
      { id: 2, nombre: 'Biblioteca 2' },
    ]),
    findOne: jest.fn().mockResolvedValue({ id: 1, nombre: 'Biblioteca 1' }),
    create: jest.fn().mockResolvedValue({ id: 3, nombre: 'Nueva Biblioteca' }),
    update: jest.fn().mockResolvedValue({ id: 1, nombre: 'Actualizada' }),
    delete: jest.fn().mockResolvedValue({ id: 1, nombre: 'Eliminada' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BibliotecaController],
      providers: [
        {
          provide: BibliotecaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<BibliotecaController>(BibliotecaController);
    service = module.get<BibliotecaService>(BibliotecaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll() debe retornar una lista de bibliotecas', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      { id: 1, nombre: 'Biblioteca 1' },
      { id: 2, nombre: 'Biblioteca 2' },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne() debe retornar una biblioteca por ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual({ id: 1, nombre: 'Biblioteca 1' });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('create() debe crear una biblioteca', async () => {
    const dto: Partial<Biblioteca> = { nombre: 'Nueva Biblioteca' };
    const result = await controller.create(dto);
    expect(result).toEqual({ id: 3, nombre: 'Nueva Biblioteca' });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('update() debe actualizar una biblioteca', async () => {
    const dto: Partial<Biblioteca> = { nombre: 'Actualizada' };
    const result = await controller.update(1, dto);
    expect(result).toEqual({ id: 1, nombre: 'Actualizada' });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('delete() debe eliminar una biblioteca', async () => {
    const result = await controller.delete(1);
    expect(result).toEqual({ id: 1, nombre: 'Eliminada' });
    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
