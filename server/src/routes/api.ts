import express from 'express'

import userRouter from './user';
import messageRouter from './messages'

const router=express.Router();


router.use('/user',userRouter);
router.use('/messages',messageRouter);


export default router;