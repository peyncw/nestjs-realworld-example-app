import { ArticleType } from './aticle.type';

export interface ArticlesResponseInterface {
	articles: ArticleType[];
	articlesCount: number;
}