import React from 'react';
import {Component} from 'react';
import {Row, Button, Panel, Col, 
	FormGroup, FormControl, InputGroup,
	ControlLabel,
	Table, } from 'react-bootstrap';

class SaveQueryTable extends Component{
	constructor(props) {
		super(props);
		this.updateName = this.updateName.bind(this)
		this.updateDesc = this.updateDesc.bind(this)
		this.state = {
			open: false,
			name:'',
			description:''
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
				description: newProps.description
			}, function(){
			this.setState({
					name: newProps.name,
					description: newProps.description
			});
			this.forceUpdate()
		});
		return true;
	}
	render(){
		return(
			<Row>
				<Button onClick={ ()=> this.setState({ open: !this.state.open })} bsSize="small">
							 Collapse Query Information
				</Button>
				<Panel header="Query Information"  collapsible expanded={this.state.open}>
					<FormGroup className="SaveQueryTable" >
						<ControlLabel>Name</ControlLabel>
							<FormControl type="text" ref="name" onChange={this.updateName} value={this.state.name}/>
						<ControlLabel>Description</ControlLabel>
							<FormControl type="text" ref="description" onChange={this.updateDesc} value={this.state.description}/>
					</FormGroup>
					<Button onClick={this.props.saveQuery} bsStyle="info">Save</Button>
				</Panel>
			</Row>
		)
	}
};

export default SaveQueryTable;

