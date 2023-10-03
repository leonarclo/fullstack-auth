import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  Unique,
} from "typeorm";
import { User } from "./User";

export enum Role {
  ADMIN = "ADMIN",
  FREE = "FREE",
  PAID = "PAID",
}

@Entity("accounts")
@Unique(["id"])
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  email: string;

  @Column({ type: "enum", enum: Role, default: Role.FREE })
  role: Role;

  @Column("simple-array", { nullable: true })
  refresh_token: string[];

  @Column({ type: "text", nullable: true })
  access_token: string | null;

  @Column({ type: "timestamp", nullable: true })
  access_token_expires_at: Date | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;
}
