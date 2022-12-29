import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react';
import axios from './modules/axios';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';

function App() {

  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [account, setAccount] = useState(undefined);
  const [secret, setSecret] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    const init = () => {
      initPolkadot();
    };
    init();
  }, []);

  async function initPolkadot() {
    setLoading(true);

    try {
      const extensions = await web3Enable('LitentryTask');
      const allAccounts = await web3Accounts();
      if (extensions.length === 0) {
        setError('no extension installed, or the user did not accept the authorization')
        return;
      }
      debugger;
      setAccount(allAccounts[0].address);
    } catch(error) {
      setError(error.message ?? 'Opps error, please contact your system administrator');
    }

    setLoading(false);
  }

  async function signin() {
    var data = { ben: 'zona' };
    var response = await axios.post('/api/v1/signin', data, { headers: { Accept: "application/json","Content-Type": "application/json"}});
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>Litentry Fullstack Task</div>
        {account && <div>Wallet connected with {account}</div>}

        <img src={logo} className="App-logo" alt="logo" />
        <button 
          className="btn btn-success"
          onClick={e => signin()}>
            Click here to sign-in with Polkadot and reveal secret
        </button>
        {error && <p className='text-danger'>{error}</p>}
        {secret && <p>{secret}</p>}
      </header>
    </div>
  );
}

export default App;
