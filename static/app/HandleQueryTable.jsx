import React from 'react';
import {Component} from 'react';
import {Row, Button, Panel, Col, 
	FormGroup, FormControl, InputGroup,
	Table, } from 'react-bootstrap';
import InputTableCell from './InputTableCell.jsx';
import OutPutBits from './OutPutBits.jsx';

var OutputTableCell = OutPutBits.OutputTableCell;
var OutputTableRow = OutPutBits.OutputTableRow;

class HandleQueryTable extends Component{
	constructor(props) {
		super(props);
		this.makeNewCell = this.makeNewCell.bind(this)
		this.updateVal = this.updateVal.bind(this)
		this.state = {
			cells:{},
			open:true
		};
	}	

	shouldComponentUpdate(newProps, newState){
		console.log('handup',newProps,newState);
		if (newProps.values!= this.state.cells) {
			this.setState({cells:newProps.values});
			this.forceUpdate();
		}

		this.setState({cells: newState.cells});
		this.forceUpdate();
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


	render(){
		var keys = Object.keys(this.props.values);
		var values = this.props.values;
		var out_keys = Object.keys(this.props.output_data);
		var out_values = this.props.output_data;
		return(
			<Row>
			<Button onClick={ ()=> this.setState({ open: !this.state.open })} bsSize="small">
						 Collapse Query Details
			</Button>
			<Panel header="Query Details"  collapsible expanded={this.state.open}>
				<Col md={6} >
				<Panel header="Query Input">
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
						}.bind(this))
					}
					</tbody>
				</Table>
				<Button onClick={this.makeNewCell}> Add New value</Button>
				<Button onClick={this.props.performHandleQuery}>Perform Handle Query</Button>
				</Panel>
				</Col>
				<Col md={6}>
					<Panel header="Query Output">
					 <Table striped bordered condensed hover>
						<thead>
							<tr>
								<th>Variable Name</th>
								<th>Xpath Result</th>
							</tr>
						</thead>
						<tbody>
								{
									out_keys.map(function(key, index){
										var val = out_values[key];
										var ind = index;
										return  <tr key={index}><th>{key}</th>
											<OutputTableCell
												value={val}
											/>
											</tr>
									}.bind(this))
								}
						</tbody>
					</Table>
					</Panel>
				</Col>
			</Panel>
			</Row>
		);
	}
};

export default HandleQueryTable;