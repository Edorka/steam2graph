import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BestGames from './BestGames.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Best 100 games in 2 weeks, sorted by studio</h2>
        </div>
	      <BestGames  />
      </div>
    );
  }
}

export default App;
