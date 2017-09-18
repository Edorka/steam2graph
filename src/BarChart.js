import React, { Component } from 'react';
import './BarChart.css';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import { request } from 'axios';

class BarChart extends Component {
    constructor(props){
        super(props)
        this.dimensions = {
            width: 100,
            height: 100
        };
        this.createBarChart = this.createBarChart.bind(this)
    }
    componentDidMount() {
        this.dimensions.height = this.node.clientHeight;
        this.dimensions.width = this.node.clientWidth;
        console.log(this.dimensions);
        this.createBarChart();

    }
    componentDidUpdate() {
        this.createBarChart();
    }
    createBarChart() {
        this.request = request({method:'get', url: this.props.source}).then(function(response){
            console.log('response', response);
        });
        return;
        const node = this.node
        const dataMax = max(this.props.data)
        const yScale = scaleLinear()
            .domain([0, dataMax])
            .range([0, this.dimensions.height])
         select(node)
             .selectAll('rect')
             .data(this.props.data)
             .enter()
             .append('rect')
         
         select(node)
             .selectAll('rect')
             .data(this.props.data)
             .exit()
             .remove()
         
         select(node)
             .selectAll('rect')
             .data(this.props.data)
             .style('fill', '#fe9922')
             .attr('x', (d,i) => i * 25)
             .attr('y', d => this.props.size[1] - yScale(d))
             .attr('height', d => yScale(d))
             .attr('width', 25)
         }
    render() {
      return <svg className="BarChart" ref={node => this.node = node}>
      </svg>
   }
}
export default BarChart
