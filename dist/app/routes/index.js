"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_route_1 = require("../modules/books/book.route");
const order_route_1 = require("../modules/order/order.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/books",
        route: book_route_1.booksRoutes
    },
    {
        path: "/orders",
        route: order_route_1.orderRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
