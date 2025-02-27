import { Router } from "express";
import { booksRoutes } from "../modules/books/book.route";
import { orderRoutes } from "../modules/order/order.route";
import { authRoutes } from "../modules/Auth/auth.route";



const router = Router();

const moduleRoutes = [
    {
        path: "/books",
        route: booksRoutes
    },
    {
        path: "/orders",
        route: orderRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
];


moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;