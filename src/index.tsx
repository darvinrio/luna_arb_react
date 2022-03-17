import React from 'react';
import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider';

import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <WalletProvider {...chainOptions}>
      <App />
    </WalletProvider>,
    document.getElementById('root'),
  );
});

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

