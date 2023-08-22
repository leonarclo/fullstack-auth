import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique,
} from "typeorm";
import { User } from "./User";

export enum TypeAccount {
  ADMIN = "ADMIN",
  FREE = "FREE",
  PAID = "PAID",
}

@Entity("accounts")
@Unique(["id", "access_token"])
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  email: string;

  @Column({ type: "enum", enum: TypeAccount, default: TypeAccount.FREE })
  account_type: TypeAccount;

  @Column({ type: "text", nullable: true })
  access_token: string | null;

  @Column({ type: "timestamp", nullable: true })
  expires_at: Date | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;
}
