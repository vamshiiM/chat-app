import express from 'express'
import { signUp, logIn, logOut, updateProfile, checkAuth } from '../controllers/auth.controller.js'
import { authRoute } from '../middleware/auth.middleware.js';



const router = express.Router();

// api endpoints
router.post("/signup", signUp)
router.post("/login", logIn)
router.post("/logout", logOut)

router.put("/update-profile", authRoute, updateProfile) // here we are checking is user Authenticated before entering the endpoint

router.get("/check", authRoute, checkAuth);

export default router;