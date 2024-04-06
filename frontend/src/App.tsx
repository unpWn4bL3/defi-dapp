import React from 'react';
import './App.css';
import { MerchantService } from './services/merchantService';
import { AuthService } from './services/authService';
import { LoginButton } from './components/loginButton';
import { MerchantListContainer } from './containers/merchantListContainer';

const SOLDIER_PACKAGE_ID = process.env.REACT_APP_SOLDIER_PACKAGE_ID!;
const merchantService = new MerchantService(SOLDIER_PACKAGE_ID);
const authService = new AuthService();

function App() {
  const objectID = "0xf306cdc8137f82b42f8ca165526f47d49acbe945104a43a0f2004985a53d5fbc";
  // console.log(AuthService.walletAddress());
  return (
    <div className='bg-rose-100 h-screen w-screen' >
      <header className="bg-blue-600 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-lg font-semibold">My Website</h1>
          <nav>
            <LoginButton onClick={() => authService.login()}></LoginButton>
          </nav>
        </div>
      </header>
      <MerchantListContainer merchantService={merchantService} />
    </div>
  )
}

export default App;
