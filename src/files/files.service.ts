import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import LocalFile from './files.entity';
import { unlink } from 'fs/promises';
import { User } from 'src/user/user.entitiy';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(LocalFile)
        private fileRepository: Repository<LocalFile>,
        private userService: UserService
    ) { }

    async saveFile(user: User, file: Express.Multer.File) {
        const newFile = await this.fileRepository.create({
            path: file.path,
            filename: file.originalname,
            mimetype: file.mimetype,
            // format: file.originalname.slice(file.originalname.lastIndexOf('.')),
            size: file.size,
            users: [user]
        });
        await this.fileRepository.save(newFile);

        return newFile;
    }

    getFiles(user: User): Promise<LocalFile[]> {
        return this.fileRepository.createQueryBuilder('file')
            .innerJoinAndSelect('file.users', 'user')
            .where('user.id = :userId', { userId: user.id })
            .getMany();
    }

    async downloadFile(id: number, user: User, res): Promise<StreamableFile> {
        const file = await this.getFile(id, user);
        
        const stream = createReadStream(join(process.cwd(), file.path));
        res.set({
            // attachment - download, inline - show
            'Content-Disposition': `attachment; filename="${file.filename} "`,
            'Content-Type': file.mimetype
        })

        return new StreamableFile(stream);
    }

    async deleteFile(id: number, user: User) {
        const file = await this.getFile(id, user);

        try {
            await unlink(file.path);
            return `File ${file.filename} deleted successfully`;
        } catch (error) {
            return error.message;
        }
    }

    async shareFile(id: number, user: User, targetUserId: number): Promise<LocalFile> {
        const file = await this.getFile(id, user);
        
        file.users.push(await this.userService.findOne(targetUserId));
        this.fileRepository.save(file);

        return file;
    }

    async unshareFile(id: number, user: User, targetUserId: number): Promise<LocalFile> {
        const file = await this.getFile(id, user);

        file.users.filter((user) => user.id != targetUserId);
        this.fileRepository.save(file);

        return file;
    }

    private async getFile(id: number, user: User): Promise<LocalFile> {
        /* const file = await this.fileRepository.findOne({
            where: { id, user }
        }); */
        const file = await this.fileRepository.createQueryBuilder('file')
            .innerJoinAndSelect('file.users', 'user')
            .where('user.id = :userId', { userId: user.id })
            .andWhere('file.id = :fileId', { fileId: id })
            .getOne();


        if (!file) {  
            throw new NotFoundException();
        }

        return file;
    }
}