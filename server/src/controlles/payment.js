import { validationResult } from 'express-validator';
import Payment from '../models/payment.js';

class PaymentController {
    async addPayment(req, res) {
        try {
            const warning = validationResult(req);
            const { card_number, date, cvv, amount } = req.body;

            if (!warning.isEmpty()) {
                return res.status(400).json({
                    message: "Заполните объязательные поля", error: warning.errors.map(w => ({ field: w.param, text: w.msg }))
                });
            }

            const payment = await Payment.create({ card_number, date, cvv, amount });

            res.json({ payment: { request_id: payment.id, amount } });
        } catch(error) {
            console.log(error);
            res.status(400).json({ message: 'Ошибка при оплаты платежа', error });
        }
    }
}

export default new PaymentController();