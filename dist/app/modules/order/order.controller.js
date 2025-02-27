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
exports.orderController = void 0;
const order_service_1 = require("./order.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = req.body;
    const user = req.user;
    const result = yield order_service_1.orderService.createOrderIntoDB(user, order, req.ip);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Order Created successfully',
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        data: result,
    });
}));
const getOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.orderService.getAllOrders();
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Orders retrieved successfully',
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_service_1.orderService.verifyPayment(req.query.order_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: 'Order verified successfully',
        data: order,
    });
}));
const calculateRevenue = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalRevenue = yield order_service_1.orderService.calculateRevenue();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Revenue calculated successfully',
        data: { totalRevenue: totalRevenue[0].totalRevenue },
    });
}));
const getOrdersByUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const result = yield order_service_1.orderService.getOrdersByUser(userId);
        if (result.length === 0) {
            (0, sendResponse_1.default)(res, {
                success: false,
                message: 'No orders found for this user',
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                data: result,
            });
        }
        (0, sendResponse_1.default)(res, {
            success: true,
            message: 'Orders retrieved successfully',
            statusCode: http_status_codes_1.StatusCodes.OK,
            data: result,
        });
    }
    catch (err) {
        (0, sendResponse_1.default)(res, {
            success: false,
            message: 'Error fetching orders',
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            data: [err],
        });
    }
}));
const getSingleOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield order_service_1.orderService.getSingleOrder(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Order retrieve successfully',
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const updateOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield order_service_1.orderService.updateOrder(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Order updated successfully',
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: result,
    });
}));
const deleteOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield order_service_1.orderService.deleteOrder(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Order deleted successfully',
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: {},
    });
}));
exports.orderController = {
    createOrder,
    calculateRevenue,
    getOrders,
    verifyPayment,
    getOrdersByUser,
    getSingleOrder,
    updateOrder,
    deleteOrder
};
