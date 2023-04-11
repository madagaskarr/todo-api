const mongoose = require("mongoose");
const request = require("supertest");
const config = require("config");
const app = require('../app')
// const testingDb = require('testing_db')

describe("End to End Integration Tests Suite ", () => {

    beforeEach(async () => {
        await mongoose.connect(config.get('MONGO_URI'));
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("should create new account by passing correct username and password", async () => {

        // Arrange
        const username = "me@tigranes.io";
        const password = "Pass1234!";

        // Act
        const res = await request(app).post("/api/users/register").send({
            username: username,
            password: password,
        });

        // Assert
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(201);
    });

    it("should sign in when provided correct username and password", async () => {

        // Arrange
        await request(app).post("/api/users/register").send({
            username: "me@tigranes.io",
            password: "Pass1234!",
        });

        // Act
        const signInResponse = await request(app).post("/api/users/login").send({
            username: "me@tigranes.io",
            password: "Pass1234!",
        });

        // Assert
        expect(signInResponse.header['content-type']).toBe('application/json; charset=utf-8');
        expect(signInResponse.statusCode).toBe(200);
    });

    it("should create a new workspace if a user has correct access token", async () => {

        // Arrange
        const responseFromRegistration = await request(app).post("/api/users/register").send({
            username: "me@tigranes.io",
            password: "Pass1234!",
        });

        const accessToken = responseFromRegistration.body.accessToken;

        // Act
        const res = await request(app)
            .post("/api/workspaces/")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
            name: "My First Workspace",
        });

        // Assert
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(201);
    });

    it("should get all workspaces of the user", async () => {

        // Arrange
        const responseFromRegistration = await request(app).post("/api/users/register").send({
            username: "me@tigranes.io",
            password: "Pass1234!",
        });

        const accessToken = responseFromRegistration.body.accessToken;
        const userId = responseFromRegistration.body.id;

        await request(app)
            .post("/api/workspaces/")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: "My First Workspace",
            });

        // Act
        const res = await request(app)
            .get("/api/workspaces/")
            .set('Authorization', `Bearer ${accessToken}`)

        // Assert
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body[0].name).toBe("My First Workspace");
        expect(res.body[0].owner).toBe(userId);
    });
});