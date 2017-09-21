import React, { Component } from 'react';
import './BestGames.css';
import bestGames from './best100games.json';
import TreeMap from "react-d3-treemap";
// Include its styles in you build process as well
import "react-d3-treemap/dist/react.d3.treemap.css";

function keyAsId(source){
    return Object.keys(source).map(function(key){source.id = key; return source;});
}

class BestGames extends Component {

    constructor(props){
        super(props)
        this.dimensions = {
        };

        this.state = {
          dimensions: this.dimensions,
          data: bestGames
        }
        this.createBestGames = this.createBestGames.bind(this)
    }
    componentDidMount() {
        this.setState(function(previous, props){
          return {
            data: previous.data,
            dimensions: {
              height: this.node.clientHeight,
              width: this.node.clientWidth
            }
          };
        });
        console.log(this.dimensions);
        this.createBestGames();

    }
    componentDidUpdate() {
        this.createBestGames();
    }
    createBestGames() {
	console.log(keyAsId(bestGames));
        this.state.data = bestGames;
        return;
    }
    render() {
      return <div className="fill-layout"
      ref={node => this.node = node}>
      <TreeMap
      height={this.state.dimensions.height}
      width={this.state.dimensions.width}
      data={this.state.data}
      valueUnit={"Users"} />
      </div>
   }
}
export default BestGames
