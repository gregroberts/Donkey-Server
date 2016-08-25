import React from 'react';
import {Component} from 'react';
import {Row, Button, Panel, Col, 
	FormGroup, FormControl, InputGroup,
	Table, } from 'react-bootstrap';


class OutputTableRow extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
		this.state =  {val:[]};
		console.log('outconts',props);
	}
	shouldComponentUpdate(newProps) {
		console.log('OPB',newProps)
		this.setState({val:newProps.value}, function(d){
			this.forceUpdate();
		}.bind(this));
		return true;
	}
	//componentDid
	render(){
		return <tr>{
				Object.keys(this.state.val).sort().map(function (key, index) {
					return <OutputTableCell value={this.state.val[key]} key={index} />;
				}.bind(this))
			}</tr>;
	}
};

 class OutputTableCell extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.state =  {value:''};
	} 	
	componentDidMount(p) {
		this.setState(this.props, function(data){
			this.forceUpdate();
		});
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
