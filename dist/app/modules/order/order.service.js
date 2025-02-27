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
exports.orderService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const order_model_1 = __importDefault(require("./order.model"));
const book_model_1 = require("../books/book.model");
const order_utils_1 = require("./order.utils");
const user_model_1 = __importDefault(require("../User/user.model"));
const createOrderIntoDB = (user, payload, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = payload === null || payload === void 0 ? void 0 : payload.products) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Order is not specified');
    }
    const products = payload.products;
    let totalPrice = 0;
    const productDetails = yield Promise.all(products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield book_model_1.Book.findById(item.productId);
        if (product) {
            const subtotal = product ? (product.price || 0) * item.quantity : 0;
            totalPrice += subtotal;
            return item;
        }
    })));
    let order = yield order_model_1.default.create({
        user,
        products: productDetails,
        totalPrice,
    });
    if (payload.phone || payload.address || payload.city) {
        yield user_model_1.default.findByIdAndUpdate(user._id, {
            $set: {
                phone: payload.phone,
                address: payload.address,
                city: payload.city,
            },
        });
    }
    const userInfo = yield user_model_1.default.findById(user._id);
    yield Promise.all(products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield book_model_1.Book.findById(item.productId);
        if (!product)
            throw new AppError_1.default(404, 'Product not found');
        if (product.quantity < item.quantity) {
            throw new AppError_1.default(400, `Not enough stock for ${product.title}`);
        }
        if (product.quantity === 0) {
            yield book_model_1.Book.findByIdAndUpdate(item.productId, {
                $set: { inStock: false },
            });
            throw new AppError_1.default(400, `Not enough stock for ${product.title}`);
        }
        yield book_model_1.Book.findByIdAndUpdate(item.productId, {
            $inc: { quantity: -item.quantity },
        });
    })));
    const shurjopayPayload = {
        amount: totalPrice,
        order_id: order._id,
        currency: 'BDT',
        customer_name: (userInfo === null || userInfo === void 0 ? void 0 : userInfo.name) || 'N/A',
        customer_address: (userInfo === null || userInfo === void 0 ? void 0 : userInfo.address) || 'N/A',
        customer_email: (userInfo === null || userInfo === void 0 ? void 0 : userInfo.email) || 'N/A',
        customer_phone: (userInfo === null || userInfo === void 0 ? void 0 : userInfo.phone) || 'N/A',
        customer_city: (userInfo === null || userInfo === void 0 ? void 0 : userInfo.city) || 'N/A',
        client_ip,
    };
    const payment = yield order_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
    if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
        order = yield order.updateOne({
            transaction: {
                id: payment.sp_order_id,
                transactionStatus: payment.transactionStatus,
            },
        });
    }
    return payment.checkout_url;
});
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.default.find();
    return result;
});
const getOrdersByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.default.find({ user: userId });
    return result;
});
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
    if (verifiedPayment.length) {
        yield order_model_1.default.findOneAndUpdate({
            'transaction.id': order_id,
        }, {
            'transaction.bank_status': verifiedPayment[0].bank_status,
            'transaction.sp_code': verifiedPayment[0].sp_code,
            'transaction.sp_message': verifiedPayment[0].sp_message,
            'transaction.transactionStatus': verifiedPayment[0].transaction_status,
            'transaction.method': verifiedPayment[0].method,
            'transaction.date_time': verifiedPayment[0].date_time,
            status: verifiedPayment[0].bank_status == 'Success'
                ? 'Paid'
                : verifiedPayment[0].bank_status == 'Failed'
                    ? 'Pending'
                    : verifiedPayment[0].bank_status == 'Cancel'
                        ? 'Cancelled'
                        : '',
        });
    }
    return verifiedPayment;
});
const calculateRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.default.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$totalPrice' },
            },
        },
    ]);
    return result;
});
const getSingleOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.default.findById(id);
    return order;
});
const updateOrder = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.default.findByIdAndDelete(id);
    return result;
});
exports.orderService = {
    createOrderIntoDB,
    calculateRevenue,
    getAllOrders,
    verifyPayment,
    getOrdersByUser,
    getSingleOrder,
    updateOrder,
    deleteOrder
};
