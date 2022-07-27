import app from '../src/app.js';
import supertest from 'supertest';
import { prisma } from "./../src/database.js"


const _BODY = {
    name: "Falamansa - Xote dos Milagres",
    youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
};

beforeEach(async () => {
    await prisma.$executeRaw`DELETE FROM recommendations WHERE name = 'Falamansa - Xote dos Milagres'`;
})

describe("POST /recommendations", () => {
    it("Enviando body valido, esperando return 201", async () => {
        const result = await supertest(app).post("/recommendations").send(_BODY);
        const status = result.status;

        expect(status).toEqual(201);
    });

    it("Enviando body duplicado, esperando return 409", async () => {
        await supertest(app).post("/recommendations").send(_BODY);
        const result = await supertest(app).post("/recommendations").send(_BODY);
        const status = result.status;

        expect(status).toEqual(409);
    });

    it("Enviando nome duplicado, esperando return 409", async () => {
        const body = {
            name: "Falamansa - Xote dos Milagres",
            youtubeLink: "https://www.youtube.com/watch?v=iuwAZ-x1sAo"
        };
        await supertest(app).post("/recommendations").send(_BODY);
        const result = await supertest(app).post("/recommendations").send(body);
        const status = result.status;

        expect(status).toEqual(409);
    });

    it("Enviando nome vazio, esperando return 422", async () => {
        const body = {
            name: "",
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        };

        const result = await supertest(app).post("/recommendations").send(body);
        const status = result.status;

        expect(status).toEqual(422);
    });

    it("Enviando link vazio, esperando return 422", async () => {
        const body = {
            name: "Falamansa - Xote dos Milagres",
            youtubeLink: ""
        };

        const result = await supertest(app).post("/recommendations").send(body);
        const status = result.status;

        expect(status).toEqual(422);
    });

    it("Enviando link invalido, esperando return 422", async () => {
        const body = {
            name: "Falamansa - Xote dos Milagres",
            youtubeLink: "http://www.google.com"
        };

        const result = await supertest(app).post("/recommendations").send(body);
        const status = result.status;

        expect(status).toEqual(422);
    });
});

describe("POST /recommendations/:id/upvote", () => {
    it("Testando upvote no video selecionado, esperando return 200", async () => {
        await supertest(app).post("/recommendations").send(_BODY);
        const findId = await prisma.recommendation.findFirst({ where: { name: "Falamansa - Xote dos Milagres" } })
        const result = await supertest(app).post(`/recommendations/${findId.id}/upvote`);
        const status = result.status;

        expect(status).toEqual(200);
    });

    it("Testando upvote em video inexistente, esperando return 404", async () => {
        const result = await supertest(app).post(`/recommendations/0/upvote`);
        const status = result.status;

        expect(status).toEqual(404);
    });
});

describe("POST /recommendations/:id/downvote", () => {
    it("Testando downvote no video selecionado, esperando return 200", async () => {
        await supertest(app).post("/recommendations").send(_BODY);
        const findId = await prisma.recommendation.findFirst({ where: { name: "Falamansa - Xote dos Milagres" } })
        const result = await supertest(app).post(`/recommendations/${findId.id}/downvote`);
        const status = result.status;

        expect(status).toEqual(200);
    });

    it("Testando downvote em video inexistente, esperando return 404", async () => {
        const result = await supertest(app).post(`/recommendations/0/downvote`);
        const status = result.status;

        expect(status).toEqual(404);
    });
});

afterAll(async () => {
    await prisma.$disconnect();
})