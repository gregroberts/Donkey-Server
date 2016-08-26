import jQuery from 'jquery';
import api_stuff from './api_functions.jsx';
import React, {Component} from 'react';
import {Row, PageHeader, Grid, Panel, FormGroup, FormControl, Table,
	Button,
		InputGroup} from 'react-bootstrap';
//import {hit_api} from './api_functions.jsx';
var $ = jQuery;
var hit_api = api_stuff.hit_api;
var hydrate_query = api_stuff.hydrate_query;


class QueryList extends Component {
	constructor(props) {
		super(props);
		this.handleSearch = this.handleSearch.bind(this);
		this.state =  {
		   queries: [],
			show:[],
		}
	}
	componentDidMount() {
		$.when(hit_api('/query/list',null, 'GET')).then(function(data){
				this.setState({queries: data.data});
				var h = Array(data.data.length).fill(true);
				this.setState({show: h});
		}.bind(this));
	}
	handleSearch(e) {
		var toshow = this.state.show.slice();
		var q = e.target.value;
		if (q.length<2) {
			toshow=Array(this.state.queries.length).fill(true);
		} else {
			for (var i = 0; i < this.state.queries.length; i++) {
				if (this.state.queries[i].name.toLowerCase().search(q)==-1) {
					toshow[i] = false;
				}
			};
		};
		console.log(toshow);
		this.setState({show: toshow});
	}
	render() {
		var qs = this.state.queries;
		return <Grid>
		<Row>
		<PageHeader>Saved Queries</PageHeader>
		<Panel >
			<FormGroup>
				<InputGroup >
					<InputGroup.Addon>Filter by Name</InputGroup.Addon>
					<FormControl type="text" ref="url" onChange={this.handleSearch} />
				</InputGroup>
			</FormGroup>
			<Table striped bordered condensed hover>
			<thead>
			<tr>
			<th>Name</th>
			<th>Edit</th>
			<th>Description</th>
			<th>Details</th>
			<th>Delete</th>
			</tr></thead>
			<tbody>
				{
					qs.map(function(key, index){
						return <QueryRes
											key={index}
											name={key.name}
											description={key.description}
											uuid={key.uuid}
											grabber={key.grabber}
											handler={key.handler}
											request_query={key.request_query}
											handle_query={key.handle_query}
											show={this.state.show[index]}
									/>;
					}.bind(this))
				}
			</tbody>
			</Table>
			</Panel>
			</Row>
			</Grid>
	}
};

class QueryRes extends  Component {
	constructor(props) {
		super(props);
		this.deleteQuery = this.deleteQuery.bind(this);
		this.state= {
			name:props.name,
			description:props.description,
			uuid:props.uuid,
			grabber:props.grabber,
			handler:props.handler,
			request_query:props.request_query,
			handle_query:props.handle_query,
			show:true
		};
	}
	deleteQuery() {
		hit_api('/query/delete',{uuid:this.state.name},'POST').then(function (data) {
			alert(data.message+' This window will now reload');
			location.reload();
		})
		return true;
	}
	render() {
		var link_loc = '/donkey/run_query/'+this.state.name;
		var edit_loc = '/donkey/query/'+this.state.name;
		var reqq = this.state.request_query;
		var hanq = this.state.handle_query;
		return <tr className={'hide-'+ ! this.props.show}>
			<td><a href={link_loc} target="_blank">{this.state.name}</a>
			</td>
			<td><a href={edit_loc} target="_blank">Edit</a>
			</td>			
			<td>{this.state.description}
			</td>
			<td>
					<b>Request Grabber: </b>{this.state.grabber}<br/>
					<b>Query Handler: </b> {this.state.handler}<br/>
					<b>Request Details: </b><br/>
					{
						Object.keys(reqq).map(function(key, index) {
							var val = reqq[key];
							var k=':';
							return( <span><b>{key}</b>{k}<small>{val}</small></span>)
						})
					}
					<br/>
					<b>Handle Details</b><br/>
					{
						Object.keys(hanq).map(function(key, index) {
							var val = hanq[key];
							var k=':';
							return( <span><b>{key}</b>{k}<small>{val}</small></span>)
						})
					}
			</td>
			<td><Button onClick={this.deleteQuery}>Delete!</Button></td>
			</tr>
	}
};


export default QueryList;