import express from 'express'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser'
import cors from "cors"
import { app, server } from './lib/socket.js';
import path from "path"

dotenv.config()
const port = process.env.PORT;
const __dirname = path.resolve()

app.use(express.json());
app.use(cookieParser());
//sending info from frontend to backend
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// middle route
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // catch-all for React Router / SPA routes
    app.get("/:path(*)", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });

}

// app.get('/', (req, res) => {
//     res.send("hii there");
// })

server.listen(port, () => {
    connectDB();
    console.log(`server started at http://localhost:${port}`);
})
