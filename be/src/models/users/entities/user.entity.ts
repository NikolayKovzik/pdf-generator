import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'varchar',
  })
  firstName: string;

  @Column({
    type: 'varchar',
  })
  lastName: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    nullable: true,
    type: 'varchar',
    default: () => 'NULL',
  })
  refreshToken: string;

  @Column({
    nullable: true,
    type: 'varchar',
    default: () => 'NULL',
  })
  image: string | null;

  @Column({
    nullable: true,
    type: 'bytea',
    default: () => 'NULL',
  })
  pdf: Uint8Array | null;
}
