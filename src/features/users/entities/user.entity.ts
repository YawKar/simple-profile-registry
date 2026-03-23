import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Index({ unique: true })
  @Column({ length: 16 })
  login!: string;
  @Index({ unique: true })
  @Column({ length: 254 })
  email!: string;
  @Column({ type: 'char', length: 96, select: false })
  hashedPassword!: string;
  @Check('check_age_range', 'age BETWEEN 1 AND 150')
  @Column({ type: 'integer' })
  age!: number;
  @Column({ length: 1000 })
  description!: string;

  @Column({ type: 'uuid', nullable: true })
  refreshToken!: string | null;

  @VersionColumn({ select: false })
  version!: number;
  @CreateDateColumn({ utc: true })
  createdAt!: Date;
  @UpdateDateColumn({ utc: true })
  updatedAt!: Date;
  @DeleteDateColumn({ utc: true, nullable: true })
  deletedAt!: Date | null;

  constructor(
    values: Omit<
      UserEntity,
      | 'id'
      | 'version'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
      | 'refreshToken'
    >,
  ) {
    Object.assign(this, values);
  }
}
