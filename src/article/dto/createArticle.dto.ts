import { Allow, IsNotEmpty } from 'class-validator'

export class CreateArticleDto {
	@IsNotEmpty()
	readonly title: string;

	@IsNotEmpty()
	readonly description: string;

	@IsNotEmpty()
	readonly body: string;

	@Allow()
	readonly tagList?: string[];
}