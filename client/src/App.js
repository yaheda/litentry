import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react';
import axios from './modules/axios';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { stringToHex } from "@polkadot/util";

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
      setAccount(allAccounts[0]);
    } catch(error) {
      setError(error.message ?? 'Opps error, please contact your system administrator');
    }

    setLoading(false);
  }

  async function getSignInPayload() {
    const injector = await web3FromSource(account.meta.source);
    const signRaw = injector?.signer?.signRaw;

    if (!!signRaw) {
        const message = `Sign-in request for address ${account.address}`;
        const { signature } = await signRaw({
            address: account.address,
            data: stringToHex(message),
            type: 'bytes'
        });

        return {
          address: account.address,
          message: message,
          signature: signature
        };
    }

    return undefined;
  }

  async function signin() {
    setLoading(true);

    var signInPayload = getSignInPayload();
    if (!signInPayload) {
      setError('Error signing message');
      return;
    }

    try {
      var response = await axios.post('/api/v1/signin', signInPayload, { headers: { Accept: "application/json","Content-Type": "application/json"}});
      setAuthenticated(true);
    } catch (error) {
      setError('Error contacting server')
    }

    setLoading(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>Litentry Fullstack Task</div>
        {account && <h6>Wallet connected with {account.address}</h6>}

        <img src={logo} className="App-logo" alt="logo" />

        {account && <>
          <button 
            className="btn btn-success"
            onClick={e => signin()}>
              Click here to sign-in with Polkadot and reveal secret
          </button>
          {secret && <p>{secret}</p>}
        </>}
        
        {error && <p className='text-danger'>{error}</p>}
        
      </header>
    </div>
  );
}

export default App;
