import { Remove, Add } from '@mui/icons-material';
import {
  Grid,
  Typography,
  Box,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import { ProductsProps, UserProps } from '../../utils/interfaces';

interface ListProps {
  user: UserProps;
  deliveryMode: string;
  addressUsed: number;
  cart: ProductsProps[];
  valueTotal: number;
  addOrRemoveProduct: (position: number, add: boolean) => void;
  submit: () => void;
}

export const List = ({
  user,
  deliveryMode,
  addressUsed,
  cart,
  valueTotal,
  addOrRemoveProduct,
  submit,
}: ListProps) => {
  const format = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <Grid item xs={4} bgcolor='InfoBackground'>
      <Grid container padding={2} spacing={3} direction='column'>
        <Grid item xs>
          <Typography variant='h3' textAlign='center'>
            Pedido
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography>{user.name}</Typography>
          <Typography>{user.telephone}</Typography>
          <Typography>{deliveryMode}</Typography>
          <Typography>
            <b>
              {deliveryMode === 'Entrega' && user.address[addressUsed]
                ? `${user.address[addressUsed].street} - ${user.address[addressUsed].number}, ${user.address[addressUsed].district}`
                : null}
            </b>
          </Typography>
        </Grid>

        <Grid item xs>
          <Box display='flex' justifyContent='space-between'>
            <Typography>Quantidade</Typography>
            <Typography>Produto</Typography>

            <Typography>Valor unitário</Typography>
            <Typography>Valor</Typography>
          </Box>
          <Divider />
          <Box>
            {cart.map((product, index) => (
              <Box mb={1} key={index}>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box display='flex' alignItems='center'>
                    <IconButton
                      onClick={() => addOrRemoveProduct(index, false)}
                      size='small'
                    >
                      <Remove />
                    </IconButton>

                    <Typography variant='body1'>{product.quantity}</Typography>

                    <IconButton
                      onClick={() => addOrRemoveProduct(index, true)}
                      size='small'
                    >
                      <Add />
                    </IconButton>
                  </Box>
                  <Typography>{product.name}</Typography>
                  <Typography>{format.format(product.price)}</Typography>
                  <Typography>
                    {format.format(product.price * product.quantity!)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs>
          <Typography variant='subtitle1'>
            {deliveryMode === 'Entrega'
              ? `Taxa de entrega:  ${format.format(2)}`
              : null}
          </Typography>
          <Typography variant='h6'>
            <b>
              Total:{' '}
              {deliveryMode === 'Entrega'
                ? format.format(valueTotal + 2)
                : format.format(valueTotal)}
            </b>
          </Typography>
          <Button
            variant='contained'
            fullWidth
            disabled={
              cart.length === 0 ||
              deliveryMode === '' ||
              user.name === '' ||
              user.telephone === ''
            }
            onClick={submit}
          >
            Confirmar pedido
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
