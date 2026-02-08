const express = require("express");
const User = require("../models/User");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Order = require("../models/Order");
const authorize = require("../middleware/check_auth");

const router = express.Router();

//@router POST api/orders
router.post("/orders", authorize, async (req, res) => {
  try {
    // get user id
    const { id } = req;

    // get user
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ error_msg: "user does not exists!" });
    }

    // check for is user have any existing cart
    if (!user.cart_id) {
      return res
        .status(400)
        .json({ error_msg: "user does not have any existing cart" });
    }

    const cart = await Cart.findById(user.cart_id);
    // check for is there any product in cartItem
    const cartItem = await CartItem.find({ cart_id: cart._id });
    if (cartItem.length === 0) {
      return res.status(400).json({
        error_msg: "you cart is empty...please add items in your cart",
      });
    }

    // clear the cartItem for checkout
    await CartItem.deleteMany({ cart_id: cart._id });

    // make cart status ordered
    cart.status = "ordered";
    await cart.save();

    // now update the order collection
    const order = await Order.create({
      user_id: user._id,
      cart_id: cart._id,
    });

    res.status(200).json({
      message: `your order is successfully placed with order id ${order._id}`,
    });
  } catch (err) {
    res.status(500).json({ error_msg: err.message });
  }
});

const getFormattedDate = (createdAt) => {
  const date = new Date(createdAt);

  const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${date.getFullYear()}`;

  return formattedDate;
};

//@router To see order history
router.get("/order-history", authorize, async (req, res) => {
  try {
    const { id } = req;
    const orders = await Order.find({ user_id: id });

    const orderDetails = orders.map((eachData) => ({
      order_id: eachData._id,
      order_date: getFormattedDate(eachData.createdAt),
    }));

    res.status(200).json({ orderDetails });
  } catch (err) {
    res.status(500).json({ error_msg: err.message });
  }
});
module.exports = router;
