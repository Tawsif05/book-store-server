import { Request, Response } from 'express';
import { bookServices } from './book.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createBook = catchAsync(async (req: Request, res: Response) => {
  const book = req.body;
  const result = await bookServices.createBookIntoDB(book);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Book created successfully',
    data: result,
  });
});

const getBooks = catchAsync(async (req: Request, res: Response) => {
  const queryData = req.query;
  const result = await bookServices.getAllBooks(queryData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Books retrieved successfully',
    data: result,
  });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.productId;
  const result = await bookServices.getSingleBook(bookId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Book retrieved successfully',
    data: result,
  });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.productId;
  const body = req.body;
  const result = await bookServices.updateBook(id, body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Book updated successfully',
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.productId;
  await bookServices.deleteBook(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Book deleted successfully',
    data: {},
  });
});

export const booksController = {
  createBook,
  getBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
