import React, { Component } from 'react';
import './ForceDirectedGraph.css'
import * as d3 from "d3";
import tip from "d3-tip";

var width = 900, height = 500;
var padding = 2, clusterPadding = 6;

/*
Modified from https://gist.github.com/pbogden/854425acb57b4e5a4fdf4242c068a127
*/
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
        .html(function(d) { return "Name: " + d.name + "<br>Developer"+ d.developer; });
      this.svg.call(tool_tip);
      var graph = this.svg.append('g')
                      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
      var node = graph.selectAll(".node"),
          size = d3.scaleLinear().range([6, height]);
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
      var color = d3.scaleSequential(d3.interpolateRainbow)
                      .domain([0, d3.max(nodes, function(d){return d.cluster;})]);
      nodes.map(function(d){
          var c = d.cluster;
          d.radius = size(value(d));
          d.color = color(c);
          if ( (clusters[c] === undefined) || (d.radius > clusters[c].radius) ){
              clusters[c] = d;
          }
      });
      function forceCluster(alpha) {
        for (var i = 0, n = nodes.length, node, cluster, k = alpha * 1; i < n; ++i) {
          node = nodes[i];
          cluster = clusters[node.cluster];
          node.vx -= (node.x - cluster.x) * k;
          node.vy -= (node.y - cluster.y) * k;
        }
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
                  .attr("fill", function(d){return d.color; })
                  .attr("cx", function(d) { return d.x ;})
                  .attr("cy", function(d) { return d.y ;})
                  .on('mouseover', tool_tip.show)
                  .on('mouseout', tool_tip.hide);

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
