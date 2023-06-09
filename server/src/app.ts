import express from 'express';
import cors from 'cors'

import apiRouter from './routes/api';

const app=express();

app.use(express.json());
app.use(cors())

app.use('/api/v1',apiRouter);


export default app;