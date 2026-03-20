const Task = require("../models/taskSchema");

const createTask = async(request, response) => {
    response.set({"content-type": "json"});
    let responseObject = null;

    try{
        if(request?.body?.name){
            const task = new Task(request.body);
            
            responseObject = await task.save();
            response.status(201);
        }
        else{
            response.status(400)
            responseObject= {"error": new Error("No todo item found in the body")};
            
        }

        
    }
    catch(error){
        responseObject = {error}
        response.status(500);
    }

    response.send(responseObject);
};

const getTasks = async(request, response) => {
    response.set({"content-type": "application/json"})
    let responseObject = null;

    try{
        let filter = {};
        if(request?.params?.id){

            let id = request.params.id.toString().trim();
            filter = {"_id": id};
        }

        responseObject = await Task.find(filter);
        response.status(200)
    }
        
    catch(error){
        response.status(500)
        responseObject= {"error": error.message}
    }

    response.send(responseObject);
};

const updateTask = async (request, response) => {
    response.set({"content-type": "application/json"});
    responseObject = null;

    try{
        let id = request.params?.id.toString().trim();
        let updateObject = request?.body;
        
        if(!id && !updateObject){
            responseObject = {error: new Error("Missing object id or update object")};
        }
        else{
            responseObject = await Task.findByIdAndUpdate({"_id": id}, {$set: updateObject}, {returnDocument: 'after', upsert: false});
        }
        response.statusCode = responseObject?._id ? 200 : 404;
    }
    catch(error){
        responseObject = {error,};
        response.statusCode = 500;
    }

    response.send(responseObject);

}

module.exports = {
    createTask,
    getTasks,
    updateTask,
}