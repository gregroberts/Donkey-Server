import jQuery from 'jquery';
import api_stuff from './api_functions.jsx';
import React, {Component} from 'react';
import {Row, PageHeader, Grid, Panel, FormGroup, FormControl, Table,
		InputGroup} from 'react-bootstrap';
//import {hit_api} from './api_functions.jsx';
var $ = jQuery;
var hit_api = api_stuff.hit_api;
var hydrate_query = api_stuff.hydrate_query;


class List extends Component {
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
			<th>Description</th>
			<th>Details</th></tr></thead>
			<tbody>
				{
					qs.map(function(key, index){
						return <QueryRes
											key={index}
											name={key.name}
											description={key.description}
											uuid={key.uuid}
											query={key.query}
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
		this.state= {
			name:'',
			description:'',
			uuid: '',
			request_query: {},
			handle_query:{},
			show:true
		};
	}
	shouldComponentUpdate(pp) {
		this.setState({name:pp.name, description: pp.description, uuid: pp.uuid},
				function(){
					this.setState({
						name:pp.name,
						description: pp.description,
						uuid: pp.uuid,
						request_query:pp.query.request,
						handle_query: pp.query.handle,
						show:pp.show
					});
					console.log(pp.show);
					this.forceUpdate();
				}
		);
		this.render();
		return true;
	}

	componentDidMount(){

		this.setState({name:this.props.name, description: this.props.description});

	}
	render() {
		var link_loc = '/donkey/query/'+this.state.name;
		return <tr className={'hide-'+ ! this.props.show}>
			<td><a href={link_loc} target="_blank">{this.state.name}</a>
			</td>
			<td>{this.state.description}
			</td>
			<td>
					<b>Request Grabber: </b>{this.state.request_query['@grabber']}<br/>
					<b>Request URL: </b> {this.state.request_query.url}<br/>
					<b>Query Handler: </b> {this.state.handle_query['@handler']}<br/>
			</td>
			</tr>
	}
};


export default List;