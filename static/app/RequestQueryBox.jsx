import React from 'react';
import {Component} from 'react';
import {Row, Button, Panel, Col, FormGroup, FormControl, InputGroup,ControlLabel,Table} from 'react-bootstrap';

class RequestQueryBox extends Component{
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.findValue = this.findValue.bind(this);
		this.state =  {
			url: '',
			raw_data:'',
			filtered:[],
			query:'',
		}
	}
	shouldComponentUpdate(newProps, newState){
		this.setState({url: newProps.request_query.url});
		this.setState({raw_data: newProps.raw_data});
		return true;
	}
	handleChange(e) {
		this.setState({url: e.target.value});
		this.props.onURLSubmit({url:e.target.value}, false)
	}
	handleSubmit(e){
		var new_raw = this.props.onURLSubmit({url: this.state.url}, true);
		new_raw.done(function(data){
			this.setState({raw_data: data});
		}.bind(this));
	}
	findValue(e){
		var escape = function(s) {
		    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		};

		var query = escape(e.target.value);
		if (query.length>1) {
			var to_search = this.state.raw_data.split("\n");
			var results = [];
			var bord = 20
			for (var i = 0; i < to_search.length; i++) {
				var is_res = to_search[i].search(query);
				if (is_res>-1) {
					results.push(to_search[i].substring(is_res - bord, is_res + query.length + bord))
				}to_search[i]
			}
			this.setState({query: query});
			this.setState({filtered: results})

		} else{
			this.setState({filtered: []});
		}
	}

	render(){
		var filt = this.state.filtered;
		return(
			<div>
				<Row>
					<Panel header="Request Input" >
						<FormGroup className="requestQueryBox" >
						<ControlLabel>URL:</ControlLabel>
						<InputGroup >
							<FormControl type="text" ref="url" onChange={this.handleChange} value={this.state.url}/>
							<InputGroup.Button>
								<Button onClick={this.handleSubmit} >Update Details</Button>
							</InputGroup.Button>
						</InputGroup>
						</FormGroup>
					</Panel>
				</Row>
				<Row>
					<Panel header="Request Output">
						<InputGroup>
							<InputGroup.Addon>Find Text</InputGroup.Addon>
							<FormControl type="text" onChange={this.findValue} />
						</InputGroup>
						<span>{this.state.filtered}</span>
						<Table>
							<tbody>
							{
								filt.map(function(data, index){
									return <tr key={index}><td>{data}</td></tr>
								}.bind(this))
							}
							</tbody>
						</Table>

						<div><textarea value={this.state.raw_data} /></div>
					</Panel>
				</Row>
			</div>

		)
	}

};

export default RequestQueryBox
