import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  image: string;

  @Column({ type: "timestamp", nullable: true })
  verified_email: Date;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
