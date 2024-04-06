import React, { useEffect } from 'react';
import './App.css';
import { MerchantService } from './services/merchantService';
import { AuthService } from './services/authService';
import { LoginButton } from './components/loginButton';
import { MerchantListContainer } from './containers/merchantListContainer';
import { LogoutButton } from './components/logoutButton';
import { MarketService } from './services/marketService';

const SOLDIER_PACKAGE_ID = process.env.REACT_APP_SOLDIER_PACKAGE_ID!;
const MARKET_PACKAGE_ID = process.env.REACT_APP_MARKET_PACKAGE_ID!;

const merchantService = new MerchantService(SOLDIER_PACKAGE_ID);
const authService = new AuthService();
const marketService = new MarketService(MARKET_PACKAGE_ID);

function App() {
  useEffect(() => {
    const f = async () => {
      // await marketService.get_listings(process.env.REACT_APP_MARKET_ID!)
      console.log(AuthService.walletAddress());
    }
    f();
  }, [])
  return (
    <div className='bg-rose-100 h-screen w-screen' >
      <header className="bg-blue-600 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className='grid'>
            <h1 className="text-white text-lg font-semibold">Your address:</h1>
            {/* remove following in production */}
            <p className='text-white'>{AuthService.isAuthenticated() ? AuthService.walletAddress() : ""}</p>
          </div>

          <nav>
            <LoginButton onClick={() => authService.login()}></LoginButton>
            <LogoutButton onClick={() => {
              sessionStorage.removeItem("jwt_data");
              sessionStorage.removeItem("sui_jwt_token");
              window.location.reload();
            }} />
          </nav>
        </div>
      </header>
      <MerchantListContainer merchantService={merchantService} />
    </div>
  )
}

export default App;
