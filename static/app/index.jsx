import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import Home from './home.jsx';
import Query from './query.jsx';
import QueryList from './QueryList.jsx';
import RunQuery from './RunQuery.jsx';
import CollectorList from './CollectorList.jsx';
import Collbits from './CollectorEdit.jsx';
import GrabberView from './GrabberView.jsx';
import GrabberList from './GrabberList.jsx';
var CollectorEdit = Collbits.CollectorEdit;
var JobResult = Collbits.JobResult;


ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/donkey" component={Home} />
      <Route path="/donkey/list/" component={QueryList} />
      	<Route path="/donkey/query/:uuid" component={Query} />
      	<Route path="/donkey/run_query/:uuid" component={RunQuery} />
      	<Route path="/donkey/collectors" component={CollectorList} />
      	<Route path="/donkey/collectors/:id" component={CollectorEdit} />
      <Route path="/donkey/grabbers/:grabber" component={GrabberView} />
      <Route path="/donkey/grabbers" component={GrabberList} />
    </Router>
  ),
  document.getElementById('core')
); 