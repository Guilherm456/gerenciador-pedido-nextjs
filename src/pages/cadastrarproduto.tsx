import { useState } from 'react';
import Head from 'next/head';

import { Button, Typography } from '@mui/material';
import {} from '@mui/icons-material';

import { db } from '../utils/firebase';
import { addDoc, collection } from 'firebase/firestore';

import { TextfieldValidator } from '../components/TextfieldValidator';
import { Box } from '@mui/system';

export default function CadastrarProduto() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const [error, setError] = useState(0);
  const submit = async () => {
    const priceNumber = parseFloat(price);
    if (name === '' || priceNumber <= 0) return;
    await addDoc(collection(db, 'products'), {
      name: name,
      description: description,
      price: priceNumber,
    });

    setName('');
    setDescription('');
    setPrice('');
  };

  return (
    <>
      <Head>
        <title>Cadastrar produto</title>
      </Head>
      <Box padding={5}>
        <Typography variant='h2'>Cadastrar produto</Typography>

        <Box gap={2} display='flex'>
          <TextfieldValidator
            value={{ valueDefault: name, updateValue: setName }}
            errorForm={{ valueDefault: error, updateValue: setError }}
            label='Nome do produto'
            name='name'
            checkValidator={{ required: true, minLength: 5, maxLength: 50 }}
          />
          <TextfieldValidator
            value={{ valueDefault: description, updateValue: setDescription }}
            label='Descrição'
            name='description'
          />
          <TextfieldValidator
            value={{ valueDefault: price, updateValue: setPrice }}
            errorForm={{ valueDefault: error, updateValue: setError }}
            label='Preço'
            name='price'
            checkValidator={{ required: true }}
            type='number'
          />
        </Box>
        <Button variant='contained' onClick={submit}>
          Cadastrar
        </Button>
      </Box>
    </>
  );
}
