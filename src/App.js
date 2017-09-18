import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BarChart from './BarChart.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
	
	<BarChart source={'http://api.nobelprize.org/v1/prize.json'} size={[500,500]} />
      </div>
    );
  }
}

export default App;
