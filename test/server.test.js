const request = require("supertest");
const {expect} = require("chai");
const {app} = require("../app");
const {mongoose } = require("mongoose");
const {MongoMemoryServer} = require("mongodb-memory-server");

let mongoServer = null;
let name = null;
let id = null;

describe("POST /api/v1/tasks", () => {
    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        //console.log("Successfully connected to the in-memory database");
    });

    it("should create a new todo item", async () => {
        name = "Walking the dog";

        const response = await request(app)
            .post("/api/v1/tasks")
            .send({name});
        id = await response.body["_id"];
        
        expect(response.statusCode)
            .to.equal(201);
        expect(response.body.name)
            .to.be.a('string')
            .to.equal(name);
    });

    it("should not create a new todo item", async () => {
        const response = await request(app)
            .post("/api/v1/tasks")
            .send({});
        
        expect(response.statusCode)
            .to.equal(400);
        expect(response.body)
            .to.be.a("object");
    })

});

describe("GET /api/v1/tasks", () => {

    it("should get all todo items", async () => {
        const response = await request(app)
            .get("/api/v1/tasks")
        
        expect(response.statusCode)
            .to.equal(200);
        expect(response.body)
            .to.have.lengthOf(1);
        expect(response.body[0])
            .to.have.ownProperty("createdAt");
    });

    it("should get a todo by its id", async () => {
        
        const response = await request(app)
            .get(`/api/v1/tasks/${id}`);
        
        
        expect(response.statusCode)
            .to.equal(200);
        expect(response.body[0].name)
            .to.be.a("string")
            .to.equal(name);

    });
});

describe("PATCH /api/v1/tasks/:id", () =>{
    
    it("should update the task with the specified id", async () => {
        //should();
        
        
        name = "postman updated task";
        let response = await request(app)
            .patch(`/api/v1/tasks/${id}`)
            .send({name});
        
        expect(response.statusCode).to.equal(200);
        expect(response.body.name).to.equal(name);
        
    });

    it("should not update the task with a wrong/undefined id", async () => {

        newId = new mongoose.Types.ObjectId();


        newName = "postman second updated task";
        
        console.log(`id: ${newId}`);
        let response = await request(app)
            .patch(`/api/v1/tasks/${newId}`)
            .send({"name": newName});
        
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.equal("");
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });
});


