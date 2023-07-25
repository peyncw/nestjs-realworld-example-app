import { ArgumentMetadata, BadRequestException, HttpException, HttpStatus, Injectable, PipeTransform, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class WhitelistBodyDtoValidationPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {

		if (!value) {
			throw new BadRequestException('No data submitted');
		}

		if(metadata.type === 'body') {
			const object = plainToClass(metadata.metatype, value);
			await validate(object, { whitelist: true, forbidUnknownValues: false });
			return object;
		}
		return value;
	}
}
