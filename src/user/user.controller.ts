import { Body, Controller, Get, Post, Put, Req, Response, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDto } from './dto/login.dto';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { UserResponseSchema } from './openapi/userResponse.schema';
import { UserRequestBody } from './openapi/userRequestBody.schema';
import { UserRequestBodyLogin } from './openapi/userRequestBodyLogin.schema';
import { UserResponseLogin } from './openapi/userResponseLogin.schema';
import { UserRequestBodyUpdate } from './openapi/userRequestBodyUpdate.schema';




@ApiTags('users')
@ApiBearerAuth()
@Controller()
export class UserController {
	constructor(private readonly userService: UserService) { }

	@ApiBody({ schema: UserRequestBody })
	@ApiResponse({
		status: 201,
		schema: UserResponseSchema,
		description: 'The User has been successfully created. Response',
	})
	@ApiResponse({ status: 422, description: 'Email, username has already been taken.' })
	@Post('users')
	@UsePipes(new BackendValidationPipe())
	async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
		const user = await this.userService.createUser(createUserDto);
		return this.userService.buildUserResponse(user);
	}

	@ApiBody({ schema: UserRequestBodyLogin })
	@ApiResponse({
		status: 201,
		schema: UserResponseLogin,
		description: 'The User has been successfully login. Response',
	})
	@ApiResponse({ status: 422, description: 'email or password is invalid.' })
	@Post('users/login')
	@UsePipes(new BackendValidationPipe())
	async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
		const user = await this.userService.login(loginUserDto);
		return this.userService.buildUserResponse(user);
	}

	@ApiResponse({
		status: 200,
		schema: UserResponseLogin,
		description: 'getting User has been successfully. Response',
	})
	@ApiResponse({ status: 401, description: 'Not authorized.' })
	@Get('user')
	@UseGuards(AuthGuard)
	async currentUser(
		@User() user: UserEntity
	): Promise<UserResponseInterface> {
		return this.userService.buildUserResponse(user);
	}

	@ApiBody({ schema: UserRequestBodyUpdate })
	@ApiResponse({
		status: 201,
		schema: UserResponseLogin,
		description: 'The User has been successfully update. Response',
	})
	@ApiResponse({ status: 401, description: 'Not authorized.' })
	@Put('user')
	@UseGuards(AuthGuard)
	@UsePipes(new BackendValidationPipe())
	async updateUser(
		@User('id') currentUserId: number,
		@Body('user') updateUserDto: UpdateUserDto
	): Promise<UserResponseInterface> {
		const user = await this.userService.updateUser(
			currentUserId,
			updateUserDto
		);
		return this.userService.buildUserResponse(user);
	}
}