import CheckoutReport from "../models/CheckoutReport.js";

class CheckoutReportController {

    constructor() {}

    async checkoutReport(req, res) {
        let { username, title, size, quantity, totalPrice, address, dateOfPurchase,status } = req.body;

        let checkoutReport = new CheckoutReport({
            username: username,
            title: title,
            size: size,
            quantity: quantity,
            totalPrice: totalPrice,
            address: address,
            dateOfPurchase: dateOfPurchase,
            status: status
        });

        let saveData = await checkoutReport.save();
        if (saveData) {
            return res.json({ status: true });
        } else {
            return res.json({ status: false });
        }
    }

    async displayCheckoutReport(req, res){
        let checkoutReportData = await CheckoutReport.find();
        if(checkoutReportData){
            return res.json(checkoutReportData);
        } else {
            return res.json({status: false});
        }
    }

}

export default CheckoutReportController;