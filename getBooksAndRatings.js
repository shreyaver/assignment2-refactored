const Axios = require('axios');

const getBooks = () => new Promise((resolve, reject) => {
  Axios.get('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks').then((booksArray) => {
    resolve(booksArray.data);
  }).catch((errorObj) => {
    reject(errorObj.message);
  });
});

module.exports = { getBooks };
