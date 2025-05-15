import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaLibroService } from './biblioteca-libro.service';

describe('BibliotecaLibroService', () => {
  let service: BibliotecaLibroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BibliotecaLibroService],
    }).compile();

    service = module.get<BibliotecaLibroService>(BibliotecaLibroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
