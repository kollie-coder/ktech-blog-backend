import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import jwt from "jsonwebtoken";



const app = express()


{/*const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};*/}


app.use(cookieParser())
//app.use(cors(corsOptions));
app.use(cors({credentials: true, methods: ["GET", "POST", "PUT", "DELETE"], origin: 'http://localhost:5173'}));
app.use(express.json())



const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json('Not authenticated.');

  jwt.verify(token, 'jwtkey', (err, user) => {
    if (err) return res.status(403).json('Token is not valid.');

    // Store user data in request for further use if needed
    req.user = token;

    next(); // Proceed to the next middleware
  });
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const upload = multer({ storage });
  
  app.post("/api/upload", upload.single("file"), function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename);
  });


app.use("/api/auth", authRoutes, authenticateToken)
app.use("/api/posts", postRoutes, authenticateToken) 
app.use("/api/user", userRoutes)



app.listen(8800, ()=>{
    console.log("Connected")
})
