import React from 'react';
import {Grid,Row,Panel} from 'react-bootstrap';
import {Component} from 'react';
import api_stuff from './api_functions.jsx';
var hit_api = api_stuff.hit_api;
var hydrate_query = api_stuff.hydrate_query;


class GrabberList extends Component{
	constructor(props) {
		super(props);
		this.state = {
			data:{}
		}
	}
	componentDidMount(){
		console.log(this.state.grabber);
		hit_api('/query/grabber/all', null, 'GET').then(function (data) {
			this.setState({data: data});
		}.bind(this))		

	}
	render(){
		var gr = this.state.data;
		console.log(gr);
		return(
			<Grid>
			<Row>
				<Panel header="Information about available Grabbers">
				{
					Object.keys(gr).map(function (key,index) {
						var inf = gr[key];
						var link = '/donkey/grabbers/'+key;
						return(
							<div key={index}>
								<h2>{key}</h2>
								<p>{inf.short_description}</p>
								<a href={link} target="_blank">More Information</a>
								<hr />
							</div>
						) 
					})
				}
				</Panel>
			</Row>
			</Grid>
		)

	}
}

export default GrabberList;