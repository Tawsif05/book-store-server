import QueryBuilder from '../../builder/queryBuilder';
import { TBook } from './book.interface';
import { Book } from './book.model';


const createBookIntoDB = async (book: TBook) => {
  const result = await Book.create(book);
  return result;
};

const getAllBooks = async (query: Record<string, unknown>) => {
  const searchableFields = ['title', 'author', 'category'];

  const booksQuery = new QueryBuilder(Book.find(), query)
    .search(searchableFields)
    .filter()
    .sort();

  const meta = await booksQuery.countTotal();

  const result = await booksQuery.paginate().fields().modelQuery.lean();

  return {
    meta,
    result,
  };
};

const getSingleBook = async (id: string) => {
  const result = await Book.findById(id);
  return result;
};

const updateBook = async (id: string, data: Partial<TBook>) => {
  const result = await Book.findByIdAndUpdate(id, data, { new: true });
  return result;
};

const deleteBook = async (id: string) => {
  const result = await Book.findByIdAndDelete(id);
  return result;
};

export const bookServices = {
  createBookIntoDB,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
