import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({type: String, description: 'Users login'})
    username: string;
    
    @ApiProperty({ type: String, description: 'Users password' })
    password: string;
}