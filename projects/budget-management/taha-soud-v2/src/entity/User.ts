import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column("float", { default: 0 }) // Using 'float' to ensure it's treated as a number
  balance: number;

  constructor(
    userName: string,
    firstName: string,
    lastName: string,
    balance: number = 0
  ) {
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.balance = balance;
  }
}
