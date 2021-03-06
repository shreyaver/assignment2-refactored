const Axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const Model = require('../models');
const { server } = require('../server.js');
const { ALL_BOOKS_URL, RATING_BY_ID_URL } = require('../constants');

let mockBooks;
let getBooksAndRatingsMock;
let mockRatingsObj;
const mockRatingsArray = [];
let mockBooksAndRatings;
beforeAll(() => {
  mockBooks = {
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
  mockBooksAndRatings = {
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
  mockBooksAndRatingsDatabase = [
    {
      Author: 'J K Rowling',
      id: 10,
      Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)',
      rating: 4.62,
    }, {
      Author: 'Sidney Sheldon',
      id: 80,
      Name: 'If Tomorrow Comes (Tracy Whitney Series, #1)',
      rating: 4.62,
    }, {
      Author: 'J K Rowling',
      id: 20,
      Name: 'Harry Potter and the Chamber of Secrets (Harry Potter, #2)',
      rating: 4.62,
    }, {
      Author: 'Sidney Sheldon',
      id: 100,
      Name: 'Tell Me Your Dreams',
      rating: 4.62,
    }];
  getBooksAndRatingsMock = new MockAdapter(Axios);
  getBooksAndRatingsMock.onGet(ALL_BOOKS_URL).reply(200, mockBooks);
  mockRatingsObj = { rating: 4.62 };
  mockBooks.books.forEach((book) => {
    mockRatingsArray.push(mockRatingsObj);
  });
  const url = new RegExp(`${RATING_BY_ID_URL}/[0-9]+`);
  getBooksAndRatingsMock.onGet(url).reply(200, mockRatingsObj);
});
beforeEach(() => Model.books.truncate());


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
describe('the "books/create" route', () => {
  const options = {
    method: 'GET',
    url: '/books/create',
  };
  it('should respond with 200 for GET call', async () => {
    const response = await server.inject(options);
    expect(response.statusCode).toEqual(200);
  });
  it('should store books and ratings in database', async (done) => {
    const response = await server.inject(options);
    Model.books.count().then((countInDatabase) => {
      expect(response.result.length).toEqual(countInDatabase);
      done();
    }).catch((errorObj) => {
      console.log(errorObj.message);
    });
  });
});

describe('the "book/{id}" route with POST', () => {
  it('should give message if book with given id does not exist', async (done) => {
    const options = {
      method: 'POST',
      url: '/book/10',
      payload: {
        liked: true,
      },
    };
    await server.inject(options).then((likeDislikeState) => {
      expect(likeDislikeState.result).toEqual("Book with id: 10 doesn't exist");
      done();
    }).catch((errorObj) => {
      console.log(errorObj.message);
    });
  });
  it('should remove dislike for book and add like', async (done) => {
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    const options = {
      method: 'POST',
      url: '/book/10',
      payload: {
        liked: true,
      },
    };
    await Model.books.generate(bookObj).then(async () => {
      await server.inject(options).then((likeDislikeState) => {
        expect(likeDislikeState.result).toEqual('\nRemoved dislike\nBook liked!');
        done();
      }).catch((errorObj) => {
        console.log(errorObj.message);
      });
    }).catch((errorObj) => {
      console.log(errorObj.message);
    });
  });
  it('should give message if book already liked', async (done) => {
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    const options = {
      method: 'POST',
      url: '/book/10',
      payload: {
        liked: true,
      },
    };
    await Model.books.generate(bookObj).then(async () => {
      await Model.books.addLikeDislike(bookObj.id, true).then(async () => {
        await server.inject(options).then((likeDislikeState) => {
          expect(likeDislikeState.result).toEqual('\nBook already liked');
          done();
        }).catch((errorObj) => {
          console.log(errorObj.message);
        });
      }).catch((errorObj) => {
        console.log(errorObj.message);
      });
    }).catch((errorObj) => {
      console.log(errorObj.message);
    });
  });

  it('should give message if book already disliked', async (done) => {
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    const options = {
      method: 'POST',
      url: '/book/10',
      payload: {
        liked: false,
      },
    };
    await Model.books.generate(bookObj).then(async () => {
      await server.inject(options).then((likeDislikeState) => {
        expect(likeDislikeState.result).toEqual('\nBook already disliked');
        done();
      }).catch((errorObj) => {
        console.log(errorObj.message);
      });
    }).catch((errorObj) => {
      console.log(errorObj.message);
    });
  });

  it('should remove like for book and add dislike', async (done) => {
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    const options = {
      method: 'POST',
      url: '/book/10',
      payload: {
        liked: false,
      },
    };
    await Model.books.generate(bookObj).then(async () => {
      await Model.books.addLikeDislike(bookObj.id, true).then(async () => {
        await server.inject(options).then((likeDislikeState) => {
          expect(likeDislikeState.result).toEqual('\nRemoved like\nBook disliked!');
          done();
        }).catch((errorObj) => {
          console.log(errorObj.message);
        });
      }).catch((errorObj) => {
        console.log(errorObj.message);
      });
    }).catch((errorObj) => {
      console.log(errorObj.message);
    });
  });
});
describe('the "book/{id}" route with GET', () => {
  it('should return liked state when not explicitly set', async (done) => { 
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    const options = {
      method: 'GET',
      url: '/book/10',
    };
    await Model.books.generate(bookObj).then(async () => {
      await server.inject(options).then((likeDislikeState) => {
        expect(likeDislikeState.result).toEqual(false);
        done();
      });
    }).catch((errorObj) => {
      console.log(errorObj.message);
    });
  });
  it('should return liked state when set to true', async (done) => { 
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    const options = {
      method: 'GET',
      url: '/book/10',
    };
    await Model.books.generate(bookObj).then(async () => {
      await Model.books.addLikeDislike(bookObj.id, true).then(async () => {
        await server.inject(options).then((likeDislikeState) => {
          expect(likeDislikeState.result).toEqual(true);
          done();
        });
      });
    }).catch((errorObj) => {
      console.log(errorObj.message);
    });
  });
});
afterAll(() => {
  getBooksAndRatingsMock.restore();
  Model.books.sequelize.close();
});
