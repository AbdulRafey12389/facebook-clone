const jwt = require("jsonwebtoken");
const response = require("../utils/responseHandler");


const authMiddleware = (req, res, next) => {

    const accessToken = req?.cookies?.accessToken;

    if (!accessToken) return response(res, 401, "You need to logging first and try again!!!");

    try {
        
        const decodeToken = jwt.verify(accessToken, process.env.JWT_SECRET);

        req.user = decodeToken;
        next();

    } catch (error) {
        
        console.error("Error in authMiddleware token", error.messsage);
        return response(res, 401, "accessToken is invalid or expired please try another token!!!")
        

    }

};


module.exports = authMiddleware;