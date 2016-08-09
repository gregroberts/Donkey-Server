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
						this is where the links will appear to the various ways to construct a new query.<br/><br/>
						<a href="/donkey/query/new" target="_blank">Construct a new HTML page query </a> - This is the most common type of query

						<hr />
						<a href="/donkey/list/" target="_blank">View Saved Queries </a>
					</Col>
				</Row>
			</Grid>
		)
	}
};


export default Home;