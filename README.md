# ![Node/Express/Mongoose Example App](project-logo.png)

> ### NestJS codebase containing real world examples (CRUD, auth, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) API spec.


----------

# Getting started

## Installation

Clone the repository

    git clone https://github.com/peyncw/nestjs-realworld-example-app.git

Switch to the repo folder

    cd nestjs-realworld-example-app
    
Install dependencies
    
    npm install

set JsonWebToken secret key

    src/config.ts
    
----------

## Database

The codebase contains examples of two different database abstractions, namely [TypeORM](http://typeorm.io/)
    
The branch `main` implements TypeORM with a mySQL database.

----------

##### TypeORM

----------

Create a new mysql database with the name `mediumclone`\
(or the name you specified in the ormconfig.json)

Set TypeORM config database

    ormconfig.json
    
Set postgres database settings in ormconfig.json

    {
      type: 'postgres',
	    host: 'localhost',
	    port: 5432,
	    username: 'mediumclone',
	    password: '123',
	    database: 'mediumclone',
	    entities: [__dirname + '/**/*.entity{.ts,.js}'],
	    synchronize: false,
	    migrations: [__dirname + '/migrations/**/*{.ts,.js}']
    }
    
Start local postgres server and create new database 'mediumclone'

On application start, tables for all entities will be created.

----------

## API Specification

This application adheres to the api specifications set by the [Thinkster](https://github.com/gothinkster) team. This helps mix and match any backend with any other frontend without conflicts.

> [Full API Spec](https://github.com/gothinkster/realworld/tree/master/api)

More information regarding the project can be found here https://github.com/gothinkster/realworld

----------
## Before the first start

- `npm run db:migrate` to create a db table
- `npm run db:seed` to fill our data with test data

## Start application

- `npm run start`
- Test api with `http://localhost:3000/articles` in your favourite browser

----------

# Authentication
 
This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token. Please check the following sources to learn more about JWT.

----------
 
# Swagger API docs

This example repo uses the NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)        
