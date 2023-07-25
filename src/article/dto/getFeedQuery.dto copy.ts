import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetFeedQueryDto {
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