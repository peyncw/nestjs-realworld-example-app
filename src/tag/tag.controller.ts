import { Controller, Get } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagController {
	constructor(private readonly TagService: TagService) { }

	@Get()
	async findAll(): Promise<{ tags: string[] }> {
		const tags = await this.TagService.findAll();
		return {
			tags: tags.map(tag => tag.name)
		}
	}
}