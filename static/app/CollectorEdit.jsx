import jQuery from 'jquery';
import api_stuff from './api_functions.jsx';
import React, {Component} from 'react';
import {Row, PageHeader, Grid, Panel, FormGroup, FormControl, Table,
		ControlLabel,Button, InputGroup} from 'react-bootstrap';
import OutPutBits from './OutPutBits.jsx';
import exportTableToCSV from './export_table.jsx'


var OutputTableCell = OutPutBits.OutputTableCell;
var OutputTableRow = OutPutBits.OutputTableRow;
var $ = jQuery;
var hit_api = api_stuff.hit_api;
var hydrate_query = api_stuff.hydrate_query;

class CollectorEdit extends Component {
	constructor(props){
		super(props);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.changeBit = this.changeBit.bind(this);
		this.updateCollection = this.updateCollection.bind(this);	
		this.testCollector	=this.testCollector.bind	(this);
		this.updateCols = this.updateCols.bind(this);
		this.exportT = this.exportT.bind(this);
		this.state = {
			details:{
				CollectionName:'',//
				Frequency: 0,
				Input:'[{"url":"example.com"},{"url":"example.com"}]',
				InputType:'json',//
				QueryName:'',
				QueueName:'default',//
				TableName:'',//
				'id':props.params.id,
			},
			available_queries:[],
			t_jobs:[],
			t_res_cols:[]
		}
	}
	componentDidMount() {
		$.when(hit_api('/query/list',null, 'GET')).then(function(data){
				this.setState({available_queries: data.data});
		}.bind(this));
		if (this.state.details.id=='new') {
			//it's a New query!
			//we don't have to do anything!

		} else{
			hit_api('/collector/show_collection/', {'id':this.state.details.id}, 'POST').then(function (data) {
				delete data.data.LastRun;
				delete data.data.IsRunning;
				delete data.data.due;
				this.setState({details: data.data});
			}.bind(this))

		}
	}
	changeBit(e){
		var val=e.target.value;
		var nom=e.target.name;
		var curr = this.state.details;
		curr[nom] = val;
		this.setState({details:curr});
	}
	updateCollection(){
		if (this.state.details.id=='new') {
			var kk = this.state.details;
			delete kk['id'];
			hit_api('/collector/register_collection', this.state.details, 'POST').then(function(data){
				kk['id'] = data.data;
				this.setState({details: kk});
			}.bind(this));
		} else {
			hit_api('/collector/update_collection', this.state.details, 'POST').then(function(data){
				alert(data.message);
			})
		}
	}

	testCollector(){
		this.setState({t_jobs:[],t_res_cols:[]})
		var data = {
			'Input':this.state.details.Input,
			'InputType':this.state.details.InputType,
			'QueryName':this.state.details.QueryName,
			'QueueName':this.state.details.QueueName,
		};
		hit_api('/collector/run_collector', data, 'POST').then(function (data) {
			alert(data.message);
			var jobs = data.data.jobs;
			this.setState({t_jobs:jobs}, this.forceUpdate);
		}.bind(this))
		
	}
	updateCols(cols){
		if (this.state.t_res_cols.length==0) {
			this.setState({t_res_cols:cols});
		} 
	}
	exportT(e){
		var d= new Date();
		var dd = d.toLocaleFormat('%Y-%m-%d %H.%M.%S');
		var f_name = 'Table_Export-'+dd;
		if (this.state.details.CollectionName!='') {
			f_name = f_name + this.state.details.CollectionName
		} else {
			f_name = f_name + '-'+this.state.details.QueryName+'-'+this.state.details.InputType
		}
		exportTableToCSV.apply(e.target, [$('#testTable'),f_name+'.csv']);
	}
	render() {
		var av_q = this.state.available_queries;
		var t_jobs = this.state.t_jobs;
		var t_res_cols = this.state.t_res_cols;
		var ucc = this.updateCols;
		return <Grid><Row>

		<PageHeader>Collection Constructor <small>{this.state.CollectionName}</small></PageHeader>
		<Panel header="Collector Setup Details">

			<ControlLabel>Queue Name</ControlLabel>
			<FormControl
				type="text"
				name="QueueName" 
				onChange={this.changeBit}
				value={this.state.details.QueueName}
			/>
			<hr/>	

			<ControlLabel>Input</ControlLabel>
			<FormControl
				type="textarea"
				name="Input"
				value={this.state.details.Input}
				onChange={this.changeBit}
			/>
			<hr/>
			<ControlLabel>Input Type</ControlLabel>
			<FormControl		
				componentClass="select"
				name="InputType"
				value={this.state.details.InputType}
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
				value={this.state.details.QueryName}
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

		</Panel>



		<Panel header="Collection Testing/Running">
			Here you can test your collection!
			<hr/>
			<Button onClick={this.testCollector}>Test</Button>
			<hr/>
			<a href="#" onClick={this.exportT}>Export Results</a>
			<Table id="testTable">
				<thead><tr>
				{
					t_res_cols.map(function (key,index) {
						return <th>{key}</th>
					})
				}
				</tr>
				</thead>
				{
					t_jobs.map(function (key, index) {
						return <JobResult
								key={index}
								updateCols={ucc}
								uuid={key}
								ref={key}
							/>
					})
				}
			</Table>
		</Panel>
		<Panel header="Collection Save Details">
			<ControlLabel>Collection Name</ControlLabel>
			<FormControl
				type="text"
				name="CollectionName"
				onChange={this.changeBit}
				value={this.state.details.CollectionName}
			/>
			<hr/>			
			<ControlLabel>Table Name</ControlLabel>
			<FormControl
				type="text"
				name="TableName" 
				onChange={this.changeBit}
				value={this.state.details.TableName}
			/>
			<hr/>	
			<ControlLabel>Frequency (days)</ControlLabel>
			<FormControl
				type="number"
				min={0}
				max={90}
				name="Frequency"
				value={this.state.details.Frequency}
				onChange={this.changeBit}
			/>
			<hr/>
			<Button onClick={this.updateCollection}>Save/Update</Button>
		</Panel>
		</Row></Grid>
	}
}

class JobResult extends Component {
	constructor(props) {
		super(props);
		this.mkStuffTrue = this.mkStuffTrue.bind(this);
		this.mkStuffFalse = this.mkStuffFalse.bind(this);
		this.mkStuff = this.mkStuff.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.state = {
			uuid:props.uuid,
			data:[],
			dots:'loading',
			fin:false
		};
	}
	componentDidMount(){
		function do_then(data){
			if (data.status =='failed') {
				this.setState({fin:true, data:[['Job Failed']]})
				this.forceUpdate()
			} else if (data.status!='finished') {
				var d = this.state.dots;
				d = d + '.';
				this.setState({dots:d});
				setTimeout(chuck_up, 2000);
			} else if (data.status=='finished') {
				var res = data.result;
				if (!Array.isArray(res)) {
					res = [res];
				};
				if (res.length>0) {
					this.props.updateCols(Object.keys(res[0]))
				}
				this.setState({data:res, fin:true}, this.forceUpdate);
				this.forceUpdate()
			}
		};
		var do_then_n = do_then.bind(this);
		function check_fin() {
			hit_api('/collector/get_job_result', {'id':this.state.uuid},'POST', false).then(do_then_n)
		};
		var chuck_up = check_fin.bind(this);
		this.setState({uuid:this.props.uuid}, function(){
			if (this.state.uuid!='') {
				chuck_up();
			}
		});
	}
	mkStuffTrue(){
		var rows = [];
		this.state.data.map(function (key,index) {
			rows.push(<OutputTableRow
				value={key}
				key={index}
				/>)
		}.bind(this));
		return <tbody>{rows}</tbody>
	}
	mkStuffFalse(){
		return <tbody><tr>{this.state.dots}</tr></tbody>
	}
	mkStuff(){
		return this.state.fin ? this.mkStuffTrue : this.mkStuffFalse;
	}
	render(){
		var kk=this.mkStuff();
		var ko = kk()
		return ko
	}
}


export default {CollectorEdit, JobResult};
