const User = require("../models/userModel");
const generateToken = require("../utils/genrateToken");
const response = require("../utils/responseHandler");
const bcrypt = require("bcryptjs")




const registerUser = async (req, res) => {
    try {
        
        const { username, email, password, gender, dateOfBirth } = req.body;

        // CHECK THE EXISTING USER....
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return response(req, 400, "User email is already exists!!!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            gender,
            dateOfBirth
        })

        await newUser.save();

        const accessToken = generateToken(newUser);

        res.cookie("accessToken", accessToken, {httpOnly: true})

        return response(res, 201, "User Created SuccessFully!", {
            username: newUser.username,
            email: newUser.email
        });

    } catch (error) {
        
        console.error("Error Register User!!!", error.message);
        return response(res, 500, "Internal Server Error", error.message);

    }
};


const loginUser = async (req, res) => {
    try {
        
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user) {
            return response(res, 404, "User not found with this email!!!");
        };

        const matchPassword = await bcrypt.compare(password, user.password);

        if(!matchPassword) return response(res, 404, "Password is incorrect please try again!!!");

        const accessToken = generateToken(user);

        res.cookie("accessToken", accessToken, { httpOnly: true });

        return response(res, 201, "User loggedIn successFully!", {
            username: user.username,
            email: user.email
        });

    } catch (error) {
        
        console.log("Error in Logging user", error.message);
        return response(res, 500, "Internal server error!!!", error.message);

    }
};


const logoutUser = (req, res) => {

    try {
        
        res.clearCookie("accessToken");

        return response(res, 201, "User logout successFully!");

    } catch (error) {

        console.log("Error in logout user!!!", error.message);
        return response(res, 500, "Internal server error!!!", error.message);
        
    }
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser
}