### Task

Build a Node.js application that will fetch data from external sources and then outputs the received data upon request.

1. Create a service that gets data from the endpoints below
   - [Posts](https://www.scalablepath.com/api/test/test-posts)
   - [Comments](https://www.scalablepath.com/api/test/test-comments)
2. Store the fetched data in a table for each of the resources.
3. Create a `/posts` endpoint that returns a list of all the posts.
4. Create another endpoint `/posts/{post_id}/comments` and return all comments from the specified post.
5. Create an endpoint to **soft delete** posts by a given id.
6. Create an endpoint that allows moving comments from one post to another.
7. Create an endpoint to add a new comment to a post.
8. Write tests for the app.

### Considerations

- You **must** use PostgreSQL.
- You **must** use TypeScript.
- You **must** use NestJS or Express.

### Bonus Tasks

1. Implement a cache layer.
2. Use Docker.

----------------------------------------------------------------------------------------------------------------------------

### Solution

## # Prisma basics

### *Create new migration*
`$ pnpm new-migration myMigration`

### *Run existing migrations*
`$ pnpm migrations`

### *Create new migration with changes before deploy*
`$ pnpm new-migration myMigration --create-only`

change SQL on migration as you need and after

`$ pnpm migrations`

## # Steps to setup

### *1 Configuration*

1. Create env file:
   >.env
2. Use env.sample to fill all envs with correct values
3. Make a pnpm install on your api local folder

### *2 Run*
`$ docker-compose up -d`

`$ pnpm new-migration init` or `$ pnpm migrations` if you already have migrations folder inside prisma folder.

`$ pnpm dev` to development version or `$ pnpm start` to prod version.

### *3 API Docs*
We have docs for the api in the endpoint `/doc`.

If you add new route files you will need to add the file at array in *swagger.ts* file.

You also can run `$ pnpm swagger-autogen` to update the docs although it's already runned when you run `$ pnpm dev`.

### *4 Thunder Client*
One way to make the endpoint test faster is by use this vscode extension.

We have a folder named thunder with all environments to import and of course,
with the collection.

Is very important to keep the collection updated. In this way all work will be easier.

If you prefer, can use postman too, but we will keep updating thunder collections.

Never used Thunder Client before? This [video](https://www.youtube.com/watch?v=6D0tz7tc-k0) can help!
