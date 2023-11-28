// src/App.js
"use client"
import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedPhotoId, setUploadedPhotoId] = useState(null);
  const [downloadedPhotoData, setDownloadedPhotoData] = useState(null);
  const [nameUser, setNameUser] = useState('')
  const [fileName, setFileName] = useState('')
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('pdfFile', selectedFile);  // Renomeie para 'pdfFile'
    formData.append('nameUser', nameUser);
    formData.append('fileName', fileName);
    try {
      const response = await axios.post('http://localhost:3004/upload', formData, {

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
      const response = await axios.get(`http://localhost:3004/photo/${uploadedPhotoId}`);
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
      <input type='text' className='mb-4 p-2 border-none rounded text-black' value={nameUser} onChange={(e) => setNameUser(e.target.value)} />
      <input type='text' className='mb-4 p-2 rounded border-none text-black' value={fileName} onChange={(e) => setFileName(e.target.value)} />
      <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded">
        Upload
      </button>
      <button onClick={handleDownload} className="bg-green-500 text-white p-2 rounded">
        Baixar Foto
      </button>

    </div>
  );
}

