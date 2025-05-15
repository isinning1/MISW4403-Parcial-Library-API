// biblioteca.entity.ts
@Entity()
export class Biblioteca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  ciudad: string;

  @Column()
  horarioAtencion: string;

  @ManyToMany(() => Libro, libro => libro.bibliotecas, { cascade: true })
  @JoinTable()
  libros: Libro[];
}
