import { Transform, Type } from 'class-transformer';
import { IsInt, IsNumber, IsNumberString, IsOptional, IsString, Min } from 'class-validator';

export class FindAllQueryDto {
	@IsOptional()
	@IsString()
	readonly tag?: string;

	@IsOptional()
	@IsString()
	readonly author?: string;

	@IsOptional()
	@IsString()
	readonly favorited?: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	readonly limit?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	readonly offset?: number;
}