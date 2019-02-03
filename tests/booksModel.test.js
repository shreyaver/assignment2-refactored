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
afterAll(() => Model.books.sequelize.close());
