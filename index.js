import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import './db.js';
// const path = require("path");
import path from 'path'
import { AdminRuter } from './routes/auth.js';
import { studentRouter } from './routes/student.js';
import { bookRouter } from './routes/book.js';
import { Book } from './models/Book.js';
import {Student} from './models/Student.js';
import {Admin} from './models/Admin.js';
import { fileURLToPath } from 'url';



const app = express()
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials:true
}
))
app.use(cookieParser())
dotenv.config()
app.use('/auth', AdminRuter);
app.use('/student', studentRouter);
app.use('/book', bookRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/dashboard', async (req, res) => {
    try {
        const student = await Student.countDocuments()
        const book = await Book.countDocuments()
        const admin = await Admin.countDocuments()
        return res.json({ok:true, student, book, admin})

    } catch (error) {
        return res.json(err)
    }
})

app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "client", "dist")));
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
    });

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
