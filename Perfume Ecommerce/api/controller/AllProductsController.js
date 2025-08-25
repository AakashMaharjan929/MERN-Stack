import AllProduct from "../models/AllProducts.js";

class AllProductsController {
    async index(request,response){
        const allProducts = await AllProduct.find({});
        response.status(200).json(allProducts);
    }

    async show(req, res){
        try {
            const { title } = req.query; // Get the 'name' parameter from the query string
            const products = await AllProduct.find({ title: { $regex: title, $options: 'i' } }); // Case-insensitive search using regular expression
            res.status(200).json(products);
        } catch (error) {
            console.error("Error searching products by name:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    
    
    async update(req,res){
        let id = req.params.id;
        console.log("Data received:", req.body);
        await AllProduct.findByIdAndUpdate(id, { ...req.body });
        res.json({status: true, message: "Update successfully"});
    }

async store(req, res) {
  let imageSrc = '';
  let imageSrc2 = '';
  let imageSrc3 = '';

  if(req.files) {
    if(req.files['imageSrc']) {
      imageSrc = req.files['imageSrc'][0].filename;
    }
    if(req.files['imageSrc2']) {
      imageSrc2 = req.files['imageSrc2'][0].filename;
    }
    if(req.files['imageSrc3']) {
      imageSrc3 = req.files['imageSrc3'][0].filename;
    }
  }

  try {
    // Parse size string into array if necessary
   // inside store()
let parsedSize = req.body.size;

if (typeof parsedSize === 'string') {
  try {
    parsedSize = JSON.parse(parsedSize);
  } catch (e) {
    // fallback: maybe it's a space-separated string like "10 20 30"
    parsedSize = parsedSize.split(' ').map(val => val.trim());
  }
}

let parsedPriceOld = req.body.priceOld;
if (typeof parsedPriceOld === 'string') {
  try {
    parsedPriceOld = JSON.parse(parsedPriceOld);
  } catch (e) {
    parsedPriceOld = parsedPriceOld.split(/[\s,]+/).map(val => val.trim());
  }
}

let parsedPriceNew = req.body.priceNew;
if (typeof parsedPriceNew === 'string') {
  try {
    parsedPriceNew = JSON.parse(parsedPriceNew);
  } catch (e) {
    parsedPriceNew = parsedPriceNew.split(/[\s,]+/).map(val => val.trim());
  }
}



    const newProduct = new AllProduct({
      ...req.body,
      size: parsedSize,
        priceOld: parsedPriceOld,
      priceNew: parsedPriceNew,
      imageSrc,
      imageSrc2,
      imageSrc3
    });

    await newProduct.save();
    return res.status(201).json({ status: true, message: 'New Product added successfully' });
  } catch (error) {
    console.error("Error saving product:", error);
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
}


    


    async destroy(req,res){
        let id=req.params.id;
        // const product = await AllProduct.findById(id);
        // if(product.image != ""){
        //     let image = product.image;
        //     let imagePath = `public/users/${image}`;
        //     if(fs.existsSync(imagePath)){
        //         fs.unlinkSync(imagePath);
        //     }

            
        // }
        await AllProduct.findByIdAndDelete(id);
        return res.status(200).json({status: true, message: 'Product deleted successfully'});

    }

    async showById(req, res) {
      try {
        const id = req.params.id;
        const product = await AllProduct.findById(id); // Use AllProduct here
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        return res.json(product);
      } catch (error) {
        console.error("Error in showById:", error); // Add logging
        return res.status(500).json({ message: "Server error", error });
      }
    }
    
  
}

export default AllProductsController;