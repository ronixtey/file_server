import { ApiProperty } from "@nestjs/swagger";

export class ShareFileDto {
    @ApiProperty({ type: Number, description: 'ID of user who to share/unshare' })
    userId: number;
}