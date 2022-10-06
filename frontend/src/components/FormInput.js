import React from 'react';
import { Button, TextField } from '@mui/material';

function FormInput({handleInput, formInputData, handleSubmit}){
  return(
    <form>
      <label>Altura</label>
      <TextField type="number" value={formInputData.name} onChange={handleInput} name="height" variant="standard" required={true} />
      <label>Largura</label>
      <TextField type="number" value={formInputData.name} onChange={handleInput} name="width" variant="standard" required={true} />
      <label>Comprimento</label>
      <TextField type="number" value={formInputData.name} onChange={handleInput} name="length" variant="standard" required={true} /> 
      <label>Endereço de Coleta</label>
      <TextField type="text" value={formInputData.name} onChange={handleInput} name="collection_address" variant="standard" required={true} />
      <label>Endereço de Entrega</label>
      <TextField type="text" value={formInputData.name} onChange={handleInput} name="delivery_address" variant="standard"  required={true} />
      <br />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
    </form>
    )
}

export default FormInput;