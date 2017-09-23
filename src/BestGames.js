import React, { Component } from 'react';
import './BestGames.css';
import ForceDirectedGraph from './ForceDirectedGraph.js'
import bestGamesObject from './best100games.json';
// Include its styles in you build process as well

function keyAsId(source){
    return Object.keys(source).map(function(key){
        source[key].id = parseInt(key, 10);
        return source[key];
    });
}
function fieldFrom(fieldName){
    return function(item){return item[fieldName];};
}
function linksForAllNodes(nodes){
    var result = [];
    for (var index=0; index<nodes.length; index++){
        for (var pending=index + 1; pending<nodes.length; pending++){
            var one = nodes[index], another = nodes[pending];
            result.push({source: one.id, target: another.id});
        }
    }
    return result;
}
function createLinksFor(nodes, fieldName){
    var result = [];
    var nodesByField = {};
    var getKey = fieldFrom(fieldName);
    nodes.map(function(node){
        var field = getKey(node);
        var fieldNodes = nodesByField[field] || [];
        fieldNodes.push(node);
        nodesByField[field] = fieldNodes;
    });
    Object.keys(nodesByField).map(function(field){
        var fieldLinks = linksForAllNodes(nodesByField[field]);
        result = result.concat(fieldLinks);
    });
    return result;
}


class BestGames extends Component {

    constructor(props){
        super(props)
        var games = keyAsId(bestGamesObject);
        var connections = createLinksFor(games, 'developer');
        console.log('connections', connections);
        this.state = {
          dimensions: {width: 900, height: 500},
          fields: [],
          sizeFrom: fieldFrom('players_2weeks'),
          games: games,
          connections: connections
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
          valueMethod={this.state.sizeFrom}
          nodes={this.state.games}
          links={this.state.connections}
          valueUnit={"Users"} />
      </div>
   }
}
export default BestGames
