import { IsString, Length, Matches } from 'class-validator';

export class BibliotecaDto {
  @IsString()
  @Length(1, 100)
  nombre!: string;

  @IsString()
  @Length(1, 200)
  direccion!: string;

  @IsString()
  @Length(1, 100)
  ciudad!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}-\d{2}:\d{2}$/, {
    message:
      'El horario debe estar en formato HH:MM-HH:MM (por ejemplo, 08:00-18:00)',
  })
  horarioAtencion!: string;
}
