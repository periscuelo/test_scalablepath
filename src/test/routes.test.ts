import request from "supertest";
import server from '../server';

describe('POST /comments/add', () => {
  it('should create a new comment', async () => {
    const response = await request(server)
      .post('/comments/add/6')
      .send({
        body: 'Great post!',
        name: 'John Doe',
        email: 'john@example.com'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.body).toBe('Great post!');
  });
});
