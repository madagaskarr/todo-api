const mongoose = require("mongoose");
const request = require("supertest");
const config = require("config");
const app = require('../app')
require("dotenv").config();

describe("User Registration", () => {

    beforeEach(async () => {
        await mongoose.connect(config.get('MONGO_URI'));
    });

    afterEach(async () => {
        // Drop the database
        await mongoose.connection.db.dropDatabase();
    });

    afterAll(async () => {
        // Drop the database
        await mongoose.connection.close();
    });

    it("should create a product", async () => {
        const res = await request(app).post("/api/users/register").send({
            username: "dfhdksfbksdfldndsfkjsdbfkfsdbfs",
            password: "gdgdfgdsdfsdffsfsgd",
        });
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(201);
    });

});