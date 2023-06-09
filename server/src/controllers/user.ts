import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

import User from '../models/User';

const addUser = asyncHandler(
  async (
    req: Request<{}, {}, { name: string }>,
    res: Response,
    next: NextFunction
  ) => {
    let user: any;
    user = await User.findOne({ name: req.body.name });
    if (!user) {
      user = await User.create({ name: req.body.name });
    }

    return res.status(200).json(user);
  }
);

const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});
    return res.status(200).json(users);
  }
);

export { addUser, getUsers };
