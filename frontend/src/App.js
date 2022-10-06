import './App.css';
import axios from 'axios';
import React,{ useState } from 'react';
import FormInput from "./components/FormInput";
import ResultCard from "./components/ResultCard";
import { Button, Typography } from '@mui/material';

function App() {
  const [body, setBody] = useState({
    height: null,
    width: null,
    length: null,
    collection_address: '',
    delivery_address: ''
  });

  const [faster, setFaster] = useState({operator: '', price: '', time: ''});
  const [cheaper, setCheaper] = useState({operator: '', price: '', time: ''});
  const [loading, setLoading] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    if(
      
      body.height != null && 
      body.width != null &&
      body.length != null &&
      body.collection_address.trim() !== '' &&
      body.delivery_address.trim() !== ''
     ){
    console.log(body);
    axios.post('/full', { 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body 
    })
    .then(function (response) {
      let fasterData = response.data.faster;
      setFaster({operator:fasterData.operator, price:fasterData.price, time:fasterData.time})
      let cheaperData = response.data.cheaper;
      setCheaper({operator:cheaperData.operator, price:cheaperData.price, time:cheaperData.time})
      setLoading(false)
    })
    .catch(function (error) {
      console.log(error);
    })
  }
  else{
    console.log('fill')
    alert("Preencha todos os campos!");
  }
  }

  const handleInput = (event) => {
    const { name, value } = event.target;
    setBody({ ...body, [name]: value });
  };

  const handleClick = () => {
    setLoading(true)
    console.log(loading)
  };

  return (
    <div className="External">
    <div className="App">
      <Typography textAlign='center' variant="h3" component="div">Simulador de Frete</Typography><br />
      <div className="Form">
      {!loading ? <h1> </h1> : <FormInput handleInput={handleInput} formInputData={body} handleSubmit={handleSubmit}/>}
      {loading ? <h1> </h1> : <ResultCard inputData={body} cheaperData={cheaper} fasterData={faster} />}
      <br /><br />
      </div>
      <div className="Result">
      {loading ? <h1> </h1> : <Button className="Result" variant="contained" name="back" onClick={handleClick}> Voltar </Button>}
      </div>
    </div>
    </div>
  );
}

export default App;
