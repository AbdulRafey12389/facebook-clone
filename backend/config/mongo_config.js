const mongoose = require("mongoose");


// CLIENT OBJECTS CONTAININGS SERVER API CONGIGURATION...

const  clientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: {
        version: "1",
        strict: true,
        deprcationErros: true
    },
    dbName: "facebook"
}


// CONNECTION TO THE MONGODB DATABASE USING PROVIDED CONNECTION STRING...
const connectDb = async (connectionUri) => {
    try {
        
        await mongoose.connect(connectionUri, clientOptions);
        console.log("connected to the mongodb");
        

    } catch (error) {
        
        console.error("Error to connectiong mongodb", error.message);
        process.exit(1)

    }
}


// DISCONNECTED MONGODB FOR DATABASE USING MONGOOSE...
const disconnectDB = async () => {
    try {
        
        await mongoose.disconnect();
        console.log("disconnected to the mongodb");
        

    } catch (error) {
        
        console.error("Error to disconnecting mongodb", error.message);
        throw error;

    }
}; 


module.exports = {
    connectDb,
    disconnectDB
}