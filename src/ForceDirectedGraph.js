import React, { Component } from 'react';
import logo from './logo.svg';
import * as d3 from "d3";



var width = 900, height = 500;

class ForceDirectedGraph extends Component {

  constructor(props){
    super(props);
  }
  componentWillMount() {

  }
  componentDidMount() {
      width = this.props.width; height = this.props.height;
      this.svg = d3.select(this.element);
      var node = this.svg.selectAll(".node"),
          size = d3.scaleLinear().range([5, height]);
      function ticked() {
          node.attr("cx", function(d) { return d.x = Math.max(d.radius, Math.min(width - d.radius, d.x)); })
              .attr("cy", function(d) { return d.y = Math.max(d.radius, Math.min(height - d.radius, d.y)); });
      }
      var value = this.props.valueMethod;
      size.domain([d3.min(this.props.nodes, value) , d3.sum(this.props.nodes, value)]);
      var color = d3.scaleSequential(d3.interpolateRainbow)
                      .domain([0, d3.max(this.props.nodes, function(d){return d.cluster;})]);

      var force = d3.forceSimulation()
        .force("collide",d3.forceCollide( function(d){return d.r + 8;}).iterations(16) )
        .force("charge", d3.forceManyBody().strength(-100))
        .force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2))
        .on("tick", ticked);
      force.nodes(this.props.nodes);

      node = node.data(this.props.nodes)
            .enter().append("circle")
              .attr("class", "node")
              .attr("r", function(d){ return d.radius = size(value(d));})
              .attr("fill", function(d){return color(d.cluster);})
              .attr("cy", function(d) { return d.y; })
              .attr("cx", function(d) { return d.x; });

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
