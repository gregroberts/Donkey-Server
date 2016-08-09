

var OutputTableRow = React.createClass({
	getInitialState: function(){
		return {val:[]};
	},
	shouldComponentUpdate: function(newProps) {
		this.setState({val:newProps.value}, function(d){
			this.forceUpdate();
		}.bind(this));
		return true;
	},
	render: function(){
		return <tr>{
			Object.keys(this.state.val).map(function (key, index) {
			return <OutputTableCell value={this.state.val[key]} key={index} />;
		}.bind(this))
	}</tr>;
	}
});

 var OutputTableCell = React.createClass({
	getInitialState: function(){
		return {value:''};
	},
	shouldComponentUpdate: function (newProps) {
		this.setState(newProps);
		this.forceUpdate();
	},
	render: function(){
		return (
			<td>{this.state.value}</td>
		);
	}
});

module.exports = OutputTableCell;
