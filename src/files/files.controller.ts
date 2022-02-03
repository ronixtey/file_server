import { Body, Controller, Delete, Get, Param, Post, Req, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import LocalFile from './files.entity';
import { FilesService } from './files.service';

@UseGuards(JwtAuthGuard)
@Controller('files')
@ApiTags('files')
// @ApiBearerAuth()
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
        @Res({ passthrough: true }) res
    ) {
        return await this.filesService.downloadFile(id, req.user, res);
    }

    @ApiNotFoundResponse({ description: 'User does not have file with specified id' })
    // error case
    @Delete(':id')
    async deleteFile(@Param('id') id: number, @Request() req) {
        return await this.filesService.deleteFile(id, req.user);
    }

    @ApiNotFoundResponse({ description: 'User does not have file with specified id' })
    @Post('share/:id')
    async shareFile(@Param('id') id: number, @Request() req, @Body() targetUser) {  
        return await this.filesService.shareFile(id, req.user, targetUser.userId);
    }

    @ApiNotFoundResponse({ description: 'User does not have file with specified id' })
    @Post('unshare/:id')
    async unshareFile(@Param('id') id: number, @Request() req, @Body() targetUser) {
        return await this.filesService.unshareFile(id, req.user, targetUser.userId);
    }

}