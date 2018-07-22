import React from 'react';
import scene from './store/scene.js';

module.exports = require('maco')(loadingIndicator, React);

function loadingIndicator(x) {
  var nodeCount=0, linkCount=0;
  var flag = false;
  x.render = function() {
    return  flag?<div  className='label about h4'>nodes:{nodeCount}, links:{linkCount}</div>:null;
  };

  x.componentDidMount = function() {
    scene.on('about', about);
  };

  x.componentWillUnmount = function () {
    scene.off('about', about);
  };
  

  function about(progress){
    nodeCount = progress.nodeCount;
    linkCount = progress.linkCount;
    flag = true;
    x.forceUpdate();
  }
}

    