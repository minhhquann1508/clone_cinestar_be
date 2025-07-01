import express from 'express';
import path from 'path';
import { errorHandler } from './middlewares/errorHandler';
import { dbConnect } from './config/db';
import theaterRoute from './routes/theater';
import movieRoute from './routes/movie';
import roomRoute from './routes/room';
import seatRoute from './routes/seat';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//dbConnect
dbConnect();

// Routes
app.use('/api/theater', theaterRoute);
app.use('/api/movie', movieRoute);
app.use('/api/room', roomRoute);
app.use('/api/seat', seatRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
