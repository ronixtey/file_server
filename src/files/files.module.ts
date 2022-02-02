import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { FilesController } from './files.controller';
import LocalFile from './files.entity';
import { FilesService } from './files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocalFile]),
    UserModule,
    MulterModule.register({
      dest: './uploads'
    })
  ],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule { }
