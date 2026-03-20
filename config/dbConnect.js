const mongoose = require("mongoose");

const enviroment = process.env.NODE_ENV;

if(enviroment === "development"){
    try{
        mongoose.connect(process.env.MONGODB_DEVELOPMENT_CONNECTION_STR);
        console.log("Successfully connected to the database");
    }
    catch(error){
        throw new Error(error);
    }
}
else if(enviroment === "test"){
   console.log("Tests are underway ...");
}

 