const Axios = require('axios');

const getBooks = () => new Promise((resolve, reject) => {
  Axios.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks').then((booksArray) => {
    resolve(booksArray.data);
  }).catch((errorObj) => {
    reject(errorObj.message);
  });
});

const getRatings = () => new Promise((resolve, reject) => {
  getBooks().then((booksArray) => {
    Axios.all(booksArray.books.map(book => Axios.get(`https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/${book.id}`))).then((ratingsObjArray) => {
      resolve({ booksArray: booksArray.books, ratingsArray: ratingsObjArray.map(ratingsObj => ratingsObj.data) });
    }).catch((errorObj) => {
      reject(errorObj.message);
    });
  }).catch((errorObj) => {
    reject(errorObj.message);
  });
});

const getBooksAndRatings = () => new Promise((resolve, reject) => {
  getRatings().then(({ booksArray, ratingsArray }) => {
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
    resolve(authorBooks);
  }).catch((errorObj) => {
    reject(errorObj.message);
  });
});

module.exports = { getBooks, getRatings, getBooksAndRatings };
