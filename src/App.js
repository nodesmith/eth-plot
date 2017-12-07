import React, { Component } from 'react';
import './App.css';

import { Grid } from './components/Grid';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">eth grid</h1>
        </header>
        <p className="App-intro">
          Welcome to the eth-grid (or some other cooler name we come up with).
        </p>
        <Grid height={10} width={10}/>
      </div>
    );
  }
}

export default App;
