// src/App.js
"use client"
import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedPhotoId, setUploadedPhotoId] = useState(null);
  const [downloadedPhotoData, setDownloadedPhotoData] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedPhotoId(response.data.photoId);
      console.log(selectedFile)
      console.log(formData)
      alert('Upload bem-sucedido!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/photo/${uploadedPhotoId}`);
      console.table(response.data.data)
      setDownloadedPhotoData(response.data.data);
    } catch (error) {
      console.error('Erro ao baixar a foto:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center gap-4 place-content-center h-screen">
    <input
      type="file"
      onChange={handleFileChange}
      className="mb-4 p-2 border rounded"
    />
    <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded">
      Upload
    </button>
    <button onClick={handleDownload} className="bg-green-500 text-white p-2 rounded">
      Baixar Foto
    </button>

    {downloadedPhotoData && (
      <div className="mt-4">
        <h2 className="text-lg font-bold">Foto Baixada</h2>
        <img
          height={500}
          width={500}
          src={`data:image/jpeg;base64,${downloadedPhotoData}`}
          alt="Imagem Baixada"
          className="mt-2 rounded"
        />
      </div>
    )}
  </div>
  );
}

