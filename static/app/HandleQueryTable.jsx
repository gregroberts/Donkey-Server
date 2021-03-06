import React from 'react';
import {Component} from 'react';
import {Row, Button, Panel, Col,
	FormGroup, FormControl, InputGroup,ControlLabel,
	Table, Radio, ButtonGroup} from 'react-bootstrap';
import InputTableCell from './InputTableCell.jsx';
import OutPutBits from './OutPutBits.jsx';

var OutputTableCell = OutPutBits.OutputTableCell;
var OutputTableRow = OutPutBits.OutputTableRow;

class HandleQueryTable extends Component{
	constructor(props) {
		super(props);
		this.makeNewCell = this.makeNewCell.bind(this);
		this.updateVal = this.updateVal.bind(this);
		this.changeBase = this.	changeBase.bind(this);
		this.state = {
			cells:{},
			resFormat: 'Row',
			_base:'',
			output_data: []

		};
	}

	shouldComponentUpdate(newProps, newState){
		this.setState({
			cells:newProps.values,
			output_data: newProps.output_data,
			_base: newProps.values._base,
			resFormat: newProps.resFormat
		});
		return true;
	}
	makeNewCell(){
		var newVal = prompt("Enter a name for the new value", "NewVal");
		if (newVal != null) {
			var curr_keys = this.state.cells;
			curr_keys[newVal]="";
			this.setState({cells: curr_keys});
			this.props.addNewCell(newVal)
		}
	}
	updateVal(key, val){
		var curr_keys = this.state.cells;
		curr_keys[key]= val;
		this.setState({cells: curr_keys});
		this.props.updateVal(key, val);
	}
	changeBase(e){
		this.setState({_base: e.target.value})
		this.props.updateVal('_base', e.target.value)
	}

	render(){
		var keys = Object.keys(this.props.values || {}).sort();
		var values = this.props.values;
		if (this.props.output_data != undefined) {
			if (Object.keys(this.props.output_data)[0]==0) {
				var out_keys = Object.keys(this.props.output_data)[0];
				var out_values = this.props.output_data;
			} else {
				var out_keys = Object.keys(this.props.output_data);
				var out_values = this.props.output_data;
			};
		} else {
			var out_keys = [];
			var out_values = [[]];
		};
		return(
		<div>
		<Row>
			<Panel header="Query Input">
			    <InputGroup className={'hide-'+(this.state.resFormat=='Row')} >
			    	<InputGroup.Addon>Base Query</InputGroup.Addon>
			    	<FormControl onChange={this.changeBase} type="text" value={this.state._base}/>
			    </InputGroup>
				<Table striped bordered condensed hover>
					<thead>
						<tr>
							<th>Variable Name</th>
							<th>Xpath Query</th>
							<th>Del</th>
						</tr>
					</thead>
					<tbody>
					{

						keys.map(function(key, index){
							if (key !== '_base') {
								var val = values[key];
								var ind = index;
								return <tr key={index}>
									<th>{key}</th>
										<InputTableCell
											value={val}
											keyname = {key}
											updateVal={this.updateVal}
										/>
									<td><Button bsSize="small" onClick={() => this.props.delVal({key})} >x</Button></td>
								</tr>
							};

						}.bind(this))
					}
					</tbody>
				</Table>
				<Button onClick={this.makeNewCell}> Add New value</Button>
				<Button onClick={this.props.performHandleQuery}>Perform Handle Query</Button>
			</Panel>
		</Row>
		<Row>
			<Panel header="Query Output">
			 <Table striped bordered condensed hover>
				<thead>
				{
				(() => {
				if (this.state.resFormat=='Row') {
					return <tr>
						<th>Variable Name</th>
						<th>Xpath Result</th>
					</tr>
				} else{
					return <tr>
					{
						keys.map(function(key, index){
							if (key!='_base') {
								return <th key={index}>{key}</th>
							};
						})
					}
					</tr>
				};
				})()
				}
				</thead>
				<tbody>
				{
				(() =>{
				if (this.state.resFormat=='Table') {
					return (
						Object.keys(out_values).map(function(key, index){
							var ind = index;
							return <OutputTableRow
									value={out_values[key]}
									key={index}/>
						}.bind(this))
					)
				} else{
					return (
						out_keys.map(function(key, index){
							var val = out_values[key];
							var ind = index;
							return  <tr key={index}><th>{key}</th>
								<OutputTableCell
									value={val}
								/>
								</tr>
						}.bind(this))
					)
				};
				})()
				}
				</tbody>
			 </Table>
			</Panel>
		</Row>
		</div>
		);
	}
};

export default HandleQueryTable;
