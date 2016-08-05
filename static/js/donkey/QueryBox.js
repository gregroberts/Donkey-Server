var QueryBox = React.createClass({
	getInitialState: function() {
	    return {
			raw_data: "",
			data: [],
			handle_query: {},
			request_query: {},
			uuid: ""
	    };
	 },
	componentDidMount: function(){
		var   uuid = "{{uuid}}",
			get_data = {},
			data = {};
		if (uuid == "new") {
			var get_uid = hit_api('/query/new/', {handler: "XPATHROW"}, 'POST');
			var get_details = $.when(get_uid).then(function(data){
				uuid = data.uuid;
				return hydrate_query(uuid, 'queries');
			});
			var complete = $.when(get_details).then(function(ret_val){
				return ret_val;
			});
			$.when(complete).then(function(ret){
				console.log(uuid);
				this.setState(ret);
				this.setState({display_name: ret.uuid});
				if (this.state.data == undefined) {
					console.log('dataaaa')
					this.setState({data: []})
				}
			}.bind(this));
		} else {
			var complete = $.when(hydrate_query(uuid, 'library')).then(function(ret_val){
				return ret_val;
			});
			$.when(complete).then(function(ret){
				console.log(ret);
				this.setState(ret);
				this.setState({display_name: ret.name})
				if (this.state.data == undefined) {
					console.log('dataaaa')
					this.setState({data: []})
				}
				this.forceUpdate();
			}.bind(this));

		};

	},
	updateRequestQuery: function(data){
		this.setState({
			request_query:data
		});
		var data = $.when(hit_api('/query/fetch/'+this.state.uuid, data, 'POST')).then(function(data){
			this.setState({raw_data: data.data})
			return data.data;
		}.bind(this));
		;
		return data;
	},
	addNewCell: function(data){
		var vals = this.state.handle_query
		vals[data] = '';
		this.setState({handle_query: vals});
	},
	updateHandleQueryVal: function(key, val){
		var to_up = this.state.handle_query;
		to_up[key] = val;
		this.setState({handle_query: to_up});
	},
	submitHandleQuery: function(){
		var data = $.when(hit_api('/query/handle/'+this.state.uuid, this.state.handle_query, 'POST')).then(function(data){
			this.setState({data: data.data})
		}.bind(this));
	},
	delVal: function(val){
		var v = this.state.handle_query;
		delete v[val.key];
		this.setState({handle_query: v});
	},
	updateInfo: function (key, val) {
		if (key=='Name') {
			this.setState({name: val})
		} else if (key == 'Desc') {
			this.setState({description: val})
		} ;
	},
	saveQuery: function () {
		var data = $.when(
				hit_api('/query/save/'+this.state.uuid,
						{name: this.state.name,
						 description: this.state.description
						},
						'POST')
		).then(function(data){
			alert(data.message)
		})
	},
	render: function(){
		var loc = '{{prefix}}/donkey/edit_table_query/'+this.state.display_name;
		return (
			<Grid className="queryBox">
			<PageHeader>XPathRow Query Constructor <small>{this.state.name}</small></PageHeader>
			Link to this query: <a href={loc}>{loc}</a><br/>
			<hr/>
			Query Description: {this.state.description}
				<RequestQueryBox
					request_query={this.state.request_query}
					raw_data = {this.state.raw_data}
					onURLSubmit = {this.updateRequestQuery}
				/>
				<HandleQueryTable
					values={this.state.handle_query}
					addNewCell={this.addNewCell}
					updateVal={this.updateHandleQueryVal}
					performHandleQuery={this.submitHandleQuery}
					output_data={this.state.data}
					delVal={this.delVal}
				/>
				<SaveQueryTable
					updateInfo={this.updateInfo}
					saveQuery={this.saveQuery}
					name={this.state.name}
					description= {this.state.description}
				/>
			</Grid>
		)
	},
});
