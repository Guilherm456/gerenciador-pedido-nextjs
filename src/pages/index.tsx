import Head from 'next/head';
import type { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';

import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../utils/firebase';

const qz = require('qz-tray');

import {
  Grid,
  Autocomplete,
  TextField,
  InputAdornment,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  MenuItem,
} from '@mui/material';
import { Call, DeliveryDining, Person, Store } from '@mui/icons-material';

import { List } from '../components/List';
import { TextfieldValidator } from '../components/TextfieldValidator';
import { ProductsProps, UserProps } from '../utils/interfaces';
import { ModalUser } from '../components/Modal';

interface PageProps {
  products: ProductsProps[];
}

export default function Home({ products }: PageProps) {
  const [cart, setCart] = useState<ProductsProps[]>([]);
  const [valueTotal, setValueTotal] = useState(0.0);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('');
  const [addressUsed, setAddressUsed] = useState(0);

  const [error, setError] = useState(0);

  const [user, setUser] = useState<UserProps>({
    name: '',
    telephone: '',
    genre: '',
    birthday: '',
    address: [],
  });

  const [openModal, setOpenModal] = useState(false);
  let userExists = false;
  let userDB: DocumentData;
  // qz.websocket
  //   .connect()
  //   .then(function () {
  //     alert('Connected!');
  //   })
  //   .catch((err) => console.log(err));

  // qz.printers.find().then((printers: any) => {});

  const checkPhone = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const phoneNew = phone.replace(/[^0-9]/g, '');
      setPhone(phoneNew);

      const docUser = query(
        collection(db, 'users'),
        where('telephone', '==', phoneNew)
      );
      const userData = await getDocs(docUser);

      if (userData.docs.length > 0) {
        if (userData.docs.length > 1) console.log('Maior que 1');
        else defineUser(userData.docs[0]);
      } else {
        setUser({ ...user, telephone: phoneNew });
      }
    }
  };

  const defineName = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setUser({ ...user, name: name });
    }
  };

  const defineUser = async (userDoc: QueryDocumentSnapshot<DocumentData>) => {
    userDB = userDoc;
    const userData = userDoc.data();
    const userAlready: UserProps = {
      name: userData.name,
      telephone: userData.telephone,
      address: userData.address,
      genre: userData.genre,
      birthday: userData.birthday,
    };
    setUser(userAlready);
    userExists = true;
    setName(userAlready.name);
    setDeliveryMode('Entrega');
  };

  const submit = async () => {
    if (error !== 0) return;
    console.log('b');

    if (!userExists) {
      await setDoc(doc(collection(db, 'users')), user);
    } else {
      const userDBToCheck: UserProps = {
        ...userDB.data(),
      };
      if (
        userDBToCheck.name !== user.name ||
        userDBToCheck.telephone !== user.telephone ||
        userDBToCheck.address.length !== user.address.length
      ) {
        // await setDoc(doc(collection(db, 'users'), userDB.id), user);
      }
    }

    setName('');
    setPhone('');
    setDeliveryMode('');
    setAddressUsed(0);
    setCart([]);
    setValueTotal(0.0);
    setAddressUsed(0);
  };

  const checkAddress = () => {
    console.log('a');
    if (user.address.length === 0) setOpenModal(true);
  };

  const addOrRemoveCart = (position: number, add: boolean) => {
    const newCart = [...cart];
    let newValueTotal;
    if (add) {
      newCart[position].quantity = newCart[position].quantity! + 1;
      newValueTotal = valueTotal + newCart[position].price;
    } else {
      newCart[position].quantity = newCart[position].quantity! - 1;
      newValueTotal = valueTotal - newCart[position].price;
      if (newCart[position].quantity! <= 0) {
        newCart[position] = newCart[newCart.length - 1];
        newCart.pop();
      }
    }
    setCart(newCart);
    setValueTotal(newValueTotal);
  };

  const ChooseAddress = () => {
    return (
      <TextField
        value={addressUsed}
        onChange={(event) => {
          const newValue = parseInt(event.target.value);
          if (newValue < user.address.length) setAddressUsed(newValue);
        }}
        label='Endereço'
        select
        size='small'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <DeliveryDining />
            </InputAdornment>
          ),
        }}
        fullWidth
      >
        {user.address.map((address: any, index: number) => (
          <MenuItem key={index} value={index}>
            {address.street}, {address.number}- {address.district}
          </MenuItem>
        ))}
        <MenuItem
          value={user.address.length}
          onClick={() => setOpenModal(true)}
        >
          <b>Adicionar novo endereço</b>
        </MenuItem>
      </TextField>
    );
  };

  return (
    <>
      <Head>
        <title>Montar pedido</title>
      </Head>
      <Grid container height='100vh'>
        <Grid item xs={8} padding={2}>
          <Grid container spacing={2} direction='row' alignItems='center'>
            <Grid item xs>
              <TextfieldValidator
                value={{ valueDefault: phone, updateValue: setPhone }}
                label='Telefone'
                name='phone'
                type='tel'
                autoComplete='off'
                checkValidator={{ required: true, minLength: 10 }}
                errorForm={{ valueDefault: error, updateValue: setError }}
                fullWidth
                icons={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Call />
                    </InputAdornment>
                  ),
                }}
                {...{ onKeyUp: checkPhone, size: 'small' }}
              />
            </Grid>
            <Grid item xs>
              <TextfieldValidator
                value={{ valueDefault: name, updateValue: setName }}
                label='Nome'
                name='name'
                autoComplete='off'
                checkValidator={{ required: true, minLength: 3 }}
                errorForm={{ valueDefault: error, updateValue: setError }}
                fullWidth
                icons={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Person />
                    </InputAdornment>
                  ),
                }}
                {...{
                  size: 'small',
                  disabled: user.telephone === '',
                  onKeyDown: defineName,
                }}
              />
            </Grid>
            <Grid item>
              <ToggleButtonGroup
                size='small'
                color='primary'
                value={deliveryMode}
                onChange={(event, newDeliveryMode) => {
                  setDeliveryMode(newDeliveryMode);
                  if (newDeliveryMode === 'Entrega') checkAddress();
                }}
                disabled={user.telephone === ''}
                exclusive
              >
                <ToggleButton value='Entrega'>
                  <DeliveryDining />
                </ToggleButton>
                <ToggleButton value='Retirada'>
                  <Store />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid container pl={2}>
              <Grid item xs>
                {deliveryMode === 'Entrega' && user.address.length !== 0 ? (
                  <ChooseAddress />
                ) : (
                  <Box
                    width='100%'
                    sx={{ bgcolor: 'grey.300', borderRadius: 1, minHeight: 40 }}
                  ></Box>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid container mt={2} spacing={3} direction='column'>
            <Grid item xs>
              <Autocomplete
                id='products'
                size='small'
                fullWidth
                options={products}
                getOptionLabel={(option) => option.name}
                clearOnEscape
                freeSolo
                onChange={(event, newValue) => {
                  if (newValue !== null && typeof newValue !== 'string') {
                    const findRepeat = cart.findIndex(
                      (product) => product.name === newValue.name
                    );
                    if (findRepeat === -1) {
                      setCart([...cart, { ...newValue, quantity: 1 }]);
                      setValueTotal(valueTotal + newValue.price);
                    } else addOrRemoveCart(findRepeat, true);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label='Produtos' variant='outlined' />
                )}
              />
            </Grid>
            <Grid item xs>
              <Paper variant='outlined'></Paper>
            </Grid>
          </Grid>
        </Grid>
        <List
          deliveryMode={deliveryMode}
          user={user}
          valueTotal={valueTotal}
          cart={cart}
          addressUsed={addressUsed}
          addOrRemoveProduct={addOrRemoveCart}
          submit={submit}
        />
      </Grid>
      <ModalUser
        open={openModal}
        changeOpen={() => setOpenModal(!openModal)}
        districts={[
          'Vila Gaúcha',
          'Boa Vista',
          'Centro',
          'Alvorada',
          'Higienópolis',
          'São Francisco',
        ]}
        state={{ valueDefault: user, updateValue: setUser }}
      />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // const docUser = await getDocs(collection(db, 'products'));
  // const products = docUser.docs.map((doc: DocumentData) => doc.data());
  const products = [
    { name: 'P', price: 13 },
    { name: 'M', price: 15 },
    { name: 'G', price: 18 },
  ];
  return {
    props: { products },
    revalidate: 60 * 60 * 24,
  };
};
