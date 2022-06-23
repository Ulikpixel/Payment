import mongoose from "mongoose";
const { Schema, model } = mongoose;

const Payment = new Schema({
    card_number: { type: Number, required: true },
    date: { type: String, required: true },
    cvv: { type: Number, required: true },
    amount: { type: Number, required: true }
});

export default model('Payment', Payment)