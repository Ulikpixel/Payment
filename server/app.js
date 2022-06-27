import express from 'express';
import router from './src/routes/payment.js';
import mongoose from 'mongoose';
import corsMiddleware from './src/middleware/cors.js';
import 'dotenv/config';

const PORT = process.env.PORT || 5000

const app = express()
app.use(corsMiddleware);
app.use(express.json({ extended: true }))
app.use('/api', router)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start();