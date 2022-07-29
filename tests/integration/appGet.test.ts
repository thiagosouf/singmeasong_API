import app from '../../src/app.js';
import supertest from 'supertest';
import { prisma } from "../../src/database.js"

const seed = [
        {name:"Falamansa - Rindo a Toa",youtubeLink:"https://www.youtube.com/watch?v=iuwAZ-x1sAo"},
        {name:"Falamansa - Xote da Alegria",youtubeLink:"https://www.youtube.com/watch?v=QDAHMMMtFBI"},
        {name:"Xote dos Milagres - Falamansa",youtubeLink:"https://www.youtube.com/watch?v=ZTDStzSs2Wo"},
        {name:"Alceu Valença - La Belle de Jour / Girassol (Ao Vivo)",youtubeLink:"https://www.youtube.com/watch?v=l-FxY25lYzY"},
        {name:"Deixa Acontecer / Coração Radiante / Compasso Do Amor",youtubeLink:"https://www.youtube.com/watch?v=c4XeTP11EI8"},
        {name:"Raça Negra - Cheia de Manias part. Thiaguinho",youtubeLink:"https://www.youtube.com/watch?v=lxNd6LRi-PQ"}
    ]

beforeEach(async () => {
    await prisma.$executeRaw`DELETE FROM recommendations`;
})

describe("GET /recommendations", () => {
    it("Buscando recomendações, esperando return 200", async () => {
        await prisma.recommendation.createMany({data:seed})
        const result = await supertest(app).get("/recommendations");
        const status = result.status;

        expect(status).toEqual(200);
    });

    it("Buscando recomendações pelo ID, esperando return 200", async () => {
        await prisma.recommendation.createMany({data:seed})
        const findId = await prisma.recommendation.findFirst({ where: { name: "Falamansa - Xote da Alegria" } })
        const result = await supertest(app).get(`/recommendations/${findId.id}`);
        const status = result.status;

        expect(status).toEqual(200);
    });

    it("Buscando recomendações pelo ID inexistente, esperando return 404", async () => {
        const result = await supertest(app).get(`/recommendations/0`);
        const status = result.status;

        expect(status).toEqual(404);
    });

    it("Buscando recomendações aleatorias /recommendatios/random, esperando return 200", async () => {
        await prisma.recommendation.createMany({data:seed})
        const result = await supertest(app).get(`/recommendations/random`);
        const status = result.status;

        expect(status).toEqual(200);
    });

    it("Buscando recomendações aleatorias vazia /recommendatios/random, esperando return 404", async () => {
        await prisma.$executeRaw`DELETE FROM recommendations`;
        const result = await supertest(app).get(`/recommendations/random`);
        const status = result.status;

        expect(status).toEqual(404);
    });

    it("Buscando as melhores musicas /recommendations/top/:amount, esperado return 200",async () =>{
        await prisma.recommendation.createMany({data:seed})
        const number = Math.floor(Math.random() * 100 + 1)
        const result = await supertest(app).get(`/recommendations/top/${number}`);
        const status = result.status;

        expect(status).toEqual(200)
    })

    it("Buscando as melhores musicas (lista vazia) /recommendations/top/:amount, esperado return 200",async () =>{
        const number = Math.floor(Math.random() * 100 + 1)
        const result = await supertest(app).get(`/recommendations/top/${number}`);
        const status = result.status;

        expect(status).toEqual(200)
    })

    it("Buscando as melhores musicas (amount invalido) /recommendations/top/:amount, esperado return 200",async () =>{
        await prisma.recommendation.createMany({data:seed})
        const result = await supertest(app).get(`/recommendations/top/0`);
        const status = result.status;

        expect(status).toEqual(200)
    })
})

afterAll(async () => {
    await prisma.$disconnect();
})