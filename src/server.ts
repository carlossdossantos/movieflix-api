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

        // verificar no banco se já existe um filme com o nome que
        // está sendo enviado

        const movieWithSameTitle = await prisma.movie.findFirst({
            where: {
                title: {equals: title, mode: "insensitive"}
            }
        });

        if(movieWithSameTitle) {
            return res.status(409).send({message: "Já existe um filme cadastrado com esse título"});
        }

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

app.put("/movies/:id", async (req, res) => {
    try {
        // pegar o id do registro que vai ser atualizado
      const id = Number(req.params.id);

      const movie = await prisma.movie.findUnique({
        where: {
            id: id
        }
      })

      if(!movie) {
        return res.status(404).send({message: "Filme não encontrado"});
      }

      const data = {...req.body };
      data.release_date = data.release_date ? new Date(data.release_date) : undefined;
    // pegar os dados do filme que será atualizado e atualizar ele no prisma
    await prisma.movie.update({
        where: {id: id},
        data: data
    })

    // retornar o status correto informando que o filme foi atualizado
    res.status(200).send("Filme alterado com sucesso!");
    } catch (error) {
        return res.status(500).send({message: "Falha ao atualizar o registro do filme"})
    }
})

app.listen(port, () => {
    console.log('Servidor iniciado na porta http://localhost:3000');
});
