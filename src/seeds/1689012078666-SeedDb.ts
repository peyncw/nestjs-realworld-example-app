import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1689012078666 implements MigrationInterface {
    name = 'SeedDb1689012078666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO tags (name) VALUES ('dragons'), ('coffe'), ('nestjs')`,
        );
        //password: root
        await queryRunner.query(
            `INSERT INTO users (username, email, password) VALUES ('test1', 'test1@gmail.com', '$2b$10$.M/8iPFURiRp2epVL86TQ.eUPlcsK28L330T53kbturNnyUsb0L5q'), ('test2', 'test2@gmail.com', '$2b$10$.M/8iPFURiRp2epVL86TQ.eUPlcsK28L330T53kbturNnyUsb0L5q'), ('test3', 'test3@gmail.com', '$2b$10$.M/8iPFURiRp2epVL86TQ.eUPlcsK28L330T53kbturNnyUsb0L5q')`,
        );
        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'first article', 'first article descr', 'first article body', 'coffee,dragons', 1), ('first-article2', 'first article2', 'first article descr2', 'first article body2', 'coffee,dragons', 2), ('first-article3', 'first article3', 'first article descr3', 'first article body3', 'coffee,dragons', 3), ('first-article13', 'first article13', 'first article descr13', 'first article body13', 'coffee,dragons', 1), ('first-article12', 'first article12', 'first article descr12', 'first article body12', 'coffee,dragons', 1), ('first-article1', 'first article1', 'first article descr1', 'first article body1', 'coffee,dragons', 1)`,
        );
    }

    public async down(): Promise<void> { }

}
