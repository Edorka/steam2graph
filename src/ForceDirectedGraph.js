import React, { Component } from 'react';
import './ForceDirectedGraph.css'
import * as d3 from "d3";
import tip from "d3-tip";

var width = 900, height = 500;
var padding = 2, clusterPadding = 6;

/*
Modified from https://gist.github.com/pbogden/854425acb57b4e5a4fdf4242c068a127
*/
function showProperties(d){
     return "Name: " + d.name + "<br>" +
            "Developer:"+ d.developer + "<br>" +
            "Publisher: "+ d.publisher;
}

class ForceDirectedGraph extends Component {

  constructor(props){
    super(props);
  }
  componentDidMount() {
      width = this.props.width; height = this.props.height;
      this.svg = d3.select(this.element);
      var tool_tip = tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(showProperties);
      this.svg.call(tool_tip);
      var graph = this.graph = this.svg.append('g')
                      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
      var node = this.node = graph.selectAll(".node"),
          size = d3.scaleLinear().range([6, height]);
      this.size = size;
      function moveInsideBoundaries(axis, limit){
          return function ofItem(d){
              return Math.max(d.radius, Math.min(limit - d.radius, d[axis]));
          }
      }
      var insideVertical = moveInsideBoundaries('y', height),
          insideHorizontal = moveInsideBoundaries('x', width);
      function ticked() {
          node.attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
      }
      var value = this.props.valueMethod;
      var nodes = this.props.nodes, clusters = {};
      size.domain([0 , d3.sum(nodes, value)]);
      var color = this.color = d3.scaleSequential(d3.interpolateRainbow)
                      .domain([0, d3.max(nodes, function(d){return d.cluster;})]);
      nodes.map(function(d){
          var c = d.cluster;
          d.radius = size(value(d));
          if ( (clusters[c] === undefined) || (d.radius > clusters[c].radius) ){
              clusters[c] = d;
          }
      });
      function forceCluster(alpha) {
        var k = alpha * 1;
        graph.selectAll(".node").each(function(node){
          var cluster = clusters[node.cluster];
          node.vx -= (node.x - cluster.x) * k;
          node.vy -= (node.y - cluster.y) * k;
        });
      }
      var forceCollide = d3.forceCollide()
          .radius(function(d) {return d.radius + padding;})
          .iterations(1);
      d3.forceSimulation()
          .force("center", d3.forceCenter())
          .force("collide", forceCollide)
          .force("cluster", forceCluster)
          .force("gravity", d3.forceManyBody(30))
          .force("x", d3.forceX().strength(0.7))
          .force("y", d3.forceY().strength(0.7))
          .on("tick", ticked)
          .nodes(this.props.nodes);
      node = node.data(this.props.nodes)
                .enter().append("circle")
                  .attr("class", "node")
                  .attr("r", function(d){ return d.radius;})
                  .attr("fill", function(d){return color(d.cluster); })
                  .attr("cx", function(d) { return d.x ;})
                  .attr("cy", function(d) { return d.y ;})
                  .on('mouseover', tool_tip.show)
                  .on('mouseout', tool_tip.hide);

  }
  componentDidUpdate(prevProps, prevState) {
      var color = this.color;
      var value = prevProps.valueMethod;
      var size = this.size;
      size.domain([0 , d3.sum(prevProps.nodes, value)]);
      this.graph.selectAll(".node").data(prevProps.nodes)
            .attr("fill", function(d){return color(d.cluster); })
            .attr("r", function(d){
                return d.radius = size(value(d));
            })
            .attr("cx", function(d) { return d.x ;})
            .attr("cy", function(d) { return d.y ;});
  }
  componentWillReceiveProps(nextProps) {
    // we should actually clone the nodes and links
    // since we're not supposed to directly mutate
    // props passed in from parent, and d3's force function
    // mutates the nodes and links array directly
    // we're bypassing that here for sake of brevity in example
  }
  render() {
    return (
      <svg width={width} height={height}
        ref={(element) => this.element = element}>
      </svg>
    );
  }
}

export default ForceDirectedGraph;
