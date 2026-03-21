import express from 'express';
import { prisma } from '../lib/prisma.js';

const port = 3000;
const app = express();

app.use(express.json());

app.get('/movies', async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc"
        },
        include: {
            genres: true,
            languages: true
        }
    });
    res.json(movies);
})

app.post("/movies", async (req, res) => {

    const {title, genre_id, language_id, oscar_count, release_date} = req.body;

     try {
        await prisma.movie.create({
        data: {
            title,
            genre_id,
            language_id,
            oscar_count,
            release_date: new Date(release_date)
        }
     })
     } catch (error) {
        return res.status(500).send({message: "Falha ao cadastrar o filme"})
     }

     res.status(201).send("Filme cadastrado com sucesso!");
})

app.listen(port, () => {
    console.log('Servidor iniciado na porta http://localhost:3000');
});
