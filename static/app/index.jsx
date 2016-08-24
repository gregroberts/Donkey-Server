import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import Home from './home.jsx';
import Query from './query.jsx';
import List from './list.jsx';
import RunQuery from './RunQuery.jsx';
import CollectorList from './CollectorList.jsx'
ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/donkey" component={Home} />
      <Route path="/donkey/list/" component={List} />
      	<Route path="/donkey/query/:uuid" component={Query} />
      	<Route path="/donkey/run_query/:uuid" component={RunQuery} />
      	<Route path="/donkey/collectors" component={CollectorList} />
    </Router>
  ),
  document.getElementById('core')
); 