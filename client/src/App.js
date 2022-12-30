import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState, useContext, useCallback} from 'react';
import axios from './modules/axios';
import { web3Accounts, web3Enable, web3FromSource, web3AccountsSubscribe } from '@polkadot/extension-dapp';
import { stringToHex } from "@polkadot/util";
import { UserContext } from "./UserContext"

function App() {

  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [account, setAccount] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const [secret, setSecret] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [token, setToken] = useState(undefined);

  const [userContext, setUserContext] = useContext(UserContext);

  const verifyUser = useCallback(() => {
    
    axios('/api/v1/refreshToken', {
      method: 'POST',
      withCredentials: true,
      headers: { "Content-Type": "application/json" }
    }).then((response) => {
      setToken(response.data.token);
      setTimeout(verifyUser, 5 * 60 * 1000);
    }).catch((response) => {
      setToken(undefined);
      //setError('Error refreshing token')
    })
  }, [setToken]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false); //this helps

  useEffect(() => {
    const init = async () => {
      //await initPolkadot();
    };
    init();
  }, []);

  useEffect(() => {
    verifyUser()
  }, [verifyUser]);

  useEffect(() => {
    const init = async () => {
      if (!account && !authenticated) return;
      await signin();
    }
    init();
  }, [account])

  useEffect(() => {
    const init = async () => {
      if (!token) return;
      await getSecret();
    }
    init();
  }, [token])

  async function initPolkadot() {
    setLoading(true);

    try {
      const extensions = await web3Enable('lit dapp');
      const allAccounts = await web3Accounts();
      debugger;
      if (extensions.length === 0) {
        setError('no extension installed, or the user did not accept the authorization')
        return;
      }
      setAccount(allAccounts[0]);
      setAddress(allAccounts[0].address);
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

    var signInPayload = await getSignInPayload();
    if (!signInPayload) {
      setError('Error signing message');
      return;
    }

    try {
      var response = await axios.post('/api/v1/signin', signInPayload, { 
        withCredentials: true,
        headers: { Accept: "application/json","Content-Type": "application/json"}});
      setToken(response.data.token);
      setAuthenticated(true);
    } catch (error) {
      setError('Error Signing in - please contact your admin')
    }

    setLoading(false);
  }

  async function getSecret() {
    setLoading(true);

    try {
      var response = await axios.get('/api/v1/secret', { 
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }}
      );
      setSecret(response.data.secret);

      //updateAccount();

    } catch (error) {
      setError('Error fetching secret - please contact your admin')
    }

    setLoading(false);
  }

  async function signout() {
    setLoading(true);

    try {
      var response = await axios('/api/v1/signout', { 
        method: 'POST',
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }}
      );
      setSecret(undefined);
      setToken(undefined);
      window.localStorage.setItem("LIT_LOGOUT", Date.now())

    } catch (error) {
      setError('Error logging out - please contact your admin')
    }

    setLoading(false);
  }

  const syncLogout = useCallback(event => {
    if (event.key === "LIT_LOGOUT") {
      window.location.reload()
    }
  }, [])

  useEffect(() => {
    window.addEventListener("storage", syncLogout)
    return () => {
      window.removeEventListener("storage", syncLogout)
    }
  }, [syncLogout])

  async function updateAccount() {
    const extensions = await web3Enable('lit dapp');
    const allAccounts = await web3Accounts();
    if (extensions.length === 0) {
      setError('no extension installed, or the user did not accept the authorization')
      return;
    }
    setAddress(allAccounts);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>Litentry Fullstack Task</div>
        {account && <h6>Wallet connected with {account.address}</h6>}

        <img src={logo} className="App-logo" alt="logo" />

        {account && <>
          
        </>}

        {!token ? (<>
            <button 
              className="btn btn-success"
              onClick={e => initPolkadot()}>
                Click here to sign-in with Polkadot and reveal secret
            </button>
          </>) : (<>
            secret message: <br /><p>{secret}</p>
            <button 
              className="btn btn-success"
              onClick={e => signout()}>
                Logout
            </button>
          </>)}
        
        {error && <p className='text-danger'>{error}</p>}
        
      </header>
    </div>
  );
}

export default App;
