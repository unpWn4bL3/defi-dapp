import React from 'react';
import './App.css';
import { Merchant } from './pages/merchant';
import { MerchantService } from './services/merchantService';

const SOLDIER_PACKAGE_ID = process.env.REACT_APP_SOLDIER_PACKAGE_ID!;
const merchantService = new MerchantService(SOLDIER_PACKAGE_ID);

function App() {
  const objectID = "0xf306cdc8137f82b42f8ca165526f47d49acbe945104a43a0f2004985a53d5fbc";
  return (
    <Merchant id={objectID} service={merchantService}></Merchant>
  )
}

export default App;
