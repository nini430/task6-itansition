import express from 'express'
import { getMessages, sendMessage } from '../controllers/messages';

const router=express.Router();

router.post('/',sendMessage);
router.get('/:from/:to',getMessages);

export default router;