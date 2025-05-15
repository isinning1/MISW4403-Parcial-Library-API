// libro.entity.ts
@Entity()
export class Libro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  autor: string;

  @Column({ type: 'date' })
  fechaPublicacion: Date;

  @Column()
  isbn: string;

  @ManyToMany(() => Biblioteca, biblioteca => biblioteca.libros)
  bibliotecas: Biblioteca[];
}
