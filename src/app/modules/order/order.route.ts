import express from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Auth/auth.interface';


const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  orderController.createOrder
);
router.get('/', auth(USER_ROLE.admin,USER_ROLE.user), orderController.getOrders);
router.get('/revenue', auth(USER_ROLE.admin), orderController.calculateRevenue);
router.get(
  '/verify',
  auth(USER_ROLE.user, USER_ROLE.admin),
  orderController.verifyPayment
);

router.get("/:id", auth(USER_ROLE.admin, USER_ROLE.user), orderController.getSingleOrder)

router.get("/:userId", auth(USER_ROLE.user, USER_ROLE.admin), orderController.getOrdersByUser)

router.patch("/update/:id", auth(USER_ROLE.admin), orderController.updateOrder)

router.delete("/:id", auth(USER_ROLE.admin), orderController.deleteOrder)

export const orderRoutes = router;
