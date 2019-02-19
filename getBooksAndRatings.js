const Axios = require('axios');
const { ALL_BOOKS_URL, RATING_BY_ID_URL } = require('./constants');

const getBooks = async () => {
  try {
    const booksArray = await Axios.get(ALL_BOOKS_URL);
    return booksArray.data;
  } catch (errorObj) {
    return (errorObj.message);
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

const getBooksAndRatings = async () => {
  try {
    const { booksArray, ratingsArray } = await getRatings();
    const booksRatingsArray = booksArray.map((book, index) => Object.assign(book, ratingsArray[index]));
    const authorBooks = {};
    booksRatingsArray.forEach((book) => {
      if (authorBooks[book.Author] !== undefined) {
        authorBooks[book.Author].push(book);
      } else {
        authorBooks[book.Author] = [book];
      }
    });
    Object.values(authorBooks).forEach((books) => {
      books.sort((book1, book2) => book2.rating - book1.rating);
    });
    return authorBooks;
  } catch (errorObj) {
    return (errorObj.message);
  }
};

module.exports = { getBooks, getRatings, getBooksAndRatings };
