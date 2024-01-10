const sequelize = require("../../db/dbConection.js");
const createOrdersModel = require("../../models/Orders.js");
const Orders = createOrdersModel(sequelize);
const Products = require("../../models/Products.js");
const OrdersItens = require("../../models/OrdersItens.js");
const User = require("../../models/User.js");
const dotenv = require("dotenv");
dotenv.config();
const sendEmail = require("../mail/orderMailer.js");

const ordersController = {};

ordersController.createOrder = async (req, res) => {
  try {
    const { userId, status, payment_method, items } = req.body;

    if (!userId || !status || !payment_method || !items || items.length === 0) {
      return res.status(400).json({ message: "All fields are required..." });
    }

    await sequelize.transaction(async (t) => {
      let order_total_price = 0;

      for (const item of items) {
        const product = await Products.findByPk(item.productId, { transaction: t });

        if (!product) {
          return res.status(404).json({
            message: `Product with ID ${item.productId} not found!`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for product with ID ${item.productId}!`,
          });
        }

        order_total_price += item.quantity * product.unit_price;
      }

      if (order_total_price <= 0) {
        return res.status(400).json({
          message: "Total price must be greater than zero to create an order!",
        });
      }

      const user = await User.findByPk(userId, { transaction: t });

      if (!user) {
        return res.status(404).json({ message: `User with ID ${userId} not found!` });
      }

      const order = await Orders.create(
        {
          userId: user.id,
          status,
          payment_method,
          order_total_price,
        },
        { transaction: t }
      );

      for (const item of items) {
        const product = await Products.findByPk(item.productId, { transaction: t });

        await OrdersItens.create(
          {
            orderId: order.id,
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
          },
          { transaction: t }
        );

        await product.update(
          { stock: product.stock - item.quantity },
          { transaction: t }
        );
      }

      if (status === "pending" || status === "paid") {
        sendEmail(user, status, order_total_price, payment_method, items);

        return res.status(201).json({
          message: "Order created successfully!",
          order,
          order_total_price,
          ordersItems: items,
        });
      }
    });
  } catch (error) {
    if (error instanceof CustomValidationException) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

ordersController.updateOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const orderId = req.params.id;
    const order = await Orders.findOne({ where: { id: orderId }, transaction: t });

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    const { status } = req.body;

    if (status === undefined || status === order.status) {
      await t.rollback();
      return res.status(400).json({
        message:
          "Status field must be provided for update or status must be different from current status...",
      });
    }

    if (status === "paid" && order.status === "canceled") {
      await t.rollback();
      return res.status(400).json({
        message: "Order status cannot be updated to paid or pending when canceled!",
      });
    }

    if (status === "paid" && order.status === "pending") {
      await Orders.update({ status: status }, { where: { id: orderId }, transaction: t });
    } else if (status === "canceled") {
      await Orders.update({ status: status }, { where: { id: orderId }, transaction: t });

      const ordersItems = await OrdersItens.findAll({
        where: { orderId },
        transaction: t,
      });

      for (const item of ordersItems) {
        const product = await Products.findByPk(item.productId, { transaction: t });
        await product.update(
          { stock: product.stock + item.quantity },
          { where: { id: item.productId }, transaction: t }
        );
      }

      await t.commit();
      return res.status(200).json({ message: "Order canceled successfully!" });
    }

    await t.commit();
    res.status(200).json({ message: "Order status updated successfully!" });
  } catch (error) {
    await t.rollback();

    if (error instanceof CustomValidationException) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

ordersController.getOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll();

    if (!orders) {
      return res.status(404).json({ message: "Orders not found!" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

ordersController.getOrderById = async (req, res) => {
  try {
    const order = await Orders.findOne({ where: { id: req.params.id } });

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

ordersController.getOrdersItensByOrderId = async (req, res) => {
  try {
    const orderId = req.params.id;

    const orderWithItems = await Orders.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrdersItens,
          attributes: ["id", "orderId", "productId", "productName", "quantity"],
          as: "OrdersItens",
        },
      ],
    });

    if (!orderWithItems) {
      return res.status(404).json({ message: "Order not found!" });
    }

    const combinedData = {
      order: {
        id: orderWithItems.id,
        userId: orderWithItems.userId,
        status: orderWithItems.status,
        payment_method: orderWithItems.payment_method,
        order_total_price: orderWithItems.order_total_price,
      },
      ordersItems: orderWithItems.OrdersItens.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
      })),
    };

    res.status(200).json(combinedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = ordersController;
