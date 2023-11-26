

// server.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', async (req, res) => {
  const user = await prisma.photo.findMany()
  console.table(user)
  return res.status(200).send()
})

app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const base64Data = req.file.buffer.toString('base64');
    console.log(base64Data)
    const savedPhoto = await prisma.photo.create({
      data: {
        data: base64Data,
      },
    });

    res.json({ success: true, photoId: savedPhoto.id });
  } catch (error) {
    console.error('Erro ao fazer o upload da foto:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

app.get('/photo/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await prisma.photo.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!photo) {
      return res.status(404).json({ success: false, error: 'Foto não encontrada' });
    }

    res.json({ success: true, data: photo.data });
  } catch (error) {
    console.error('Erro ao buscar a foto:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
