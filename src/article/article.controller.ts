import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { FindAllQueryDto } from './dto/findAllQuery.dto';
import { GetFeedQueryDto } from './dto/getFeedQuery.dto copy';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentResponseInterface } from './types/commentResponse.interface';
import { CommentsResponseInterface } from './types/commentsResponse.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('articles')
@ApiBearerAuth()
@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) { }

	@Get()
	async findAll(@User('id') currentUserId: number, @Query(new BackendValidationPipe()) query: FindAllQueryDto):
		Promise<ArticlesResponseInterface> {
		return await this.articleService.findAll(currentUserId, query);
	}

	@Get('feed')
	@UseGuards(AuthGuard)
	async getFeed(@User('id') currentUserId: number, @Query(new BackendValidationPipe()) query: GetFeedQueryDto):
	 Promise<ArticlesResponseInterface>{
		return await this.articleService.getFeed(currentUserId, query);
	}

	@Get(':slug')
	async getSingleArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
		const article = await this.articleService.findBySlug(slug);
		return this.articleService.buildArticleResponse(article);
	}

	@Post()
	@UseGuards(AuthGuard)
	@UsePipes(new BackendValidationPipe())
	async create(@User() currentUser: UserEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<ArticleResponseInterface> {
		const article = await this.articleService.createArticle(currentUser, createArticleDto);
		return this.articleService.buildArticleResponse(article);
	}

	@Delete(':slug')
	@UseGuards(AuthGuard)
	async deleteArticle(@User('id') currentUserId: number, @Param('slug') slug: string) {
		return await this.articleService.deleteArticle(slug, currentUserId);
	}


	@Put(':slug')
	@UseGuards(AuthGuard)
	async updateArticle(@User('id') currentUserId: number, @Param('slug') slug: string, @Body('article') updateArticleDto: UpdateArticleDto): Promise<ArticleResponseInterface> {
		const article = await this.articleService.updateArticle(currentUserId, slug, updateArticleDto);
		return this.articleService.buildArticleResponse(article);
	}

	@Post(':slug/favorite')
	@UseGuards(AuthGuard)
	async addArticleToFavorites(@User('id') currentUserId: number, @Param('slug') slug: string):
		Promise<ArticleResponseInterface> {
		const article = await this.articleService.addArticleToFavorites(slug, currentUserId);
		return this.articleService.buildArticleResponse(article);
	}

	@Delete(':slug/favorite')
	@UseGuards(AuthGuard)
	async deleteArticleFromFavorites(@User('id') currentUserId: number, @Param('slug') slug: string):
		Promise<ArticleResponseInterface> {
		const article = await this.articleService.deleteArticleFromFavorites(slug, currentUserId);
		return this.articleService.buildArticleResponse(article);
	}

	@Get(':slug/comments')
	async getComments(@Param('slug') slug: string):
		Promise<CommentsResponseInterface> {
		return await this.articleService.getComments(slug);
	}

	@Post(':slug/comments')
	@UseGuards(AuthGuard)
	@UsePipes(new BackendValidationPipe())
	async createComment(@User() currentUser: UserEntity, @Param('slug') slug: string, @Body('comment') createCommentDto: CreateCommentDto):
		Promise<CommentResponseInterface> {
		const comment = await this.articleService.createComment(currentUser, slug, createCommentDto);
		return this.articleService.buildCommentResponse(comment);
	}

	@Delete(':slug/comments/:id')
	@UseGuards(AuthGuard)
	async deleteComment(@User('id') currentUserId: number, @Param('slug') slug: string, @Param('id') commentId: number) {
		return this.articleService.deleteComment(currentUserId, slug, commentId);
	}
}





