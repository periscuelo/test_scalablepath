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
