import React from 'react';
import './App.css';
import { MerchantCard } from './pages/merchant';
import { TestMerchantService } from './services/merchantService';

function App() {

  const merchantData = {
    id: "123",
    name: "but_who_ami?",
    power: 5,
  };

  TestMerchantService();

  return (
    <MerchantCard merchant={merchantData}></MerchantCard>
  )
}

export default App;
