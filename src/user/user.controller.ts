import { Body, Controller, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.tdo";
import { User } from "./user.entitiy";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) { }

    @Post('create')
    @ApiTags('user')
    @ApiCreatedResponse({ description: 'User registration' })
    @ApiBadRequestResponse({description: 'Username already exists'})
    @ApiBody({type: CreateUserDto})
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }
}