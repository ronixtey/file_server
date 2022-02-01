import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.tdo';
import { User } from './user.entitiy';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.username = createUserDto.username;

        user.password = await bcrypt.hash(createUserDto.password, 10);
        return this.userRepository.save(user);
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