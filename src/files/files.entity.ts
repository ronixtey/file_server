import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @ManyToOne(() => User, (user) => user.files)
    user: User
}