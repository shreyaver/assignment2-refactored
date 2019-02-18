const Axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const Model = require('../models');
const { getBooks, getRatings, storeBooksAndRatings } = require('../storeBooksAndRatings.js');
const { ALL_BOOKS_URL, RATING_BY_ID_URL } = require('../constants');

let mockBooks;
let getBooksAndRatingsMock;
let mockRatingsObj;
const mockRatingsArray = [];
beforeAll(async () => {
  await Model.books.truncate();
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
  getBooksAndRatingsMock = new MockAdapter(Axios);
  getBooksAndRatingsMock.onGet(ALL_BOOKS_URL).reply(200, mockBooks);
  mockRatingsObj = { rating: 4.62 };
  mockBooks.books.forEach((book) => {
    mockRatingsArray.push(mockRatingsObj);
  });
  const url = new RegExp(`${RATING_BY_ID_URL}/[0-9]+`);
  getBooksAndRatingsMock.onGet(url).reply(200, mockRatingsObj);
});

describe('getBooks()', () => {
  it('should fetch array of books from link', async () => {
    expect(await getBooks()).toEqual(mockBooks);
  });
});

describe('getRatings()', () => {
  it('should fetch array of ratings from link', async () => {
    expect(await getRatings()).toEqual({ booksArray: mockBooks.books, ratingsArray: mockRatingsArray });
  });
});

describe('storeBooksAndRatings()', () => {
  it('should store books and ratings in database', async (done) => {
    await storeBooksAndRatings().then((databaseInsertResponses) => {
      Model.books.count().then((countInDatabase) => {
        expect(databaseInsertResponses.length).toEqual(countInDatabase);
        done();
      }).catch((errorObj) => {
        console.log(errorObj.message);
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
