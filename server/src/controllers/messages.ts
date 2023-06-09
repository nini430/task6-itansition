import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';

import Conversation from '../models/Conversation';
import Message from '../models/Message';

const sendMessage = asyncHandler(
  async (
    req: Request<
      {},
      {},
      { from: string; to: string; subject: string; message: string }
    >,
    res: Response,
    next: NextFunction
  ) => {
    const { from, to, subject, message } = req.body;
    let conversation: any;
    conversation = await Conversation.findOne({
      from: new mongoose.Types.ObjectId(from),
      to,
      subject,
    });
    if (!conversation) {
      conversation = await Conversation.create({ from, to, subject });
    }

    conversation.updatedAt=new Date();
    await conversation.save();

    const newMessage = await Message.create({
      conversationId: conversation._id,
      from,
      to,
      message,
    });

    return res.status(201).json({ convo:conversation, message: newMessage });
  }
);

const getMessages = asyncHandler(
  async (
    req: Request<{from:string,to:string}, {}>,
    res: Response,
  ) => {
    const conversations = await Conversation.find({
      $or:[
        {
          from:req.params.from,
          to:req.params.to
        },
        {
          from:req.params.to,
          to:req.params.from
        }
      ] 
    }).sort('-updatedAt');
    const conversationWithMessages=await Promise.all(conversations.map(async convo=>{
       const messages=await Message.find({conversationId:convo._id}).sort('-createdAt');
       return {convo,messages}
    }));

    return res.status(200).json(conversationWithMessages);
  }
);
 
export { sendMessage, getMessages };
