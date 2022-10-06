import '../App.css';
import React from 'react';
import { styled, Paper, Grid, Button, Typography } from '@mui/material';

function ResultCard({inputData, cheaperData, fasterData}) {

    const Item = styled(Paper)(({ theme }) => ({
      backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    }));

    return (
      <div>
      <Grid container spacing={2}>
        <Grid item xs={12} className='ResultData'>
        <Item><br />
          <Typography variant="h5" component="div">Dados do pedido: </Typography><br />
          Altura: {inputData.height} <br />
          Largura: {inputData.width} <br />
          Comprimento: {inputData.length} <br />
          Endereço de Coleta: {inputData.collection_address} <br />
          Endereço de Entrega: {inputData.delivery_address} <br /><br />
        </Item>
        </Grid>
        <Grid item xs={6} className="Result">
        <Item><br />
          Operador Logistíco Mais Rápido <br />
          <Typography variant="h5" component="div">{fasterData.operator} </Typography><br />
          Preço: {fasterData.price} <br />
          Tempo de Entrega: {fasterData.time} <br /><br />
          <Button size="small" variant="contained" color="primary">Escolher o mais Rápido</Button><br /><br />
        </Item>
        </Grid>
        <Grid item xs={6} className="Result">
        <Item><br />
          Operador Logistíco Mais Barato <br />
          <Typography variant="h5" component="div">{cheaperData.operator} </Typography><br />
          Preço: {cheaperData.price} <br />
          Tempo de Entrega: {cheaperData.time} <br /><br />
          <Button size="small" variant="contained" color="primary">Escolher o mais Barato</Button><br /><br />
        </Item>
        </Grid>
      </Grid>
      </div>
    );
}

export default ResultCard;
