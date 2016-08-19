import React from 'react';
import {Component} from 'react';
import {Row, Button, Panel, Col,PageHeader,Grid,
	FormGroup, FormControl, InputGroup,ControlLabel,
	Table, Radio, ButtonGroup} from 'react-bootstrap';
import InputTableCell from './InputTableCell.jsx';
import OutPutBits from './OutPutBits.jsx';
import api_stuff from './api_functions.jsx';
import jQuery from 'jquery';
var $ = jQuery;
var hit_api = api_stuff.hit_api;
var OutputTableRow = OutPutBits.OutputTableRow;
var hydrate_query = api_stuff.hydrate_query;


class RunQuery extends Component{
	constructor(props){
		super(props);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.updateVal = this.updateVal.bind(this);
		this.runQuery = this.runQuery.bind(this);
		this.state = {
			name:'',
			description:'',
			parameters:[],
			outParams:{},
			uuid: props.params.uuid,
			resFormat:'Row',
			result:[{}]
		}
	}
	componentDidMount(){
		var uuid = this.state.uuid;
		this.setState({isNew: false});
		var complete = $.when(hydrate_query(uuid, 'library')).then(function(ret_val){
			return ret_val;
		});
		$.when(complete).then(function(ret){
			if (ret.handle_query._base) {
				this.setState({resFormat: 'Table'});
			} else {
				this.setState({resFormat: 'Row'});
			}
			this.setState(ret);
			this.setState({display_name: ret.name})
			this.forceUpdate();
			console.log(this.state);
		}.bind(this));
	}
	updateVal(key, val){
		var curr_keys = this.state.outParams;
		curr_keys[key]= val;
		this.setState({outParams: curr_keys});
	}
	runQuery(){
		console.log(this.state.outParams);
		$.when(hit_api('/query/run/'+this.state.name, this.state.outParams, 'POST')).then(function(ret_val){
			console.log(ret_val);
			if(this.state.resFormat=='Row'){
				this.setState({result:[ret_val.data]});
			} else{
				this.setState({result:ret_val.data});
			}
			
		}.bind(this))
	}
	render() {
		var keys = this.state.parameters;
		var vals = this.state.outParams;
		var resKeys = Object.keys(this.state.result[0]);
		var resVals = this.state.result;
		console.log(keys,vals,resKeys, resVals);
		return(
			<Grid className="RunQuery">
			<Row>
				<PageHeader>{this.state.name}<small>{this.state.description}</small></PageHeader>
				
				<Panel header="Parameter Input">
				<Table striped bordered condensed hover>
					<thead>
						<tr>
							<th>Parameter Name</th>
							<th>Parameter Value</th>
						</tr>
					</thead>
					<tbody>
					{
					keys.map(function(key, index){
						if (key !== '_base') {
							var val = this.state.outParams[key];
							var ind = index;
							return <tr key={index}>
								<th>{key}</th>
									<InputTableCell
										value={val}
										keyname = {key}
										updateVal={this.updateVal}
									/>
							</tr>
						}
					}.bind(this))
					}
					</tbody>
				</Table>
				<Button onClick={this.runQuery} bsStyle="info">Run!</Button>
				</Panel>
				<Panel header="Query Output">
					<Table>
					<thead>
					<tr>
					{
						resKeys.map(function(key, index){
							return <th key={index}>{key}</th>
						}.bind(this))
					}
					</tr>
					</thead>
					<tbody>
						{
							resVals.map(function(key,index){
								return <OutputTableRow
										value={key}
										key={index}
									/>
							}.bind(this))
						}
					</tbody>
					</Table>
				</Panel>
			</Row>
			</Grid>
		)
	}
}

export default RunQuery;
