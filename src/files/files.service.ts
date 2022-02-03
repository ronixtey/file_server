import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import LocalFile from './files.entity';
import { unlink } from 'fs/promises';
import { User } from 'src/user/user.entitiy';

@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(LocalFile)
        private fileRepository: Repository<LocalFile>
    ) { }

    async saveFile(user: User, file: Express.Multer.File) {
        const newFile = await this.fileRepository.create({
            path: file.path,
            filename: file.originalname,
            mimetype: file.mimetype,
            // format: file.originalname.slice(file.originalname.lastIndexOf('.')),
            size: file.size
        });
        newFile.user = user;;

        await this.fileRepository.save(newFile);
        return newFile;
    }

    getFiles(user: User): Promise<LocalFile[]> {
        return this.fileRepository.find({ user });
    }

    async downloadFile(id: number, user: User, res): Promise<StreamableFile> {
        const file = await this.getFile(id, user);
``
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

    private async getFile(id: number, user: User): Promise<LocalFile> {
        const file = await this.fileRepository.findOne({
            where: { id, user }
        });

        if (!file) {
            throw new NotFoundException();
        }

        return file;
    }
}