import React from 'react';
import {Component} from 'react';
import {Row, Button, Panel, Col, 
	FormGroup, FormControl, InputGroup,
	ControlLabel,
	Table} from 'react-bootstrap';
import InputTableCell from './InputTableCell.jsx';

class SaveQueryTable extends Component{
	constructor(props) {
		super(props);
		this.updateName = this.updateName.bind(this);
		this.updateDesc = this.updateDesc.bind(this);
		this.delVal = this.delVal.bind(this);
		this.makeNewParam = this.makeNewParam.bind(this);
		this.updateVal = this.updateVal.bind(this);
		this.makeNewParam = this.makeNewParam.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.state = {
			open: false,
			name:'',
			description:'',
			parameters: {}
		}
	}
	updateName(e) {
		this.props.updateInfo('Name', e.target.value);
	}
	updateDesc(e) {
		this.props.updateInfo('Desc', e.target.value);
	}
	shouldComponentUpdate(newProps){
		this.setState({
				name: newProps.name,
				description: newProps.description,
				parameters:newProps.parameters
			}, function(){
			this.setState({
					name: newProps.name,
					description: newProps.description,
					parameters:newProps.parameters
			});
			this.forceUpdate()
		});
		return true;
	}

	componentDidMount(){
		this.setState({
			name:this.props.name,
			description: this.props.description,
			parameters:this.props.parameters
		})
	}
	delVal(val){
		var v = this.state.parameters;
		delete v[val.key];
		this.setState({parameters: v});		
	}
	updateVal(key, val){
		var curr_keys = this.state.parameters;
		curr_keys[key]= val;
		this.setState({parameters: curr_keys});
		this.props.updateParams(key, val);
	}	
	makeNewParam(){
		var newVal = prompt("Enter a name for the new Parameter", "param1");
		if (newVal != null) {
			var curr_keys = this.state.parameters;
			curr_keys[newVal]="";
			this.setState({parameters: curr_keys});
		}	
	}
	render(){
		var keys = Object.keys(this.state.parameters).sort();
		var values= this.state.parameters;
		return(
			<Row>
				<h3>Basic Information</h3>
				<FormGroup className="SaveQueryTable">
					<ControlLabel>Name</ControlLabel>
						<FormControl type="text" ref="name" onChange={this.updateName} value={this.state.name}/>
					<ControlLabel>Description</ControlLabel>
						<FormControl type="text" ref="description" onChange={this.updateDesc} value={this.state.description}/>
				</FormGroup>
				<hr/>
				<h3>Parameters</h3>
				<Table striped bordered condensed hover>
					<thead>
						<tr>
							<th>Parameter Name</th>
							<th>Parameter Value</th>
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
									<td><Button bsSize="small" onClick={() => this.delVal({key})} >x</Button></td>
								</tr>
							}
						}.bind(this))
					}
					</tbody>
				</Table>
				<Button onClick={this.makeNewParam}> Add New Parameter</Button>
				<hr/>
				<Button onClick={this.props.saveQuery} bsStyle="info">Save</Button>
			</Row>
		)
	}
};

export default SaveQueryTable;

