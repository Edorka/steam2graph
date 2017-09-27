import React, { Component } from 'react';
import './SwitchNext.css';
// Include its styles in you build process as well

class SwitchNext extends Component {

    constructor(props){
      super(props);
      this.choices = [];
      this.state = {
        choice: {'label':''},
        position: null
      };
    }
    componentDidMount() {
      this.choices = this.props.choices;
      this.setState({
          position: 0,
          choice: this.choices[0]
      });
    }
    next(e){
      var newPosition = this.state.position + 1;
      newPosition = newPosition < this.choices.length ? newPosition: 0;
      this.setState({
        position: newPosition,
        choice: this.choices[newPosition]
      });
      this.props.onSelection(this.state.choice);
    }
    render() {
      return(
          <button onClick={(e) => this.next(e)}>
            {this.state.choice.label}
          </button>
      );
   }
}
export default SwitchNext
