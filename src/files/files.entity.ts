import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/user.entitiy";

@Entity()
export default class LocalFile {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    filename: string;

    @Column()
    path: string;

    @Column()
    mimetype: string;

    // @Column()
    // format: string

    @Column()
    size: number

    @ManyToMany(() => User, (user: User) => user.files)
    users: User[]
}