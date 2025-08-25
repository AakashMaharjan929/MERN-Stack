import NewProductsMen from "../models/NewProductsMen.js";



class NewProductsMenController {
    async index(request,response){
        const newProductsMen = await NewProductsMen.find({});
        response.status(200).json(newProductsMen);
    }

    async store(req, res) {
        const images = {
            imageSrc: req.files['imageSrc'] ? req.files['imageSrc'][0].path : undefined,
            imageSrc2: req.files['imageSrc2'] ? req.files['imageSrc2'][0].path : undefined,
            imageSrc3: req.files['imageSrc3'] ? req.files['imageSrc3'][0].path : undefined,
        };
    
        // Construct the new product object with both the text fields and image paths
        const productData = {
            ...req.body,
            ...images // This will add image paths to the product data, setting them to undefined if no image was uploaded for a field
        };
    
        try {
            const newProduct = new NewProductsMen(productData);
            await newProduct.save(); // Save the new product to the database
            return res.status(201).send(newProduct); // Send back the newly created product
        } catch (error) {
            return res.status(500).send(error); // Handle errors
        }
    }
    
}

export default NewProductsMenController;