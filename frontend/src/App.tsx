import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MerchantCard } from './pages/merchant';

function App() {

  const merchantData = {
    id: "123",
    name: "Merchant Name",
    power: 5,
  };

  return (
    <MerchantCard merchant={merchantData}></MerchantCard>
  )
}

export default App;
