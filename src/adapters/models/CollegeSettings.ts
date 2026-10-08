import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('college_settings')
export class CollegeSettings {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', default: 'Westbridge College' })
  name!: string;

  @Column({ type: 'varchar', default: '2026 – 2027' })
  year!: string;

  @Column({ type: 'text', nullable: true })
  logo?: string;

  @UpdateDateColumn()
  updatedAt!: Date;
}
