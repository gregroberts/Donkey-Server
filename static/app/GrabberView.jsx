import React from 'react';
import {Grid,Row,Panel} from 'react-bootstrap';

import Remarkable from 'remarkable';
import {Component} from 'react';
import api_stuff from './api_functions.jsx';
var hit_api = api_stuff.hit_api;
var hydrate_query = api_stuff.hydrate_query;


class GrabberView extends Component{
	constructor(props) {
		super(props);
		this.rawMarkup = this.rawMarkup.bind(this);
		this.state = {
			grabber:props.params.grabber,
			info:''
		}
	}
	rawMarkup() {
		var md = new Remarkable();
		var rawMarkup = md.render(this.state.info.toString());
		return { __html: rawMarkup };
	}
	componentDidMount(){
		console.log(this.state.grabber);
		hit_api('/query/grabber/'+this.state.grabber, null, 'GET').then(function (data) {
			this.setState({info: data});
		}.bind(this))		

	}
	render(){
		var md = new Remarkable();
		var head = "Info page for "+this.state.grabber+" Grabber";
		return(
			<Grid>
			<Row>
				<Panel header={head}>
				<span dangerouslySetInnerHTML={this.rawMarkup()} />
				</Panel>
			</Row>
			</Grid>
		)

	}
}

export default GrabberView;