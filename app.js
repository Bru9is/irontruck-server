import dotenv from 'dotenv/config'
import express from 'express'
import cors from 'cors'
import dbConnect from './config/db.config.js'
import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'

dbConnect()

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URL }));

app.use(userRouter);
app.use(postRouter)
app.listen(Number(process.env.PORT), () =>
  console.log(`Server up and running at port ${process.env.PORT}`)
);