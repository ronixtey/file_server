import { Controller, Delete, Get, Param, Post, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import LocalFile from './files.entity';
import { FilesService } from './files.service';

@Controller('files')
@UseGuards(JwtAuthGuard)
// @ApiTags('files')
// @ApiBearerAuth()
// @ApiUnauthorizedResponse({ description: 'Unauthorized' })

export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File): Promise<LocalFile> {
        return this.filesService.saveFile(req.user, file);
    }

    /* @Get(':imgpath')
    getUploadedFile(@Param('imgpath') image, @Res() res) {
        return res.sendFile(image, { root: 'uploads' })
    } */


    @Get()
    getFiles(@Request() req): Promise<LocalFile[]> {
        return this.filesService.getFiles(req.user);
    }

    @Get(':id')
    async downloadFile(
        @Param('id') id: number,
        @Request() req,
        @Res({ passthrough: true }) res
    ) {
        return await this.filesService.downloadFile(id, req.user, res);
    }

    @Delete(':id')
    async deleteFile(@Param('id') id: number, @Request() req) {
        return await this.filesService.deleteFile(id, req.user);
    }

}