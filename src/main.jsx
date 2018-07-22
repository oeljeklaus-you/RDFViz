/**
 * This is the entry point to the app
 */
import './styles/main.less';

import React from 'react';
import {render} from 'react-dom';
import WelcomePage from './welcome';
import GalaxyPage from './galaxy/galaxyPage.jsx';
import { Router, Route, browserHistory } from 'react-router';
import Home from './home/home';

render(
  <Router history={browserHistory}>
    <Route path='/' component={Home}/>
    <Route path='/galaxy/:name' component={GalaxyPage} />
  </Router>,
  document.getElementById('app')
);
