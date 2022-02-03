import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import LocalFile from 'src/files/files.entity';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @ManyToMany(() => LocalFile, (file: LocalFile) =>
        file.users/* , {
            cascade: true
    } */)
    @JoinTable()
    files: LocalFile[];
}