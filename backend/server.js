const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const prisma = new PrismaClient();
const app = express();
const port = 3004;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', async (req, res) => {
  try {
    const photos = await prisma.photo.findMany();
    console.table(photos);
    return res.status(200).json({ success: true, data: photos });
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
    return res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
});

app.post('/upload', upload.single('pdfFile'), async (req, res) => {
  const { nameUser, fileName } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Nenhum arquivo enviado' });
    }

    const base64Data = req.file.buffer.toString('base64');
    const savedPhoto = await prisma.photo.create({
      data: {
        data: base64Data,
        nameUser: nameUser,
        NomeFile: fileName,
      },
    });
    const file = await prisma.photo.findMany()
    console.table(file[0].nameUser)
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
