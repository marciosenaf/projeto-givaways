import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import * as dotenv from 'dotenv'; dotenv.config();
import modelsprod from './projeto1';

const app: express.Application = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// CRUD do projeto 1, com a rotas get(todos os valores), get(resultado especifico), post, patch, delete

app.get('/produtos', async (req: Request, res: Response) => {
    try {
        const produtos = await modelsprod.find() as any;

        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

app.get('/produto/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const produto = await modelsprod.findOne({ _id: id });

        if (!produto) {
            res.status(422).json({ message: 'Produto não encontrado!' });
            return;
        }

        res.status(200).json(produto);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

app.post('/produtos', async (req: Request, res: Response) => {
    const { id, name, category, status, quantity, created_at, updated_at, deleted_at } = req.body as any;

    const gerenciamento = {
        id,
        name,
        category,
        status,
        quantity,
        created_at,
        updated_at,
        deleted_at,
    };

    try {
        await modelsprod.create(gerenciamento);

        res.status(201).json({ message: 'Produtos inserido no sistema com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

app.patch('/produto/:id', async (req: Request, res: Response) => {
    const Id = req.params.id;

    const { id, name, category, status, quantity, created_at, updated_at, deleted_at } = req.body as any;

    const gerenciamento = {
        id,
        name,
        category,
        status,
        quantity,
        created_at,
        updated_at,
        deleted_at
    }


    try {
        const update = await modelsprod.updateOne({ _id: Id }, gerenciamento) as any;

        if (update.matchedCount === 0) {
            res.status(422).json({ message: 'Produto não encontrado!' });
            return;
        }

        res.status(200).json(gerenciamento);
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

app.delete('/produto/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    const excluir = await modelsprod.findOne({ _id: id });

    if (!excluir) {
        res.status(422).json({ message: 'Produto não encontrado!' });
        return;
    }

    try {
        await modelsprod.deleteOne({ _id: id });
        res.status(200).json({ message: 'Produto removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: error });
    }
});

// Projeto 2

const municipalitySchema = new mongoose.Schema({
    id: Number,
    name: String
});

const Municipality = mongoose.model<typeof municipalitySchema>('Municipality', municipalitySchema);

app.get('/municipalities', async (req: Request, res: Response) => {
    try {
        const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/33/municipios');
        const municipalities = response.data.map(item => {
            return {
                id: item.id,
                name: item.name
            }
        });
        municipalities.forEach(async (municipality) => {
            await new Municipality(municipality).save()
        });
        res.send(municipalities);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Conexao com o MongoDB

mongoose.set('strictQuery', false);

mongoose
    .connect(
        process.env.USER_KEY
    )
    .then(() => {
        console.log('Conectou ao banco!');
        app.listen(3000);
    })
    .catch((err: any) => console.log(err));