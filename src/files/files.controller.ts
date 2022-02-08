import { Body, Controller, Delete, Get, Param, Post, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesService } from './files.service';
import LocalFile from './files.entity';
import { ShareFileDto } from './share_file.dto';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('files')
@ApiTags('files')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiCreatedResponse({ description: 'File uploaded' })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File): Promise<LocalFile> {
        return this.filesService.saveFile(req.user, file);
    }



    /* @Get(':imgpath')
    getUploadedFile(@Param('imgpath') image, @Res() res) {
        return res.sendFile(image, { root: 'uploads' })
    } */


    @Get()
    @ApiNotFoundResponse({ description: 'User does not have any file' })
    @ApiOkResponse({ description: 'List all current user\'s files' })
    getFiles(@Request() req): Promise<LocalFile[]> {
        return this.filesService.getFiles(req.user);
    }

    @Get(':id')
    @ApiNotFoundResponse({ description: 'User does not have file with specified id' })
    @ApiOkResponse({ description: 'Get user\'s file with specified id' })
    async downloadFile(
        @Param('id') id: number,
        @Request() req,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.filesService.downloadFile(id, req.user, res)
        // .carch(error) => { throw error }
    }

    @ApiNotFoundResponse({ description: 'User does not have file with specified id' })
    @ApiOkResponse({ description: 'File deleted' })
    // error case
    @Delete(':id')
    async deleteFile(@Param('id') id: number, @Request() req) {
        return await this.filesService.deleteFile(id, req.user);
    }

    @Post('share/:id')
    @ApiBody({ type: ShareFileDto })
    @ApiNotFoundResponse({ description: 'User does not have file with specified id' })
    @ApiCreatedResponse({ description: 'File has been shared with user' })
    async shareFile(@Param('id') id: number, @Request() req, @Body() targetUser: ShareFileDto) {
        return await this.filesService.acessFIle(id, req.user, targetUser);
    }

    @Post('unshare/:id')
    @ApiBody({ type: ShareFileDto })
    @ApiNotFoundResponse({ description: 'User does not have file with specified id' })
    @ApiCreatedResponse({ description: 'File has been unshared with user' })
    async unshareFile(@Param('id') id: number, @Request() req, @Body() targetUser: ShareFileDto) {
        return await this.filesService.acessFIle(id, req.user, targetUser, false);
    }
}