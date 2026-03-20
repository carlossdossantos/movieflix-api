import express from 'express';
import { prisma } from '../lib/prisma.js';

const port = 3000;
const app = express();

app.get('/movies', async (req, res) => {
    const movies = await prisma.movie.findMany();
    res.json(movies);
})

app.listen(port, () => {
    console.log('Servidor iniciado na porta http://localhost:3000');
});
