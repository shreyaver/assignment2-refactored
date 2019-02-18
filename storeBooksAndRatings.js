const Axios = require('axios');
const Model = require('./models');
const { ALL_BOOKS_URL, RATING_BY_ID_URL } = require('./constants');

const getBooks = () => new Promise((resolve, reject) => {
  Axios.get(ALL_BOOKS_URL).then((booksArray) => {
    resolve(booksArray.data);
  }).catch((errorObj) => {
    reject(errorObj.message);
  });
});

const getRatings = () => new Promise((resolve, reject) => {
  getBooks().then((booksArray) => {
    Axios.all(booksArray.books.map(book => Axios.get(`${RATING_BY_ID_URL}/${book.id}`))).then((ratingsObjArray) => {
      resolve({ booksArray: booksArray.books, ratingsArray: ratingsObjArray.map(ratingsObj => ratingsObj.data) });
    }).catch((errorObj) => {
      reject(errorObj.message);
    });
  }).catch((errorObj) => {
    reject(errorObj.message);
  });
});

const storeBooksAndRatings = () => new Promise((resolve, reject) => {
  getRatings().then(({ booksArray, ratingsArray }) => {
    const booksRatingsArray = booksArray.map((book, index) => Object.assign(book, ratingsArray[index]));
    Promise.all(booksRatingsArray.map(book => Model.books.generate(book))).then((dataBaseInsertResponses) => {
      resolve(dataBaseInsertResponses);
    });
  }).catch((errorObj) => {
    reject(errorObj.message);
  });
});

module.exports = { getBooks, getRatings, storeBooksAndRatings };
