import {
  Entity,
  Column,
  CreateDateColumn,
  Unique,
  PrimaryColumn,
} from "typeorm";

export enum TokenType {
  VERIFY_EMAIL = "verify_email",
  RESET_PASSWORD = "reset_password",
  ACCESS_TOKEN = "access_token",
}

@Entity("tokens")
@Unique(["identifier", "token"])
export class Token {
  @PrimaryColumn()
  identifier: string;

  @Column({ unique: true })
  token: string;

  @Column({ type: "enum", enum: TokenType })
  token_type: TokenType;

  @Column({ type: "timestamp" })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
