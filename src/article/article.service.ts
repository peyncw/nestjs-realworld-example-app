import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/createArticle.dto';
import { ArticleEntity } from './article.entity';
import { InjectRepository, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/updateArticle.dto';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { FindAllQueryDto } from './dto/findAllQuery.dto';
import { GetFeedQueryDto } from './dto/getFeedQuery.dto copy';
import { FollowEntity } from '@app/profile/follow.entity';
import { CommentEntity } from './comment.entity';
import { CommentResponseInterface } from './types/commentResponse.interface';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentsResponseInterface } from './types/commentsResponse.interface';

@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
		@InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
		private dataSource: DataSource
	) { }

	async findAll(currentUserId: number, query: FindAllQueryDto): Promise<ArticlesResponseInterface> {
		const queryBuilder = this.dataSource.getRepository(ArticleEntity)
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author');

		queryBuilder.orderBy('articles.createdAt', 'DESC');

		if (query.tag) {
			queryBuilder.andWhere('articles.tagList LIKE :tag', {
				tag: `%${query.tag}%`
			})
		}

		if (query.author) {
			const author = await this.userRepository.findOne({
				where: {
					username: query.author
				}
			});
			queryBuilder.andWhere('articles.authorId = :id', {
				id: author ? author.id : -1
			});
		}

		if (query.favorited) {
			const author = await this.dataSource.getRepository(UserEntity)
				.createQueryBuilder('users')
				.where({ username: query.favorited })
				.loadAllRelationIds({ relations: ['favorites'] })
				.getOne();

			const ids = author ? author.favorites : [-1];

			queryBuilder.andWhere('articles.id IN (:...ids)', { ids: ids });
		}

		if (query.limit) {
			queryBuilder.limit(query.limit);
		}

		if (query.offset) {
			queryBuilder.offset(query.offset);
		}

		let favoriteIds: number[] = [];

		if (currentUserId) {
			const currentUser = await this.dataSource.getRepository(UserEntity)
				.createQueryBuilder('users')
				.where({ id: currentUserId })
				.loadAllRelationIds({ relations: ['favorites'] })
				.getOne();

			favoriteIds = currentUser ? (currentUser.favorites as any[]) : [];
		}

		const articlesCount = await queryBuilder.getCount();

		const articles = await queryBuilder.getMany();

		const articlesWithFavorites = articles.map((article) => {
			const favorited = favoriteIds.includes(article.id);
			return { ...article, favorited }
		});

		return { articles: articlesWithFavorites, articlesCount };
	}

	async getFeed(currentUserId: number, query: GetFeedQueryDto): Promise<ArticlesResponseInterface> {
		const follows = await this.followRepository.find({ where: { followerId: currentUserId } });

		if (follows.length === 0) {
			return { articles: [], articlesCount: 0 };
		}

		const followingUserIds = follows.map(follow => follow.followingId);

		const queryBuilder = this.dataSource.getRepository(ArticleEntity)
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author')
			.where('articles.authorId IN (:...ids)', { ids: followingUserIds });

		queryBuilder.orderBy('articles.createdAt', "DESC");

		const articlesCount = await queryBuilder.getCount();

		if (query.limit) {
			queryBuilder.limit(query.limit);
		}

		if (query.offset) {
			queryBuilder.offset(query.offset);
		}

		const articles = await queryBuilder.getMany();

		return { articles, articlesCount };
	}

	async createArticle(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
		const article = new ArticleEntity;
		Object.assign(article, createArticleDto);

		if (!article.tagList) {
			article.tagList = [];
		}

		article.slug = this.getSlug(createArticleDto.title);

		article.author = currentUser;

		return await this.articleRepository.save(article);
	}

	async findBySlug(slug: string): Promise<ArticleEntity> {
		return await this.articleRepository.findOne({ where: { slug } });
	}

	async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
		const article = await this.findBySlug(slug);

		if (!article) {
			throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
		}

		if (article.author.id !== currentUserId) {
			throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
		}

		return await this.articleRepository.delete({ slug });
	}

	async updateArticle(currentUserId: number, slug: string, updateArticleDto: UpdateArticleDto): Promise<ArticleEntity> {
		if (Object.keys(updateArticleDto).length === 0) {
			throw new HttpException('No fields for updates', HttpStatus.BAD_REQUEST);
		}

		const article = await this.findBySlug(slug);

		if (!article) {
			throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
		}

		if (article.author.id !== currentUserId) {
			throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
		}

		Object.assign(article, updateArticleDto);

		return await this.articleRepository.save(article);
	}

	async addArticleToFavorites(slug: string, currentUserId: number): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);
		// const user = await this.userRepository.findOne({
		// 	where: { id: currentUserId },
		// 	relations: ['favorites']
		// });

		const isNotFavorite = await this.dataSource
			.getRepository(UserEntity)
			.createQueryBuilder("users")
			.where("users.id = :id", { id: currentUserId })
			.leftJoin("users.favorites", "article")
			.where("article.id = :id", { id: article.id })
			.getOne() === null;

		// const isNotFavorite = user.favorites.findIndex((articleInFavorties) => articleInFavorties.id === article.id) === -1;

		if (isNotFavorite) {
			// user.favorites.push(article);
			article.favoritesCount++;
			// await this.userRepository.save(user);
			await this.dataSource
				.createQueryBuilder()
				.relation(UserEntity, "favorites")
				.of(currentUserId)
				.add(article);
			await this.articleRepository.save(article);
		}

		return article;
	}

	async deleteArticleFromFavorites(slug: string, currentUserId: number): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);

		const isFavorite = await this.dataSource
			.getRepository(UserEntity)
			.createQueryBuilder("users")
			.where("users.id = :id", { id: currentUserId })
			.leftJoin("users.favorites", "article")
			.where("article.id = :id", { id: article.id })
			.getOne() !== null;

		if (isFavorite) {
			article.favoritesCount--;
			await this.dataSource
				.createQueryBuilder()
				.relation(UserEntity, "favorites")
				.of(currentUserId)
				.remove(article);
			await this.articleRepository.save(article);
		}

		return article;
	}

	async getComments(slug: string): Promise<CommentsResponseInterface> {
		const comments = await this.dataSource
			.getRepository(CommentEntity)
			.createQueryBuilder('comments')
			.leftJoin("comments.article", "article")
			.where("article.slug = :slug", { slug: slug })
			.leftJoinAndSelect("comments.author", "author")
			.select(['comments', 'author.id', 'author.username', 'author.bio', 'author.image'])
			.orderBy('comments.createdAt', 'DESC')
			.getMany();

		return { comments };
	}

	async createComment(currentUser: UserEntity, slug: string, createCommentDto: CreateCommentDto): Promise<CommentEntity> {
		const article = await this.findBySlug(slug);

		if (!article) {
			throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
		}

		const comment = new CommentEntity;
		Object.assign(comment, createCommentDto);

		comment.article = article;

		comment.author = currentUser;

		return await this.commentRepository.save(comment);
	}

	async deleteComment(currentUserId: number, slug: string, commentId: number): Promise<DeleteResult> {
		const comment = await this.commentRepository.findOne({
			where: {
				id: commentId,
				article: { slug: slug },
				author: { id: currentUserId }
			}
		});
		
		if (!comment) {
			throw new HttpException('Comment does not exist or You are not an author', HttpStatus.NOT_FOUND);
		}

		return await this.commentRepository.delete({ id: commentId });
	}

	buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
		return { article };
	}

	buildCommentResponse(comment: CommentEntity): CommentResponseInterface {
		delete comment.article;
		delete comment.author.email;
		return { comment };
	}

	private getSlug(title: string): string {
		return slugify(title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
	}


}