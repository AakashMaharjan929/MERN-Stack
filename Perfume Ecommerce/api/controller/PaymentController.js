import PaymentDetails from "../models/PaymentDetails.js";

class PaymentController {
  async storePayment(req, res) {
    try {
      const { orderId, amount, username, phone, date } = req.body;

      if (!orderId || !amount || !username || !phone) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const payment = new PaymentDetails({ orderId, amount, username, phone, date });
      await payment.save();

      res.status(201).json({ message: 'Payment saved successfully', payment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default PaymentController;
