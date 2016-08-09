import React from 'react';
import {Component} from 'react';
import {Row, Button, Panel, Col, 
	FormGroup, FormControl, InputGroup,
	Table, } from 'react-bootstrap';


class OutputTableRow extends Component {
	constructor(props) {
		super(props);
		this.state =  {val:[]};
	}
	shouldComponentUpdate(newProps) {
		this.setState({val:newProps.value}, function(d){
			this.forceUpdate();
		}.bind(this));
		return true;
	}
	render(){
		return <tr>{
				Object.keys(this.state.val).map(function (key, index) {
					return <OutputTableCell value={this.state.val[key]} key={index} />;
				}.bind(this))
			}</tr>;
	}
};

 class OutputTableCell extends Component {
	constructor(props) {
		super(props);
		this.state =  {value:''};
	} 	
	shouldComponentUpdate(newProps) {
		this.setState(newProps, function(data){
			this.forceUpdate();
		});
		return true;
	}
	render(){
		return (
			<td>{this.state.value}</td>
		);
	}
};

export default {OutputTableCell,OutputTableRow };
