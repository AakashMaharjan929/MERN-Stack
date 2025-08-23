const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");



const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/crud-app",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log("MongoDB connected"))
.catch((err)=> console.log(err));

const Port = 4000;

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});