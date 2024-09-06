import express from 'express'
import dotenv from 'dotenv'
import ConnectDB from './db/ConnectDB.js'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'

dotenv.config();
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

const port = process.env.PORT || 1234;
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/fe/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "fe", "dist", "index.html"))
    });
}
app.listen(port, () => {
    ConnectDB();
    console.log(`Server is running at 
http://localhost:${port}`);
});