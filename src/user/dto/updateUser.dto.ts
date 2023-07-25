import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	readonly username: string;

	@IsOptional()
	@IsEmail()
	readonly email: string;

	@IsOptional()
	@IsString()
	readonly bio: string;

	@IsOptional()
	@IsString()
	readonly image: string;
}