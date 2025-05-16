import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaLibroController } from './biblioteca-libro.controller';
import { BibliotecaLibroService } from './biblioteca-libro.service';

describe('BibliotecaLibroController', () => {
  let controller: BibliotecaLibroController;
  let service: BibliotecaLibroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BibliotecaLibroController],
      providers: [
        {
          provide: BibliotecaLibroService,
          useValue: {
            addBookToLibrary: jest.fn().mockResolvedValue('Libro agregado'),
            findBooksFromLibrary: jest
              .fn()
              .mockResolvedValue(['Libro 1', 'Libro 2']),
            findBookFromLibrary: jest
              .fn()
              .mockResolvedValue('Libro específico'),
            updateBooksFromLibrary: jest
              .fn()
              .mockResolvedValue(['Libro A', 'Libro B']),
            deleteBookFromLibrary: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<BibliotecaLibroController>(
      BibliotecaLibroController,
    );
    service = module.get<BibliotecaLibroService>(BibliotecaLibroService);
  });

  it('debe asociar un libro a una biblioteca', async () => {
    const result = await controller.addBookToLibrary(1, 10);
    expect(result).toBe('Libro agregado');
    expect(service.addBookToLibrary).toHaveBeenCalledWith(1, 10);
  });

  it('debe eliminar un libro de una biblioteca', async () => {
    const result = await controller.deleteBookFromLibrary(1, 10);
    expect(result).toBeUndefined();
    expect(service.deleteBookFromLibrary).toHaveBeenCalledWith(1, 10);
  });
});
