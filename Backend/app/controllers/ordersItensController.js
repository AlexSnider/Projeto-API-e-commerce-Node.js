const OrdersItens = require("../../models/OrdersItens");

const OrdersItensController = {};

OrdersItensController.getAllOrdersItens = async (req, res) => {
  try {
    const ordersItens = await OrdersItens.findAll();
    res.json(ordersItens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

OrdersItensController.getOrdersItensById = async (req, res) => {
  try {
    const ordersItens = await OrdersItens.findOne({
      where: { id: req.params.id },
    });
    res.json(ordersItens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = OrdersItensController;
