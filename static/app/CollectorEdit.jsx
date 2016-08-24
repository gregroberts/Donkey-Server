import jQuery from 'jquery';
import api_stuff from './api_functions.jsx';
import React, {Component} from 'react';
import {Row, PageHeader, Grid, Panel, FormGroup, FormControl, Table,
ControlLabel,
		Button, InputGroup} from 'react-bootstrap';
//import {hit_api} from './api_functions.jsx';
var $ = jQuery;
var hit_api = api_stuff.hit_api;
var hydrate_query = api_stuff.hydrate_query;


class CollectorEdit extends Component {
	constructor(props){
		super(props);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.changeBit = this.changeBit.bind(this);
		this.state = {
			details:{
				CollectionName:'',//
				Frequency: 0,
				Input:'',
				InputType:'sql',//
				QueryName:'',
				QueueName:'default',//
				TableName:'',//			
			},
			available_queries:[]
		}
	}
	componentDidMount() {
		$.when(hit_api('/query/list',null, 'GET')).then(function(data){
				this.setState({available_queries: data.data});
		}.bind(this));
	}
	changeBit(e){
		var val=e.target.value;
		var nom=e.target.name;
		var curr = this.state.details;
		curr[nom] = val;
		this.setState({details:curr});
	}
	render() {
		var av_q = this.state.available_queries;
		return <Grid><Row>
			<PageHeader>Collection Constructor <small>{this.state.CollectionName}</small></PageHeader>
			<ControlLabel>Collection Name</ControlLabel>
			<FormControl
				type="text"
				name="CollectionName"
				onChange={this.changeBit}
			/>
			<hr/>
			<ControlLabel>Queue Name</ControlLabel>
			<FormControl
				type="text"
				name="QueueName" 
				onChange={this.changeBit}
			/>
			<hr/>	
			<ControlLabel>Table Name</ControlLabel>
			<FormControl
				type="text"
				name="TableName" 
				onChange={this.changeBit}
			/>
			<hr/>	
			<ControlLabel>Input Type</ControlLabel>
			<FormControl		
				componentClass="select"
				name="InputType"
				onChange={this.changeBit}
			>
				<option value="json">Json String</option>
				<option value ="sql">SQL Query</option>
			</FormControl>
			<hr/>
			<ControlLabel>Query Name</ControlLabel>
			<FormControl		
				componentClass="select"
				name="QueryName"
				onChange={this.changeBit}
			>
				<option>choose one...</option>
				{
					av_q.map(function(key, index){
						return <option 
								value={key.name}
								key={index}
							>
								{key.name+' - '+key.description} 
							</option>

					})
				}
			</FormControl>

		</Row></Grid>
	}
}


export default CollectorEdit;
