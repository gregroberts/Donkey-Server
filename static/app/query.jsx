import React, {Component} from 'react';
import {PageHeader, Grid, Tabs, Tab, ControlLabel, FormControl, ButtonGroup, Radio} from 'react-bootstrap';

import RequestQueryBox from './RequestQueryBox.jsx';
import HandleQueryTable from './HandleQueryTable.jsx';
import SaveQueryTable from './SaveQueryTable.jsx'
import jQuery from 'jquery';
import api_stuff from './api_functions.jsx';
//import {hit_api} from './api_functions.jsx';
var $ = jQuery;
var hit_api = api_stuff.hit_api;
var hydrate_query = api_stuff.hydrate_query;


class Query extends Component {
	constructor(props) {
		super(props);
		this.updateRequestQuery = this.updateRequestQuery.bind(this);
		this.addNewCell = this.addNewCell.bind(this);
		this.updateHandleQueryVal = this.updateHandleQueryVal.bind(this);
		this.submitHandleQuery = this.submitHandleQuery.bind(this);
		this.delVal = this.delVal.bind(this);
		this.updateInfo = this.updateInfo.bind(this);
		this.saveQuery = this.saveQuery.bind(this);
		this.updateGrabber = this.updateGrabber.bind(this);
		this.state =  {
			raw_data: "",
			data: [],
			handle_query: {},
			request_query: {},
			uuid: props.params.uuid
	    }
	}
	componentDidMount(){
		var uuid = this.state.uuid;
		if (uuid == "new") {
			var get_uid = hit_api('/query/new/', {handler: "XPATHROW"}, 'POST');
			setTimeout(console.log(get_uid,'aa'), 500);

			var get_details = get_uid.done(function(data){
				uuid = data.uuid;
				return hydrate_query(uuid, 'queries');
			});

			var complete = $.when(get_details).then(function(ret_val){
				return ret_val;
			});
			$.when(complete).then(function(ret){
				this.setState(ret);
				this.setState({display_name: ret.uuid});
				if (this.state.data == undefined) {
					this.setState({data: []});
				}
			}.bind(this));

		} else {
			var complete = $.when(hydrate_query(uuid, 'library')).then(function(ret_val){
				return ret_val;
			});
			$.when(complete).then(function(ret){
				this.setState(ret);
				this.setState({display_name: ret.name})
				if (this.state.data == undefined) {
					this.setState({data: []})
				}
				this.forceUpdate();
			}.bind(this));

		};
	}
	updateRequestQuery(data){
		this.setState({
			request_query:data
		});
		var data = $.when(hit_api('/query/fetch/'+this.state.uuid, data, 'POST')).then(function(data){
			this.setState({raw_data: data.data})
			return data.data;
		}.bind(this));
		;
		return data;
	}
	addNewCell(data){
		var vals = this.state.handle_query
		vals[data] = '';
		this.setState({handle_query: vals});
	}
	updateHandleQueryVal(key, val){
		var to_up = this.state.handle_query;
		to_up[key] = val;
		this.setState({handle_query: to_up});
	}
	submitHandleQuery(){
		var data = $.when(hit_api('/query/handle/'+this.state.uuid, this.state.handle_query, 'POST')).then(function(data){
			this.setState({data: data.data});
			this.forceUpdate();
		}.bind(this));
	}
	delVal(val){
		var v = this.state.handle_query;
		delete v[val.key];
		this.setState({handle_query: v});
	}
	updateInfo (key, val) {
		if (key=='Name') {
			this.setState({name: val})
		} else if (key == 'Desc') {
			this.setState({description: val})
		} ;
	}
	saveQuery () {
		var data = $.when(
				hit_api('/query/save/'+this.state.uuid,
						{name: this.state.name,
						 description: this.state.description
						},
						'POST')
		).then(function(data){
			alert(data.message)
		})
	}
	updateGrabber(e){
		console.log(e.target.value);

	}
	render(){
		return (
			<Grid className="queryBox">
				<PageHeader>XPathRow Query Constructor <small>{this.state.name}</small></PageHeader>
				<hr/>
				Query Description: {this.state.description}
				<Tabs defaultActiveKey={1} id="QueryTabs">

					<Tab eventKey={1} title="Setup">
						<ControlLabel>Request Type</ControlLabel>
						<FormControl 
							componentClass="select"
							onChange={this.updateGrabber}
							>
							<option value="request">request</option>
							<option value="dummy">dummy</option>
						</FormControl>
						<hr/>
						<ControlLabel>Handler Type</ControlLabel>
						<FormControl componentClass="select" placeholer="How to query the data...">
							<option value="XPATHROW">XPATHROW</option>
							<option value="JMESPATH">JMESPATH</option>
						</FormControl>
						<hr/>
						<ControlLabel>Data Format</ControlLabel>
						<ButtonGroup onChange={this.resFormat}>
						      <Radio inline>
						        Row
						      </Radio >
						      <Radio inline >
						        Table
						      </Radio>
						</ButtonGroup>
					</Tab>
					<Tab eventKey={2} title="Request">
						<RequestQueryBox
							request_query={this.state.request_query}
							raw_data = {this.state.raw_data}
							onURLSubmit = {this.updateRequestQuery}
						/>
					</Tab>
					<Tab eventKey={3} title="Handler">
						<HandleQueryTable
							values={this.state.handle_query}
							addNewCell={this.addNewCell}
							updateVal={this.updateHandleQueryVal}
							performHandleQuery={this.submitHandleQuery}
							output_data={this.state.data}
							delVal={this.delVal}
						/>
					</Tab>
					<Tab eventKey={4} title="Information">
						<SaveQueryTable
							updateInfo={this.updateInfo}
							saveQuery={this.saveQuery}
							name={this.state.name}
							description= {this.state.description}
						/>
					</Tab>
				</Tabs>
			</Grid>
		);
	}
};


export default Query;
