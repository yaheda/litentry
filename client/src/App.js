import logo from './logo.svg';
import './App.css';
import React, {useEffect} from 'react';
import axios from './modules/axios';

function App() {
  useEffect(() => {
    axios.get('api/hello').then(response => {
      alert(response.data);
    });
    
  });

  async function signin() {
    var data = { ben: 'zona' };
    var response = await axios.post('/api/v1/signin', data, { headers: { Accept: "application/json","Content-Type": "application/json"}});
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          Litentry Fullstack Task
        </div>
        <img src={logo} className="App-logo" alt="logo" />
        <button 
          className="btn btn-success"
          onClick={e => signin()}>
            Click here to sign-in with Polkadot and reveal secret
        </button>
      </header>
    </div>
  );
}

export default App;
