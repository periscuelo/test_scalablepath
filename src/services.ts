import postRepository from './repositories/post';
import commentRepository from './repositories/comment';

interface ServiceObject {
  getDataFromThirdApi: () => Promise<void>;
}

const services: ServiceObject = {
  getDataFromThirdApi: async () => {
    const repositories: { [key: string]: any } = {
      postRepository,
      commentRepository
    }

    const urls = [{
      name: 'posts',
      url: 'https://www.scalablepath.com/api/test/test-posts',
      repository: 'postRepository'
    },{
      name: 'comments',
      url: 'https://www.scalablepath.com/api/test/test-comments',
      repository: 'commentRepository'
    }];

    for (const obj of urls) {
      const request = await fetch(obj.url);
      const repository = repositories[obj.repository];

      if (!request.ok) {
        throw new Error(`HTTP error! status: ${request.status}`);
      }

      const data = await request.json();

      if (repository) {
        const existData = await repository.count();
        if (existData < 1) {
          repository.createMany(data);
          console.log(`Creating data to ${obj.name}!`);
        } else {
          console.log(`Data from ${obj.name} already stored!`);
        }
      } else {
        throw new Error(`Repository function not found: ${obj.repository}`);
      }
    }
  }
}

export default services;
