const Axios = require('axios');
const Model = require('./models');

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

const storeBooksAndRatings = () => new Promise((resolve, reject) => {
  getRatings().then(({ booksArray, ratingsArray }) => {
    const booksRatingsArray = booksArray.map((book, index) => Object.assign(book, ratingsArray[index]));
    Promise.all(booksRatingsArray.map(book => Model.books.generate(book))).then(() => {
      resolve(booksRatingsArray);
    });
  }).catch((errorObj) => {
    reject(errorObj.message);
  });
});

module.exports = { getBooks, getRatings, storeBooksAndRatings };