// src/libro/libro.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Biblioteca } from '../biblioteca/biblioteca.entity';

@Entity()
export class Libro {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column()
  autor!: string;

  @Column({ type: 'date' })
  fechaPublicacion!: Date;

  @Column()
  isbn!: string;

  @ManyToMany(() => Biblioteca, (biblioteca) => biblioteca.libros)
  bibliotecas!: Biblioteca[];
}
