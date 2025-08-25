import Checkout from '../models/Checkout.js';
import SignUp from '../models/SignUp.js';
import AllProduct from "../models/AllProducts.js";

class CheckoutController {
    constructor() {}

    async checkout(req, res) {
        let { username, title, size, quantity, totalPrice, address } = req.body;
      
        // 1. Create checkout data
        let checkout = new Checkout({
          username,
          title,
          size,
          quantity,
          totalPrice,
          address,
        });
      
        try {
          // 2. Save checkout record
          let saveData = await checkout.save();
      
          if (saveData) {
            // 3. Find the product by title (you can also include size if needed)
            const product = await AllProduct.findOne({ title });
      
            if (!product) {
              return res.status(404).json({ status: false, message: "Product not found" });
            }
      
            // 4. Decrease the quantity
            if (product.quantity < quantity) {
              return res.status(400).json({ status: false, message: "Not enough stock available" });
            }
      
            product.quantity -= quantity;
      
            // 5. Save updated product
            await product.save();
      
            return res.json({ status: true, message: "Checkout successful and quantity updated" });
          } else {
            return res.json({ status: false, message: "Checkout failed" });
          }
        } catch (err) {
          console.error("Checkout error:", err);
          return res.status(500).json({ status: false, message: "Internal server error" });
        }
      }

    //empty the cart array from signup model
    async emptyCart(req, res){
        const { username } = req.body;
        try {
          const result = await SignUp.updateOne(
            { username },
            { $set: { cart: [] } }
          );
          if (result.modifiedCount > 0) {
            return res.json({ status: true });
          } else {
            return res.json({ status: false, message: 'User not found or cart already empty' });
          }
        } catch (error) {
          console.error('Error clearing cart:', error);
          return res.status(500).json({ status: false, message: error.message });
        }
      }
      

    async displayCheckout(req, res){
        let checkoutData = await Checkout.find();
        if(checkoutData){
            return res.json(checkoutData);
        } else {
            return res.json({status: false});
        }
    }

    //delete the checkout data from the database
    async deleteCheckout(req, res){
        let id = req.params.id;
        let deleteData = await Checkout.findByIdAndDelete(id);
        if(deleteData){
            return res.json({status: true});
        } else {
            return res.json({status: false});
        }
    }

    // Update the status of a checkout item
async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedData = await Checkout.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // return the updated document
        );

        if (updatedData) {
            return res.json({ status: true, data: updatedData });
        } else {
            return res.json({ status: false, message: "Not found" });
        }
    } catch (error) {
        return res.json({ status: false, error: error.message });
    }
}

// In CheckoutController.js
async getCheckoutByUsername(req, res) {
  const { username } = req.params;
  try {
    const checkoutData = await Checkout.find({ username: username });
    if (checkoutData) {
      return res.json({ status: true, data: checkoutData });
    } else {
      return res.json({ status: false, message: 'No data found' });
    }
  } catch (error) {
    return res.json({ status: false, error: error.message });
  }
}
saveCheckout = async (req, res) => {
  const { username, title, size, quantity, totalPrice, address } = req.body;

  try {
    // Validate input
    if (!Array.isArray(title) || !Array.isArray(size) || !Array.isArray(quantity)) {
      return res.status(400).json({ status: false, message: 'Invalid format: title, size, quantity should be arrays' });
    }

    if (title.length !== size.length || size.length !== quantity.length) {
      return res.status(400).json({ status: false, message: 'title, size, and quantity arrays must be the same length' });
    }

    // Decrease stock for each product
    for (let i = 0; i < title.length; i++) {
      const product = await AllProduct.findOne({ title: title[i] });
      if (!product) {
        return res.status(404).json({ status: false, message: `Product ${title[i]} not found` });
      }

      if (product.quantity < quantity[i]) {
        return res.status(400).json({ status: false, message: `Not enough stock for ${title[i]}` });
      }

      product.quantity -= quantity[i];
      await product.save();
    }

    // Save grouped order in one Checkout document
    const checkout = new Checkout({
      username,
      title,        // Array
      size,         // Array
      quantity,     // Array
      totalPrice,
      address,
      status: "Order Placed",
      dateOfPurchase: new Date(),
    });

    await checkout.save();

    res.status(200).json({ status: true, message: "Order saved as grouped checkout" });

  } catch (error) {
    console.error("Error saving checkout:", error);
    res.status(500).json({ status: false, message: "Failed to save order", error: error.message });
  }
};

  
  
  
  
  


   


}


export default CheckoutController;