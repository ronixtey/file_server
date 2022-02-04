import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.tdo';
import { User } from './user.entitiy';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        let user = new User();
        user.username = createUserDto.username;                                                                                                             
        user.password = await bcrypt.hash(createUserDto.password, 10);

        try {
            user = await this.userRepository.save(user);
        } catch (error) {
            if (error.code === PostgresErrorCode.UniqueViolation)
                throw new BadRequestException('User with this username already exists');
        }
        return user;
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne(id);

        if (!user) {
            throw new NotFoundException(`User with id ${id} does not exist`);
        }

        return user;
    }

    async findByName(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ username });
    }
}