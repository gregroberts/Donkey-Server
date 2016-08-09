import React from 'react';
import {Component} from 'react';
import {FormControl } from 'react-bootstrap';

class InputTableCell extends Component{
	constructor(props) {
		super(props);
		this.changeVal= this.changeVal.bind(this);
		this.state =  {val:''}
	}	
	shouldComponentUpdate(newProps){
		this.setState({val: newProps.value}, function(){
			this.setState({val: newProps.value});
			this.forceUpdate()
		});
		return true;
	}
	changeVal(e){
		var value = e.target.value;
		var key = this.props.keyname;
		this.props.updateVal(key, value);
		this.setState({val: value});
	}
	render(){
		return (
			<td><FormControl type="text" onChange={this.changeVal} value={this.state.val}/></td>
		)
	}
};

export default InputTableCell;
