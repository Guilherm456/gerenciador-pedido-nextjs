import { useState } from 'react';
import Head from 'next/head';

import { Button, Typography } from '@mui/material';
import {} from '@mui/icons-material';

import { db } from '../utils/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';

import { TextfieldValidator } from '../components/TextfieldValidator';
import { Box } from '@mui/system';

interface NeighborhoodsProps {
  name: string;
  taxe: number;
}

interface PageProps {
  neighborhoods: NeighborhoodsProps[];
}

export default function EditorInfos({ neighborhoods }: PageProps) {
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
        <title>Editar informações</title>
      </Head>
      <Box padding={5}>
        <Typography variant='h2'>Editar informações</Typography>

        <Button variant='contained' onClick={submit}>
          Cadastrar
        </Button>
      </Box>
    </>
  );
}

export const getServerSideProps = async () => {
  const neightborhoodsData = await getDocs(
    collection(collection(db, 'informations'), 'neightborhoods')
  );
  if (neightborhoodsData.docs.length === 0)
    return {
      props: { neightborhoods: [] },
    };
  const neightborhoods = neightborhoodsData.docs.map((doc) => doc.data());

  return {
    props: { neightborhoods },
  };
};
