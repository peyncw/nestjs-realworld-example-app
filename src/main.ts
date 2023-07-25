if (!process.env.IS_TS_NODE) {
	require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { WhitelistBodyDtoValidationPipe } from './shared/pipes/whitelistBodyDtoValidation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.useGlobalPipes(new WhitelistBodyDtoValidationPipe());

	const config = new DocumentBuilder()
		.setTitle('Medium Clone example')
		.setDescription('Real World Medium Clone Nest.js ')
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	await app.listen(3000);
}
bootstrap();
