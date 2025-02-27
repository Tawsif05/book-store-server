
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';

import Order from './order.model';
import { Book } from '../books/book.model';
import { orderUtils } from './order.utils';
import User from '../User/user.model';
import { TUserInfo } from './order.interface';
import { TUser } from '../User/user.interface';

const createOrderIntoDB = async (
  user: TUserInfo,
  payload: {
    products: { productId: string; quantity: number }[];
    phone?: string;
    address?: string;
    city?: string;
  },
  client_ip: string
) => {
  if (!payload?.products?.length) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Order is not specified');
  }

  const products = payload.products;

  let totalPrice = 0;

  const productDetails = await Promise.all(
    products.map(async (item) => {
      const product = await Book.findById(item.productId);
      if (product) {
        const subtotal = product ? (product.price || 0) * item.quantity : 0;
        totalPrice += subtotal;
        return item;
      }
    })
  );

  let order = await Order.create({
    user,
    products: productDetails,
    totalPrice,
  });

  if (payload.phone || payload.address || payload.city) {
    await User.findByIdAndUpdate(user._id, {
      $set: {
        phone: payload.phone,
        address: payload.address,
        city: payload.city,
      },
    });
  }

  const userInfo: TUser | null = await User.findById(user._id);

  await Promise.all(
    products.map(async (item) => {
      const product = await Book.findById(item.productId);
      if (!product) throw new AppError(404, 'Product not found');

      if (product.quantity < item.quantity) {
        throw new AppError(400, `Not enough stock for ${product.title}`);
      }
      if (product.quantity === 0) {
        await Book.findByIdAndUpdate(item.productId, {
          $set: { inStock: false },
        });

        throw new AppError(400, `Not enough stock for ${product.title}`);
      }
      await Book.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
    })
  );

  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: userInfo?.name || 'N/A',
    customer_address: userInfo?.address || 'N/A',
    customer_email: userInfo?.email || 'N/A',
    customer_phone: userInfo?.phone || 'N/A',
    customer_city: userInfo?.city || 'N/A',
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

const getAllOrders = async () => {
  const result = await Order.find();
  return result;
};

const getOrdersByUser = async (userId: string) => {
  const result = await Order.find({user: userId});
  return result;
} 


const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      }
    );
  }

  return verifiedPayment;
};

const calculateRevenue = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);

  return result;
};

const getSingleOrder = async (id: string) => {
  const order = await Order.findById(id);
  return order;
}

const updateOrder = async (id: string, payload: {status: string}) => {
  const result = await Order.findByIdAndUpdate(id, payload, {new: true});
  return result;
}

const deleteOrder = async (id: string) => {
  const result = await Order.findByIdAndDelete(id);
  return result;
}


export const orderService = {
  createOrderIntoDB,
  calculateRevenue,
  getAllOrders,
  verifyPayment,
  getOrdersByUser,
  getSingleOrder,
  updateOrder,
  deleteOrder
};


