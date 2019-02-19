const Model = require('../models');

beforeEach(async () => {
  await Model.books.truncate();
});
describe('books.generate()', () => {
  it('should insert new book', async () => {
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    expect(await Model.books.generate(bookObj)).toEqual(`Inserted book with id: ${bookObj.id}`);
  });
  it('should give message if book with same id exists', async () => {
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    await Model.books.generate(bookObj);
    expect(await Model.books.generate(bookObj)).toEqual(`Book with id: ${bookObj.id} already exists`);
  });
  it('should catch error if there is attempt to insert entry with wrong datatype', async () => {
    const bookObj = {
      Author: null, id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    await Model.books.generate(bookObj);
    expect(await Model.books.generate(bookObj)).toEqual('null value in column "Author" violates not-null constraint');
  });
});
describe('books.addLikeDislike()', () => {
  it('should give message if book with given id does not exist', async (done) => {
    await Model.books.addLikeDislike(10, true).then((likeDislikeState) => {
      expect(likeDislikeState).toEqual("Book with id: 10 doesn't exist");
      done();
    }).catch((errorObj) => {
      console.log(errorObj.message);
    });
  });
  it('should remove dislike for book and add like', async (done) => {
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    await Model.books.generate(bookObj).then(async () => {
      await Model.books.addLikeDislike(bookObj.id, true).then((likeDislikeState) => {
        expect(likeDislikeState).toEqual('\nRemoved dislike\nBook liked!');
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
    await Model.books.generate(bookObj).then(async () => {
      await Model.books.addLikeDislike(bookObj.id, true).then(async () => {
        await Model.books.addLikeDislike(bookObj.id, true).then((likeDislikeState) => {
          expect(likeDislikeState).toEqual('\nBook already liked');
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
    await Model.books.generate(bookObj).then(async () => {
      await Model.books.addLikeDislike(bookObj.id, false).then((likeDislikeState) => {
        expect(likeDislikeState).toEqual('\nBook already disliked');
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
    await Model.books.generate(bookObj).then(async () => {
      await Model.books.addLikeDislike(bookObj.id, true).then(async () => {
        await Model.books.addLikeDislike(bookObj.id, false).then((likeDislikeState) => {
          expect(likeDislikeState).toEqual('\nRemoved like\nBook disliked!');
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
  it('should catch error if there is attempt to find id with string word', async (done) => {
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    await Model.books.generate(bookObj).then(async () => {
      await Model.books.addLikeDislike('hello', true).then(async (likeDislikeState) => {
        expect(likeDislikeState).toEqual('invalid input syntax for integer: "hello"');
        done();
      }).catch((errorObj) => {
        console.log(errorObj.message);
      });
    }).catch((errorObj) => {
      console.log(errorObj.message);
    });
  });
});
afterAll(() => Model.books.sequelize.close());
