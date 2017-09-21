import React, { Component } from 'react';
import './BestGames.css';
import ForceDirectedGraph from './ForceDirectedGraph.js'
import bestGamesObject from './best100games.json';
// Include its styles in you build process as well

function keyAsId(source){
    return Object.keys(source).map(function(key){
        source[key].id = key;
        return source[key];
    });
}
function fieldFrom(fieldName){
    return function(item){return item[fieldName];};
}

class BestGames extends Component {

    constructor(props){
        super(props)
        this.state = {
          dimensions: {width: 900, height: 500},
          fields: [],
          sizeFrom: fieldFrom('players_2weeks'),
          games: keyAsId(bestGamesObject)
        };
        this.createBestGames = this.createBestGames.bind(this)
    }
    componentDidMount() {
        this.setState(function(previous, props){
          return {
            dimensions: {
              height: this.node.clientHeight,
              width: this.node.clientWidth
            }
          };
        });
        this.createBestGames();

    }
    componentDidUpdate() {
        this.createBestGames();
    }
    createBestGames() {
        return;
    }
    render() {
      return <div className="fill-layout"
      ref={node => this.node = node}>
          <ForceDirectedGraph
          height={this.state.dimensions.height}
          width={this.state.dimensions.width}
          data={this.state.data}
          valueUnit={"Users"} />
      </div>
   }
}
export default BestGames
