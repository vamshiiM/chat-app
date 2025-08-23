import { generateToken } from "../lib/utils.js";
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js";

export const signUp = async (req, res) => {

    const { fullName, email, password } = req.body;

    try {
        if (!fullName) {
            return res.status(400).json({ message: "UserName is required" });
        } else if (!email) {
            return res.status(400).json({ message: "Email is required" });
        } else if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        // hash password - we will use bcrypt to encrypt the information
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be atleast 6 characters" });
        }
        const user = await User.findOne({ email });
        if (user) {
            console.log("email already exists");
            return res.status(400).json({ message: "email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); // this will encrypt the data

        const newUser = new User({
            fullName: fullName, // or fullName
            email: email,
            password: hashedPassword
        });

        if (newUser) {
            // generate jwt over here
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

            console.log("user created succesfully");
        } else {
            res.status(400).json({ message: "invalid user data" });
        }
    } catch (error) {
        console.log("error in signUp Controller :", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
        console.log("user logged in successfully");

    } catch (error) {
        console.log("error in logIn method", error);
        res.status(500).json({ message: "Internal Server error" });
    }
}

export const logOut = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out successFully" });
    } catch (error) {
        console.log("Error in logOut Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id

        if (!profilePic) {
            return res.status(400).json({ message: "profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic); // this is to upload the image to the cloudinary
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        console.log(updatedUser);

        res.status(200).json({ message: "user's profile updated" });
    } catch (error) {
        console.log("error is update profile", error);
        res.status(500).json({ message: "Internal Server Error in update Profile" });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkable controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}