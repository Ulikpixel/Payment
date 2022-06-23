import Router from "express";
import controller from '../controlles/payment.js';
import { check } from 'express-validator';

const router = new Router();
router.post(
    '/payment',
    [
        check('card_number', 'поле должно содержать 16 цифр').isNumeric().isLength({ min: 16, max: 16 }),
        check('cvv', 'поле должно содержать 3 цифры').isNumeric().isLength({ min: 3, max: 3 }),
        check('amount', 'поле должно содержать число выше нуля').isNumeric().isInt({ min: 1 }),
        check('date', 'поле должно содержать дату в формате  MM/YYYY').matches(/^(0?[1-9]|1[012])[\/\-]\d{4}$/)
    ], 
    controller.addPayment
);

export default router;