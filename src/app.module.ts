import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FilesModule } from './files/files.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      autoLoadEntities: true,   // forFeautre в каждом module
      dropSchema: true, // for dev
      synchronize: true // for dev
    }),
    MulterModule.register({
      dest: './uploads'
    }),
    UserModule,
    AuthModule,
    FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }