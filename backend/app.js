const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const { connectDb, disconnectDB } = require("./config/mongo_config");
const authRoutes = require("./routes/authRoute");
const postRoutes = require("./routes/postRoute");
const userRoutes = require("./routes/userRoute");
const passport = require("./controllers/googleController");


const app = express();

// INITIALIZE TO JSON DATA FRONTED TO BACKEND WITH FORM...
app.use(express.json());
app.use(express.urlencoded({extends: true}));

// SETUP COOKIE FOR ACCESS COOKIES DATA...
app.use(cookieParser())


//SETUP CORS FOR ERORR AND INTIGRATION FROM FRONTEND...
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));


// PASSPORT INITIALIZATION FOR GOOGLE AUTHENTICATION...
app.use(passport.initialize()); 



// THERE ARE ALL ROUTING AND MIDDLEWARES STARTED...
app.use("/auth", authRoutes);

app.use("/users", postRoutes)

app.use("/users", userRoutes)



const PORT = process.env.PORT || 10000;

const server = app.listen(PORT, async () => {
    console.log(`server listening on http://localhost:${PORT}`);
    
    await connectDb(process.env.MONGO_URI)
});


server.on("close", async () => await disconnectDB() )