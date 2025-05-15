// src/libro/libro.dto.ts
import { IsString, IsDateString, Length } from 'class-validator';

export class LibroDto {
  @IsString()
  @Length(1, 100)
  titulo!: string;

  @IsString()
  @Length(1, 100)
  autor!: string;

  @IsDateString()
  fechaPublicacion!: string;

  @IsString()
  @Length(10, 20)
  isbn!: string;
}
