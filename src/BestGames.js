import React, { Component } from 'react';
import './BestGames.css';
import ForceDirectedGraph from './ForceDirectedGraph.js'
import bestGamesObject from './best100games.json';
import SwitchNext from './SwitchNext.js'
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
        var clusterNumber = clusterNames.indexOf(field);
        if (clusterNumber === -1){
            clusterNames.push(field);
            clusterNumber = clusterNames.length;
        }
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
var possibleValues = [
    {label: 'Owners', field: 'owners'},
    {label: 'Players last 2 weeks', field: 'players_2weeks'},
    {label: 'Players Forever', field: 'players_forever'}
];
var possibleGroups = [
    {label: 'Developer', field: 'developer'},
    {label: 'Publisher', field: 'publisher'}
];
class BestGames extends Component {

    constructor(props){
        super(props);
        var games = keyAsId(bestGamesObject);
        console.log('game', games[1]);
        var clusters = clustersOf(games, 'developer');
        this.state = {
            dimensions: {width: 900, height: 500},
            fields: [],
            groupBy: possibleGroups[0],
            valueBy: possibleValues[0],
            valueMethod: fieldFrom(possibleValues[0].field),
            games: games,
            clusters: clusters
        };
        this.changedValue = this.changedValue.bind(this);
        this.changeGrouping = this.changeGrouping.bind(this);
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

    }
    shouldComponentUpdate(nextProps, nextState){
        var props = nextProps;
        var state = nextState;
        if (state.valueBy){
            nextState.valueMethod = fieldFrom(state.valueBy.field);
        }
        if (state.groupBy){
            var games = state.games;
            state.clusters = clustersOf(games, state.groupBy.field);
            state.games = games;
        }
        return true;
    }
    changedValue(option){
        this.setState({valueBy: option});
    }
    changeGrouping(option){
        this.setState({groupBy: option});
    }

    render() {
      return(
      <div className="fill-layout"
        ref={node => this.node = node}>
        <div className="layout-row padding">
          Size by
          <SwitchNext
            choices={possibleValues}
            onSelection={this.changedValue}>
          </SwitchNext>
          Group by
          <SwitchNext
            choices={possibleGroups}
            onSelection={this.changeGrouping}>
          </SwitchNext>
        </div>
        <ForceDirectedGraph
          height={this.state.dimensions.height}
          width={this.state.dimensions.width}
          valueMethod={this.state.valueMethod}
          nodes={this.state.games}
          valueUnit={"Users"} />
      </div>);
   }
}
export default BestGames
