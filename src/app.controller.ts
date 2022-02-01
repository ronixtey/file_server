import { Controller, Get, Param, Post, Request, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guards';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  // @ApiCreatedResponse({ description: 'User login and get jwt token' })
  // @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  // @ApiBody({ type: CreateUserDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiUnauthorizedResponse({ description: 'Invalid JWT token' })
  // @ApiOkResponse({ description: 'Get profile' })
  getProfile(@Request() req) {
    return req.user;
  }  
}
