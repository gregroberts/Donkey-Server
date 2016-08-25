import React, {Component} from 'react';
import {Grid, PageHeader, Row, Col} from 'react-bootstrap';

class Home extends Component {
	render() {
		return (
			<Grid>
				<PageHeader>Donkey Server</PageHeader>
				<Row>
					<Col>
						<h2>Construct A new Query</h2>
						<p>
							this is where the links will appear to the various ways to construct a new query.
						</p>
						<a href="/donkey/query/new" target="_blank">Construct a new HTML page query </a> - This is the most common type of query

						<hr />
						<a href="/donkey/list/" target="_blank">View Saved Queries </a>
						<hr/>
						<h2>Collectors</h2>
						<p>
							Collectors are a way of performing many of the same query, with different input parameters.
						</p>
						<a href="/donkey/collectors">View all Saved Collectors</a>
						<br/>
						<a href="/donkey/collectors/new">Start a new Collector</a>
					</Col>
				</Row>
			</Grid>
		)
	}
};



export default Home;