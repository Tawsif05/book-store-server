"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookServices = void 0;
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const book_model_1 = require("./book.model");
const createBookIntoDB = (book) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.create(book);
    return result;
});
const getAllBooks = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchableFields = ['title', 'author', 'category'];
    const booksQuery = new queryBuilder_1.default(book_model_1.Book.find(), query)
        .search(searchableFields)
        .filter()
        .sort();
    const meta = yield booksQuery.countTotal();
    const result = yield booksQuery.paginate().fields().modelQuery.lean();
    return {
        meta,
        result,
    };
});
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findById(id);
    return result;
});
const updateBook = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findByIdAndUpdate(id, data, { new: true });
    return result;
});
const deleteBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findByIdAndDelete(id);
    return result;
});
exports.bookServices = {
    createBookIntoDB,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook,
};
