import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity ('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column({unique: true})
    email!: string;
    @Column()
    name!: string;
    @Column()
    password!: string;   
    @CreateDateColumn()
    createdAt!: Date;
    @Column({default: 'user'})
    role!: string;
}
