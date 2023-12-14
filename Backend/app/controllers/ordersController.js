const sequelize = require("../../db/dbConection.js");
const createOrdersModel = require("../../models/Orders.js");
const Orders = createOrdersModel(sequelize);
const Products = require("../../models/Products.js");
const OrdersItems = require("../../models/OrdersItens.js");
const User = require("../../models/User.js");

const ordersController = {};

ordersController.createOrder = async (req, res) => {
  try {
    const { userId, status, payment_method, items } = req.body;

    if (!userId || !status || !payment_method || !items || items.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await sequelize.transaction(async (t) => {
      let total_price = 0;

      for (const item of items) {
        const product = await Products.findByPk(item.productId, { transaction: t });

        if (!product) {
          return res.status(404).json({
            message: `Product with ID ${item.productId} not found`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for product with ID ${item.productId}`,
          });
        }

        total_price += item.quantity * product.unit_price;
      }

      if (total_price <= 0) {
        return res.status(400).json({
          message: "Total price must be greater than zero to create an order.",
        });
      }

      const user = await User.findByPk(userId, { transaction: t });

      if (!user) {
        return res.status(404).json({ message: `User with ID ${userId} not found` });
      }

      const order = await Orders.create(
        {
          userId: user.id,
          status,
          payment_method,
          total_price,
        },
        { transaction: t }
      );

      for (const item of items) {
        const product = await Products.findByPk(item.productId, { transaction: t });

        await OrdersItems.create(
          {
            orderId: order.id,
            productId: product.id,
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
        return res.status(201).json({
          message: "Order created successfully",
          order,
          total_price,
          ordersItems: items,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

ordersController.updateOrder = async (req, res) => {
  try {
    const { status, payment_method } = req.body;

    const order = await Orders.findOne({ where: { id: req.params.id } });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updateAttributes = {
      status,
      payment_method,
    };

    for (const key of Object.keys(updateAttributes)) {
      if (updateAttributes[key] !== undefined) {
        const updateObj = { [key]: updateAttributes[key] };

        await Orders.update(updateObj, { where: { id: req.params.id } });
      } else {
        return res.status(400).json({ message: "At least one field must be provided" });
      }
    }

    if (status === "paid" && order.status === "pending") {
      const ordersItems = await OrdersItems.findAll({
        where: { orderId: req.params.id },
      });

      for (const item of ordersItems) {
        const product = await Products.findOne({ where: { id: item.productId } });

        if (!product) {
          return res
            .status(404)
            .json({ message: "Product not found. Please try again." });
        } else {
          await Orders.update({ status: "paid" }, { where: { id: req.params.id } });
        }
      }
    }

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; //TESTAR

ordersController.getOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll();

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

ordersController.getOrderById = async (req, res) => {
  try {
    const order = await Orders.findOne({ where: { id: req.params.id } });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = ordersController;
