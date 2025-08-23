import express from 'express'
import { authRoute } from '../middleware/auth.middleware.js'
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users", authRoute, getUsersForSidebar);
router.get("/:id", authRoute, getMessages);  // here we are putting dynamic endpoint hence the same endpoint name will be used in the message route as well which is 'id'

router.post('/send/:id', authRoute, sendMessage);
export default router 