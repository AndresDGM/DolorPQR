import express from 'express';
import cors from 'cors';
import { envs } from './config/envs.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor iniciado correctamente' });
});

app.listen(envs.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${envs.PORT}`);
});
