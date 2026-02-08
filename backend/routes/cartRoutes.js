const express = require("express");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Item = require("../models/Item");
const User = require("../models/User");
const authorize = require("../middleware/check_auth");

const router = express.Router();

//Router POST api/carts
router.post("/carts/:item_id", authorize, async (req, res) => {
  try {
    //get item id from params
    const { item_id } = req.params;
    const { id } = req;

    // check for user
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ error_msg: "user does not exists!" });
    }

    //if cart does not exist to user just create a cart
    if (!user.cart_id) {
      const cart = await Cart.create({
        user_id: user._id,
        name: `${user.username}_cart's`,
      });

      // add the cart id to user
      user.cart_id = cart._id;
      await user.save();
    }

    // add the item_id and cart_id to cartItem an
    await CartItem.create({
      cart_id: user.cart_id,
      item_id,
    });

    res.status(200).json({ message: "Item added to cart" });
  } catch (err) {
    res.status(500).json({ eroor_msg: err.message });
  }
});

router.get("/carts", authorize, async (req, res) => {
  try {
    const { id } = req;

    // get the user
    const user = await User.findById(id);

    // get cart items
    const cartItems = await CartItem.find({ cart_id: user.cart_id });

    // extract product ids
    const itemIds = cartItems.map((item) => item.item_id);
    // get all products
    const allProducts = await Item.find({
      _id: { $in: itemIds },
    });

    res.status(200).json({ allProducts });
  } catch (err) {
    res.status(500).json({ error_msg: err.message });
  }
});

module.exports = router;
