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
      resolve(ratingsObjArray.map(ratingsObj => ratingsObj.data));
    }).catch((errorObj) => {
      reject(errorObj.message);
    });
  }).catch((errorObj) => {
    reject(errorObj.message);
  });
});

module.exports = { getBooks, getRatings };
