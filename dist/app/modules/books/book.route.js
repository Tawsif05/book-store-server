"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./book.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_interface_1 = require("../Auth/auth.interface");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const book_validation_1 = require("./book.validation");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
router.post('/', (0, validateRequest_1.default)(book_validation_1.bookValidation.bookValidationSchema), (0, auth_1.default)(auth_interface_1.USER_ROLE.admin), book_controller_1.booksController.createBook);
router.get('/', book_controller_1.booksController.getBooks);
router.get('/:productId', book_controller_1.booksController.getSingleBook);
router.put('/:productId', sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, auth_1.default)(auth_interface_1.USER_ROLE.admin), book_controller_1.booksController.updateBook);
router.delete('/:productId', (0, auth_1.default)(auth_interface_1.USER_ROLE.admin), book_controller_1.booksController.deleteBook);
exports.booksRoutes = router;
