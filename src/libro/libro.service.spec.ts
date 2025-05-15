// src/libro/libro.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LibroService } from './libro.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Libro } from './libro.entity';
import { Repository } from 'typeorm';

describe('LibroService', () => {
  let service: LibroService;
  let repo: Repository<Libro>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibroService,
        {
          provide: getRepositoryToken(Libro),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LibroService>(LibroService);
    repo = module.get<Repository<Libro>>(getRepositoryToken(Libro));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return one libro from findOne()', async () => {
    const mockLibro = {
      id: 1,
      titulo: 'Libro 1',
      autor: 'Autor A',
      fechaPublicacion: new Date(),
      isbn: '1234567890',
      bibliotecas: [],
    };

    jest.spyOn(repo, 'findOne').mockResolvedValue(mockLibro);

    const libro = await service.findOne(1);
    expect(libro).toEqual(mockLibro);
  });
});
