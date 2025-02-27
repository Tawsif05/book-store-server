"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [100, 'Title must not exceed 100 characters'],
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        minlength: [3, 'Author name must be at least 3 characters long'],
        maxlength: [50, 'Author name must not exceed 50 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: [
                'Fiction',
                'Non-Fiction',
                'Science',
                'History',
                'Biography',
                'Children',
                'Nature'
            ],
            message: 'Category must be one of Fiction, Non-Fiction, Science, History, Biography, or Children',
        },
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description must be at least 10 characters long'],
    },
    imgUrl: {
        type: String,
        required: false,
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity must be a positive number or zero'],
    },
    inStock: {
        type: Boolean,
        required: [true, 'InStock status is required'],
    },
}, {
    timestamps: true,
});
exports.Book = (0, mongoose_1.model)('Book', bookSchema);
