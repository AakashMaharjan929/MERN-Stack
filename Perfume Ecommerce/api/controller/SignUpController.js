    import SignUp from "../models/SignUp.js";
    import AllProducts from "../models/AllProducts.js";
    import bcrypt from 'bcrypt';

    class SignUpController {
        async index(request,response){
            const signUp = await SignUp.find({});
            response.status(200).json(signUp);
        }

        async show(req, res){
            try {
                const { name } = req.query; // Get the 'name' parameter from the query string
                const products = await SignUp.find({ name: { $regex: name, $options: 'i' } }); // Case-insensitive search using regular expression
                res.status(200).json(products);
            } catch (error) {
                console.error("Error searching products by name:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        }

        async getUserDetails(req, res){
            try {
                const username = req.session.username; // or get the username from a request parameter or token
                const user = await SignUp.findOne({ username: username }, 'username email phone'); // Select only the username and email fields
                if (user) {
                res.json({ valid: true, username: user.username, email: user.email, phone: user.phone});
                } else {
                res.status(404).json({ valid: false, message: "User not found" });
                }
            } catch (error) {
                res.status(500).json({ valid: false, message: error.message });
            }
            }
        

       async store(req, res) {
    try {
      const { password, ...otherFields } = req.body;

      // Hash the password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new SignUp({
        ...otherFields,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

        async cart(req, res){
            try {
                const { productName, size, quantity } = req.body;
        
                // Log the product details coming in the request body
                console.log("Product Details:", { productName, size, quantity });
        
                const username = req.session.username;
        
                const user = await SignUp.findOne({ username: username });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
        
                // const product = await AllProducts.findOne({ name: productName });
                // if (!product) {
                //     return res.send("Product not found");
                // }
        
                // Add product details to the cart
                user.cart.push({
                    productName: productName,
                    size: size,
                    quantity: quantity
                });
        
                await user.save();
        
                res.status(200).json({ message: "Item added to cart successfully" });
            } catch (error) {
                console.error("Error adding item to cart:", error);
                res.send("erorrororororororororor")
            }
        }
        
        async favourite(req, res){
            try {
                const { title, priceOld, priceNew, description, imageSrc, imageSrc2, imageSrc3} = req.body;
        
                // Log the product details coming in the request body
                console.log("Product Details:", { title, priceOld, priceNew, description, imageSrc, imageSrc2, imageSrc3});
        
                const username = req.session.username;
        
                const user = await SignUp.findOne({ username: username });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
        
        
                // Add product details to the cart
                user.favorite.push({
                    title: title,
                    priceOld: priceOld,
                    priceNew: priceNew,
                    description: description,
                    imageSrc: imageSrc,
                    imageSrc2: imageSrc2,
                    imageSrc3: imageSrc3
                });
        
                await user.save();
        
                res.status(200).json({ message: "Item added to cart successfully" });
            } catch (error) {
                console.error("Error adding item to cart:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        }

        async deleteFavorite(req, res){
            try {
                const { title, username } = req.body;
                
                // Find the user by username
                const user = await SignUp.findOne({ username });
        
                // Check if user exists
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
        
                // Update the user's favorites array to remove the item with the specified title
                await SignUp.findOneAndUpdate(
                    { username },
                    { $pull: { favorite: { title } } }
                );
        
                res.status(200).json({ message: "Favorite deleted successfully" });
            } catch (error) {
                console.error("Error deleting favorite:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        }
        
        
        async getCartItems(req, res) {
            try {
                const username = req.session.username;
    
                const user = await SignUp.findOne({ username: username });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
    
                // Return the cart items
                res.status(200).json({ cart: user.cart });
            } catch (error) {
                console.error("Error getting cart items:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        }

        async deleteCart(req, res){
            try {
                const { productName, username } = req.body;
                
                // Find the user by username
                const user = await SignUp.findOne({ username });
        
                // Check if user exists
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
        
                // Update the user's favorites array to remove the item with the specified title
                await SignUp.findOneAndUpdate(
                    { username },
                    { $pull: { cart: { productName } } }
                );
        
                res.status(200).json({ message: "Favorite deleted successfully" });
            } catch (error) {
                console.error("Error deleting favorite:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        }

        async getFavoriteItems(req, res) {
            try {
                const username = req.session.username;
                const user = await SignUp.findOne({ username: username });
                console.log(username);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
    
                // Return the cart items
                res.status(200).json({ favorite: user.favorite });
            } catch (error) {
                console.error("Error getting cart items:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        }
        
        
        
        
        async update(req,res){

        }

        async emptyCart(req, res) {
            try {
              const { username } = req.body;
          
              // Use updateOne to avoid version conflict
              await SignUp.updateOne(
                { username },
                { $set: { cart: [] } }
              );
          
              res.status(200).json({ message: 'Cart cleared successfully' });
            } catch (error) {
              console.error("Error clearing cart:", error);
              res.status(500).json({ message: "Internal server error" });
            }
          }
          

    }

    export default SignUpController;