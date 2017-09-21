import React, { Component } from 'react';
import logo from './logo.svg';
import * as d3 from "d3";

class ForceDirectedGraph extends Component {

  constructor(props){
    console.log(d3);
    super(props);
  }
  render() {
    return (
          <h2>Best 100 games in 2 weeks, sorted by studio</h2>
    );
  }
}

export default ForceDirectedGraph;
