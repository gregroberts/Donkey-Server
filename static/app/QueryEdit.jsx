import React, {Component} from 'react';
import {PageHeader, Grid, Tabs, Tab, ControlLabel, FormControl, ButtonGroup, Radio} from 'react-bootstrap';
import RequestQueryBox from './RequestQueryBox.jsx';
import HandleQueryTable from './HandleQueryTable.jsx';
import SaveQueryTable from './SaveQueryTable.jsx'
import jQuery from 'jquery';
import api_stuff from './api_functions.jsx';

var $ = jQuery;
var hit_api = api_stuff.hit_api;
var hydrate_query = api_stuff.hydrate_query;


class QueryEdit extends Component {
	constructor(props) {
		super(props);
		var uuid = props.params.uuid;
		var state = {
			uuid: uuid
		}
		if (uuid == "new") {
			state[isNew] = true;
			var get_uid = hit_api('/query/new/', {handler: "XPATHROW"}, 'POST');
			var get_details = get_uid.done(function(data){
				uuid = data.uuid;
				return hydrate_query(uuid, 'queries');
			});
			var complete = $.when(get_details).then(function(ret_val){
				return ret_val;
			});
			$.when(complete).then(function(ret){

			}.bind(this));
		} else {
			state[isNew] = false
			var complete = $.when(hydrate_query(uuid, 'library')).then(function(ret_val){
				return ret_val;
			});
			$.when(complete).then(function(ret){
				Object.assign(state, ret)
				state[display_name] ret.uuid;
				if (this.state.data == undefined) {
					state[data]= [];
				}

				if (state.parameters.constructor==Array){
					var prop = {};
					for (var i = state.parameters.length - 1; i >= 0; i--) {
						prop[state.parameters[i]]='';
					}
					state[parameters] = prop;
				}
			}.bind(this));
		};
		this.state = state;
	}
	updateRequestQuery(newVal){}
	submitRequestQuery(){}
	updateGrabber(){}

	updateHandleQuery(newVal){}
	submitHandleQuery(){}
	updateHandler(){}	


	updateParams(newVal){}

	updateInfo(name, description){}

	saveQuery(){}

	render(){}
}


export default QueryEdit;