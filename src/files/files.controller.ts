import { Controller, Delete, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {

    @Post()
    @UseInterceptors(FilesInterceptor('image'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
    }

    @Get(':imgpath')
    getUploadedFile(@Param('imgpath') image, @Res() res) {
        return res.sendFile(image, { root: 'uploads' })
    }

    @Get()
    getFiles() {

    }
    
    @Delete()
    deleteFile() {

    }

}
