import dotenv from 'dotenv/config'
import express from 'express'
import cors from 'cors'
import dbConnect from './config/db.config.js'
import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import reviewRouter from './routes/review.routes.js'
import proposalRouter from './routes/proposal.routes.js'

dbConnect()

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URL }));

app.use(userRouter);
app.use(postRouter)
app.use(reviewRouter)
app.use(proposalRouter)
app.listen(Number(process.env.PORT), () =>
  console.log(`Server up and running at port ${process.env.PORT}`)
);