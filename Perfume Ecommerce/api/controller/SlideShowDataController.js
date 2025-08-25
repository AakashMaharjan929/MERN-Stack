import SlideShowData from "../models/SlideShowData.js";

class SlideShowDataController {
    async index(request, response) {
        const slideShowData = await SlideShowData.find({});
        response.status(200).json(slideShowData);
    }

    async show(request, response) {
        try {
            const { title } = request.query; // Get the 'title' parameter from the query string
            const slideShowData = await SlideShowData.find({ title: { $regex: title, $options: 'i' } }); // Case-insensitive search using regular expression
            response.status(200).json(slideShowData);
        } catch (error) {
            console.error("Error searching slideShowData by title:", error);
            response.status(500).json({ message: "Internal server error" });
        }
    }

    async store(request, response) {
        let imageSrc = '';
        let imageSrc2 = '';
        let imageSrc3 = '';
        if (request.file) {
            imageSrc = request.file.filename;
        }
        if (request.file2) {
            imageSrc2 = request.file2.filename;
        }
        if (request.file3) {
            imageSrc3 = request.file3.filename;
        }
        const slideShowData = new SlideShowData({ ...request.body, imageSrc, imageSrc2, imageSrc3 });
        await slideShowData.save();
        response.status(201).json(slideShowData);
    }

    async update(request, response) {
        try {
            const { id } = request.params;
            const slideShowData = await SlideShowData.findByIdAndUpdate(id, request.body, { new: true });
            response.status(200).json(slideShowData);
        } catch (error) {
            console.error("Error updating slideShowData:", error);
            response.status(500).json({ message: "Internal server error" });
        }
    }

    async destroy(request, response) {
        try {
            const { id } = request.params;
            await SlideShowData.findByIdAndDelete(id);
            response.status(204).json();
        } catch (error) {
            console.error("Error deleting slideShowData:", error);
            response.status(500).json({ message: "Internal server error" });
        }
    }
}

export default SlideShowDataController;