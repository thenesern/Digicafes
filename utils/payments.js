import Order from "../models/OrderModel.js";

const CompletePayment = async (result) => {
  await Order.create({
    product: result?.productId,
    user: result?.userId,
    paymentId: result?.paymentId,
    status: result.status,
    cartId: result?.basketId,
    conversationId: result?.conversationId,
    currency: result?.currency,
    price: result?.price,
    paidPrice: result?.paidPrice,
    itemTransactions: result?.itemTransactions.map((item) => {
      return {
        itemId: item.itemId,
        paymentTransactionId: item?.paymentTransactionId,
        price: item?.price,
        paidPrice: item?.paidPrice,
      };
    }),
    log: result,
    errorCode: result?.errorCode,
    errorMessage: result?.errorMessage,
  });
};

module.exports = {
  CompletePayment,
};
