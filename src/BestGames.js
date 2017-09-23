import React, { Component } from 'react';
import './BestGames.css';
import ForceDirectedGraph from './ForceDirectedGraph.js'
import bestGamesObject from './best100games.json';
// Include its styles in you build process as well

function keyAsId(source){
    return Object.keys(source).map(function(key){
        source[key].id = source[key].appid;
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
function clustersOf(nodes, fieldName){
    var nodesByField = {};
    var getKey = fieldFrom(fieldName);
    var clusterNames = [];
    nodes.map(function(node){
        var field = getKey(node);
        var fieldNodes = nodesByField[field] || [];
        console.log('field', field);
        var clusterNumber = clusterNames.indexOf(field);
        if (clusterNumber === -1){
            clusterNames.push(field);
            clusterNumber = clusterNames.length;
        }
        console.log(clusterNumber, field);
        node.cluster = clusterNumber;
        fieldNodes.push(node);
        nodesByField[field] = fieldNodes;
    });
    return nodesByField;
}
function createLinksFor(nodes, fieldName){
    var result = [];
    var nodesByField = clustersOf(nodes, fieldName);
    Object.keys(nodesByField).map(function(field){
        var fieldLinks = linksForAllNodes(nodesByField[field]);
        result = result.concat(fieldLinks);
    });
    return result;
}


class BestGames extends Component {

    constructor(props){
        super(props);
        var games = keyAsId(bestGamesObject);
        var clusters = clustersOf(games, 'developer');
        var connections = createLinksFor(games, 'developer');
        this.state = {
          dimensions: {width: 900, height: 500},
          fields: [],
          valueMethod: fieldFrom('players_2weeks'),
          games: games,
          clusters: clusters
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
          valueMethod={this.state.valueMethod}
          nodes={this.state.games}
          valueUnit={"Users"} />
      </div>
   }
}
export default BestGames
