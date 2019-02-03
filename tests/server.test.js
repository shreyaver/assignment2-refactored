const Axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { server } = require('../server.js');

describe('the "ping" route', () => {
  const options = {
    method: 'GET',
    url: '/ping',
  };
  it('should respond with 200 for GET call', async () => {
    const response = await server.inject(options);
    expect(response.statusCode).toEqual(200);
  });
  it('should respond with string "pong"', async () => {
    const response = await server.inject(options);
    expect(response.result).toEqual('pong');
  });
});

describe('the "books" route', () => {
  const mockBooks = {
    books: [{
      Author: 'J K Rowling',
      id: 10,
      Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)',
    }, {
      Author: 'Sidney Sheldon',
      id: 80,
      Name: 'If Tomorrow Comes (Tracy Whitney Series, #1)',
    }, {
      Author: 'J K Rowling',
      id: 20,
      Name: 'Harry Potter and the Chamber of Secrets (Harry Potter, #2)',
    }, {
      Author: 'Sidney Sheldon',
      id: 100,
      Name: 'Tell Me Your Dreams',
    }],
  };
  const mockBooksAndRatings = {
    'J K Rowling': [{
      Author: 'J K Rowling',
      id: 10,
      Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)',
      rating: 4.62,
    }, {
      Author: 'J K Rowling',
      id: 20,
      Name: 'Harry Potter and the Chamber of Secrets (Harry Potter, #2)',
      rating: 4.62,
    }],
    'Sidney Sheldon': [{
      Author: 'Sidney Sheldon',
      id: 80,
      Name: 'If Tomorrow Comes (Tracy Whitney Series, #1)',
      rating: 4.62,
    }, {
      Author: 'Sidney Sheldon',
      id: 100,
      Name: 'Tell Me Your Dreams',
      rating: 4.62,
    }],
  };
  const getBooksAndRatingsMock = new MockAdapter(Axios);
  getBooksAndRatingsMock.onGet('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks').reply(200, mockBooks);
  const mockRatingsObj = { rating: 4.62 };

  const mockRatingsArray = [];
  mockBooks.books.forEach((book) => {
    mockRatingsArray.push(mockRatingsObj);
  });
  const url = new RegExp('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/[0-9]+');
  getBooksAndRatingsMock.onGet(url).reply(200, mockRatingsObj);
  const options = {
    method: 'GET',
    url: '/books',
  };
  it('should respond with 200 for GET call', async () => {
    const response = await server.inject(options);
    expect(response.statusCode).toEqual(200);
  });
  it('should respond with JSON object that has books and ratings', async () => {
    const response = await server.inject(options);
    expect(response.result).toEqual(mockBooksAndRatings);
  });
});