const Axios = require('axios');
const Model = require('./models');
const { ALL_BOOKS_URL, RATING_BY_ID_URL } = require('./constants');

const getBooks = async () => {
  try {
    const booksArray = await Axios.get(ALL_BOOKS_URL);
    return booksArray.data;
  } catch (errorObj) {
    return errorObj.message;
  }
};

const getRatings = async () => {
  try {
    const booksArray = await getBooks();
    const ratingsObjArray = await Axios.all(booksArray.books.map(book => Axios.get(`${RATING_BY_ID_URL}/${book.id}`)));
    return { booksArray: booksArray.books, ratingsArray: ratingsObjArray.map(ratingsObj => ratingsObj.data) };
  } catch (errorObj) {
    return (errorObj.message);
  }
};

const storeBooksAndRatings = async () => {
  try {
    const { booksArray, ratingsArray } = await getRatings();
    const booksRatingsArray = booksArray.map((book, index) => Object.assign(book, ratingsArray[index]));
    const dataBaseInsertResponses = await Promise.all(booksRatingsArray.map(book => Model.books.generate(book)));
    return dataBaseInsertResponses;
  } catch (errorObj) {
    return (errorObj.message);
  }
};

module.exports = { getBooks, getRatings, storeBooksAndRatings };
