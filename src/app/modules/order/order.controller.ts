import { Request, Response } from 'express';
import { orderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { TUserInfo } from './order.interface';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const order = req.body;
  const user = req.user as TUserInfo;
  const result = await orderService.createOrderIntoDB(user, order, req.ip!);
  sendResponse(res, {
    success: true,
    message: 'Order Created successfully',
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.getAllOrders();

  sendResponse(res, {
    success: true,
    message: 'Orders retrieved successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const order = await orderService.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Order verified successfully',
    data: order,
  });
});

const calculateRevenue = catchAsync(async (req: Request, res: Response) => {
  const totalRevenue = await orderService.calculateRevenue();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Revenue calculated successfully',
    data: { totalRevenue: totalRevenue[0].totalRevenue },
  });
});

const getOrdersByUser = catchAsync(async (req, res) => {
  
  const userId = req.params.userId;
  try {
    const result = await orderService.getOrdersByUser(userId);

    if (result.length === 0) {
      sendResponse(res, {
        success: false,
        message: 'No orders found for this user',
        statusCode: StatusCodes.NOT_FOUND,
        data: result,
      });
    }
    sendResponse(res, {
      success: true,
      message: 'Orders retrieved successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  } catch (err) {
    sendResponse(res, {
      success: false,
      message: 'Error fetching orders',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      data: [err],
    });
  }
});

const getSingleOrder = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await orderService.getSingleOrder(id);
  sendResponse(res, {
    success: true,
    message: 'Order retrieve successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});


const updateOrder = catchAsync(async(req, res) => {
  const id = req.params.id;
  const result = await orderService.updateOrder(id, req.body);
  sendResponse(res, {
    success: true,
    message: 'Order updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  })
})

const deleteOrder = catchAsync(async(req, res) => {
  const id = req.params.id;
  await orderService.deleteOrder(id);
  sendResponse(res, {
    success: true,
    message: 'Order deleted successfully',
    statusCode: StatusCodes.OK,
    data: {},
  });
})


export const orderController = {
  createOrder,
  calculateRevenue,
  getOrders,
  verifyPayment,
  getOrdersByUser,
  getSingleOrder,
  updateOrder,
  deleteOrder
};
