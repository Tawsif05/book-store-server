import express, { NextFunction, Request, Response } from 'express';
import { booksController } from './book.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.interface';
import validateRequest from '../../middlewares/validateRequest';
import { bookValidation } from './book.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/',
  validateRequest(bookValidation.bookValidationSchema),
  auth(USER_ROLE.admin),
  booksController.createBook
);
router.get('/', booksController.getBooks);
router.get('/:productId', booksController.getSingleBook);
router.put(
  '/:productId',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(USER_ROLE.admin),
  booksController.updateBook
);
router.delete('/:productId', auth(USER_ROLE.admin), booksController.deleteBook);

export const booksRoutes = router;
