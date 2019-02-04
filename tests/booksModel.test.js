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
});
describe('books.addLikeDislike()', () => {
  it('should give message if book with given id does not exist', async (done) => {
    await Model.books.addLikeDislike(10, 20, 'like').then((likeDislikeState) => {
      expect(likeDislikeState).toEqual("Book with id: 10 doesn't exist");
      done();
    }).catch((errorObj) => {
      console.log(errorObj.message);
    });
  });
  it('should like book', async (done) => {
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    await Model.books.generate(bookObj).then(async () => {
      await Model.books.addLikeDislike(bookObj.id, 20, 'like').then((likeDislikeState) => {
        expect(likeDislikeState).toEqual('\nBook liked!');
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
      await Model.books.addLikeDislike(bookObj.id, 20, 'like').then(async () => {
        await Model.books.addLikeDislike(bookObj.id, 20, 'like').then((likeDislikeState) => {
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
  it('should remove dislike for book and add like', async (done) => {
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    await Model.books.generate(bookObj).then(async () => {
      await Model.books.addLikeDislike(bookObj.id, 20, 'dislike').then(async () => {
        await Model.books.addLikeDislike(bookObj.id, 20, 'like').then((likeDislikeState) => {
          expect(likeDislikeState).toEqual('\nRemoved dislike\nBook liked!');
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
  it('should dislike book', async (done) => {
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    await Model.books.generate(bookObj).then(async () => {
      await Model.books.addLikeDislike(bookObj.id, 20, 'dislike').then((likeDislikeState) => {
        expect(likeDislikeState).toEqual('\nBook disliked!');
        done();
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
      await Model.books.addLikeDislike(bookObj.id, 20, 'dislike').then(async () => {
        await Model.books.addLikeDislike(bookObj.id, 20, 'dislike').then((likeDislikeState) => {
          expect(likeDislikeState).toEqual('\nBook already disliked');
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
  it('should remove like for book and add dislike', async (done) => {
    const bookObj = {
      Author: 'J K Rowling', id: 10, Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)', rating: 4.45,
    };
    await Model.books.generate(bookObj).then(async () => {
      await Model.books.addLikeDislike(bookObj.id, 20, 'like').then(async () => {
        await Model.books.addLikeDislike(bookObj.id, 20, 'dislike').then((likeDislikeState) => {
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
});
afterAll(() => Model.books.sequelize.close());
