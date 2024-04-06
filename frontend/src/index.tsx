import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Callback } from './components/callback';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
root.render(
  <Router>
    <Routes>
      <Route path='/app' element={<App />} />
      <Route path='/' element={<Callback />} />
    </Routes>
  </Router>
)