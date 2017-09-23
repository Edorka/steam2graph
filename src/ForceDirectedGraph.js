import React, { Component } from 'react';
import logo from './logo.svg';
import * as d3 from "d3";



var width = 900, height = 500;
var color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(d3.range(30));

class ForceDirectedGraph extends Component {

  constructor(props){
    super(props);
  }
  componentWillMount() {

  }
  ticked(){


  }

  componentDidMount() {
      //force.on("tick", this.ticked);


      this.svg = d3.select(this.element);
      var link = this.svg.selectAll(".link"),
          node = this.svg.selectAll(".node");
      var size = d3.scaleLinear().range([5, 500]);


      function ticked() {
          node.attr("cx", function(d) {return d.x;})
          .attr("cy", function(d) { return d.y; });

          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });
      }
      var value = this.props.valueMethod;
      size.domain([d3.min(this.props.nodes, value) , d3.sum(this.props.nodes, value)]);

      var force = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(40))
        .force("collide",d3.forceCollide( function(d){return d.r + 8;}).iterations(16) )
        .force("charge", d3.forceManyBody().strength(-200))
        .force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2))
        .on("tick", ticked);
      force.nodes(this.props.nodes);
      force.force("link").links(this.props.links);

      link = link.data(this.props.links)
            .enter().append("line")
            .attr("class", "link");
      node = node.data(this.props.nodes)
            .enter().append("circle")
              .attr("class", "node")
              .attr("r", function(d){ return size(value(d));})
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
