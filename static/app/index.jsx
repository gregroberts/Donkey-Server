import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import Home from './home.jsx';
import Query from './query.jsx';
import List from './list.jsx';

ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/donkey" component={Home} />
      <Route path="/donkey/list/" component={List} />
      	<Route path="/donkey/query/:uuid" component={Query} />
    </Router>
  ),
  document.getElementById('core')
); 