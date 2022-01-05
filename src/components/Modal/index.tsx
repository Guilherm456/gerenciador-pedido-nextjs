import { Close, Add } from '@mui/icons-material';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
  TextField,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import { UserProps } from '../../utils/interfaces';
import { TextfieldValidator } from '../TextfieldValidator';

interface StateValidator {
  valueDefault: UserProps;
  updateValue: React.Dispatch<React.SetStateAction<UserProps>>;
}

interface ModalUserProps {
  open: boolean;
  changeOpen: () => void;
  districts: string[];
  state: StateValidator;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const ModalUser = ({
  open,
  changeOpen,
  districts,
  state,
}: ModalUserProps) => {
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [reference, setReference] = useState('');
  const [district, setDistrict] = useState('');
  const theme = useTheme();

  const submit = () => {
    if (street === '' || number === '' || district === '') return;
    const newAdress = {
      ...state.valueDefault,
      address: [
        ...state.valueDefault.address,
        { street, number, reference, district },
      ],
    };
    state.updateValue(newAdress);
    setStreet('');
    setNumber('');
    setReference('');
    setDistrict('');

    changeOpen();
  };

  return (
    <Modal open={open} onClose={changeOpen}>
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '100%', md: '65%' },
          height: { xs: '100vh', md: 'auto' },
          bgcolor: 'background.paper',
          border: '2px',
          p: 4,
        }}
      >
        <Box sx={{ mb: 1 }}>
          <IconButton
            style={{
              position: 'absolute',
              right: theme.spacing(1),
              top: theme.spacing(0.5),
            }}
            aria-label='Fechar o modal'
            onClick={changeOpen}
          >
            <Close />
          </IconButton>
        </Box>
        <Typography variant='h3' component='h2'>
          Adicionar endereço
        </Typography>
        <Box py={2} textAlign='center'>
          <Box display='flex' gap={2}>
            <TextfieldValidator
              value={{ valueDefault: street, updateValue: setStreet }}
              label='Rua'
              name='street'
              autoComplete='off'
              checkValidator={{ required: true, minLength: 3, maxLength: 50 }}
              fullWidth
            />
            <TextfieldValidator
              value={{ valueDefault: number, updateValue: setNumber }}
              label='Número'
              name='number'
              autoComplete='off'
              checkValidator={{ required: true, minLength: 1, maxLength: 5 }}
            />
          </Box>
          <Box display='flex' alignItems='center' gap={2}>
            <TextField
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              label='Bairro'
              name='district'
              select
              fullWidth
              margin='normal'
            >
              {districts.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextfieldValidator
              value={{ valueDefault: reference, updateValue: setReference }}
              label='Referência'
              name='reference'
              autoComplete='off'
              checkValidator={{ required: false, maxLength: 50 }}
              fullWidth
            />
          </Box>
        </Box>
        <Box pt={1} width='100%' textAlign='end'>
          <Button variant='text' onClick={changeOpen}>
            Descatar
          </Button>
          <Button
            variant='contained'
            color='primary'
            startIcon={<Add />}
            onClick={submit}
          >
            Adicionar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
