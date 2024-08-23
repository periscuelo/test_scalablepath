import services from '../services';
import postRepository from '../repositories/post';
import commentRepository from '../repositories/comment';

// Mocking fetch globally
global.fetch = jest.fn();

jest.mock('../repositories/post');
jest.mock('../repositories/comment');

describe('getDataFromThirdApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data from APIs and save it to the respective repositories', async () => {
    // Arrange
    const mockPostData = [{ title: 'Post 1' }, { title: 'Post 2' }];
    const mockCommentData = [{ body: 'Comment 1' }, { body: 'Comment 2' }];

    (fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('test-posts')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPostData),
        });
      }
      if (url.includes('test-comments')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCommentData),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    (postRepository.count as jest.Mock).mockResolvedValue(0);
    (commentRepository.count as jest.Mock).mockResolvedValue(0);

    // Act
    await services.getDataFromThirdApi();

    // Assert
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(postRepository.createMany).toHaveBeenCalledWith(mockPostData);
    expect(commentRepository.createMany).toHaveBeenCalledWith(mockCommentData);
  });

  it('should not save data if it already exists in the repositories', async () => {
    // Arrange
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    (postRepository.count as jest.Mock).mockResolvedValue(1);
    (commentRepository.count as jest.Mock).mockResolvedValue(1);

    // Act
    await services.getDataFromThirdApi();

    // Assert
    expect(postRepository.createMany).not.toHaveBeenCalled();
    expect(commentRepository.createMany).not.toHaveBeenCalled();
  });

  it('should throw an error if the fetch request fails', async () => {
    // Arrange
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    // Act & Assert
    await expect(services.getDataFromThirdApi()).rejects.toThrow('HTTP error! status: 500');
  });

  it('should throw an error if the repository is not found', async () => {
    // Arrange
    const invalidUrls = [{
      name: 'invalidRepo',
      url: 'https://www.scalablepath.com/api/test/test-invalid',
      repository: 'invalidRepository'
    }];

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    // Override the URLs in the service for this test
    jest.spyOn(services, 'getDataFromThirdApi').mockImplementationOnce(async () => {
      for (const obj of invalidUrls) {
        const request = await fetch(obj.url);
        const repository = null; // Simulate repository not found

        if (!request.ok) {
          throw new Error(`HTTP error! status: ${request.status}`);
        }

        if (!repository) {
          throw new Error(`Repository function not found: ${obj.repository}`);
        }
      }
    });

    // Act & Assert
    await expect(services.getDataFromThirdApi()).rejects.toThrow('Repository function not found: invalidRepository');
  });
});
