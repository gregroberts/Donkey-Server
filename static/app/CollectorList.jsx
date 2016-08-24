import jQuery from 'jquery';
import api_stuff from './api_functions.jsx';
import React, {Component} from 'react';
import {Row, PageHeader, Grid, Panel, FormGroup, FormControl, Table,
		Button, InputGroup} from 'react-bootstrap';
//import {hit_api} from './api_functions.jsx';
var $ = jQuery;
var hit_api = api_stuff.hit_api;
var hydrate_query = api_stuff.hydrate_query;


class CollectorList extends Component {
	constructor(props) {
		super(props);
		this.handleSearch = this.handleSearch.bind(this);
		this.state =  {
		   collections: [],
			show:[],
		}
	}
	componentDidMount() {
		$.when(hit_api('/collector/show_collections/',null, 'GET')).then(function(data){
				console.log(data.data)
				this.setState({collections: data.data});
				var h = Array(data.data.length).fill(true);
				this.setState({show: h});
		}.bind(this));
	}
	handleSearch(e) {
		var toshow = this.state.show.slice();
		var q = e.target.value;
		if (q.length<2) {
			toshow=Array(this.state.collections.length).fill(true);
		} else {
			for (var i = 0; i < this.state.collections.length; i++) {
				if (this.state.collections[i].CollectionName.toLowerCase().search(q)==-1) {
					toshow[i] = false;
				}
			};
		};
		this.setState({show: toshow});
	}
	render() {
		var qs = this.state.collections;
		return <Grid>
		<Row>
		<PageHeader>Saved Collections</PageHeader>
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
				<th>Frequency</th>
				<th>Input</th>
				<th>Input Type</th>
				<th>Is Running</th>
				<th>Last Run</th>
				<th>Query Name</th>
				<th>Queue Name</th>
				<th>Table Name</th>
				<th>Re-run Now</th>
			</tr>
			</thead>
			<tbody>
				{
					qs.map(function(key, index){
						return <CollectorRes
								key={index}
								CollectionName={key.CollectionName}
								Frequency={key.Frequency}
								Input={key.Input}
								InputType={key.InputType}
								IsRunning={key.IsRunning}
								LastRun={key.LastRun}
								QueryName={key.QueryName}
								QueueName={key.QueueName}
								TableName={key.TableName}
								CollectorID={key.id}
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

class CollectorRes extends  Component {
	constructor(props) {
		super(props);
		this.reschedule = this.reschedule.bind(this);
		this.state = {
			CollectionName: 'CollectionName',
			Frequency: 'Frequency',
			Input: 'Input',
			InputType: 'InputType',
			IsRunning: 'IsRunning',
			LastRun: 'LastRun',
			QueryName: 'QueryName',
			QueueName: 'QueueName',
			TableName: 'TableName',
			CollectorID:-1,
			show:true
		};
	}
	shouldComponentUpdate(pp) {
		this.setState({
			CollectionName: pp.CollectionName,
			Frequency: pp.Frequency,
			Input: pp.Input,
			InputType: pp.InputType,
			IsRunning: pp.IsRunning,
			LastRun: pp.LastRun,
			QueryName: pp.QueryName,
			QueueName: pp.QueueName,
			CollectorID:pp.CollectorID,
			TableName: pp.TableName,
			show: pp.show,
		}, this.forceUpdate);
		return true;	
	}
	reschedule(){
		var id = this.state.CollectorID;
		hit_api('/collector/run_collection/', {'id':id}, 'POST').then(function(data){
			alert(data.message+': this window will now reload');
			location.reload();
		})
	}
	componentDidMount(){
		this.setState({
			CollectionName: this.props.CollectionName,
			CollectorID: this.props.CollectorID,
			Frequency: this.props.Frequency,
			Input: this.props.Input,
			InputType: this.props.InputType,
			IsRunning: this.props.IsRunning,
			LastRun: this.props.LastRun,
			QueryName: this.props.QueryName,
			QueueName: this.props.QueueName,
			TableName: this.props.TableName,
			show: this.props.show,
		}, this.forceUpdate);
	}
	render() {
		var q_link_loc = '/donkey/query/'+this.state.QueryName;
		return <tr className={'hide-'+ ! this.props.show}>
				<td><b>{this.state.CollectionName}</b></td>
				<td>{this.state.Frequency}</td>
				<td>{String(this.state.Input).substring(0,20)+'...'}</td>
				<td>{this.state.InputType}</td>
				<td>{this.state.IsRunning}</td>
				<td>{this.state.LastRun}</td>
				<td><a href={q_link_loc} target="_blank">{this.state.QueryName}</a></td>
				<td><a href={"/redis_queue/"+this.state.QueueName} target="_blank">{this.state.QueueName}</a></td>
				<td>{this.state.TableName}</td>
				<td><Button onClick={this.reschedule}>Go!</Button></td>
			</tr>
	}
};


export default CollectorList;