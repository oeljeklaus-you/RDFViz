import React from 'react';
var AdvancedSearch = React.createClass({

  getInitialState: function(){
    return {text:''};
  },

  render: function(){
    return (
      <div className="panel panel-default">
                <div id="headingAdvSearch" role="tab" className="panel-heading">
                  <h4 className="panel-title"><a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseAdvSearch" aria-expanded="true" aria-controls="collapseAdvSearch">SPARQL 查询</a></h4>
                </div>
                <div id="collapseAdvSearch" role="tabpanel" aria-labelledby="headingAdvSearch" className="panel-collapse collapse in">
                  <div className="panel-body">
                    <div className="form-group">
                      <label id="qqqq" htmlFor="txtSparql">SPARQL (construct)   </label>
                      <label className="dropdown">
                        <button data-toggle="dropdown" className="btn btn-default dropdown-toggle">语句<b className="caret"></b></button>
                        <ul className="dropdown-menu">
                          <li><a href="javascript:void(0);" onClick={this.handleClick.bind(this, 1)}>Query 1</a></li>
                          <li><a href="javascript:void(0);" onClick={this.handleClick.bind(this, 2)}>Query 2</a></li>
                          <li><a href="javascript:void(0);" onClick={this.handleClick.bind(this, 3)}>Query 3</a></li>
                          <li><a href="javascript:void(0);" onClick={this.handleClick.bind(this, 4)}>Query 4</a></li>
                          <li><a href="javascript:void(0);" onClick={this.handleClick.bind(this, 5)}>Query 5</a></li>
                        </ul>
                      </label>
                      <textarea id="txtSparql" rows="10" readOnly="true" className="form-control" value={this.state.text}></textarea>
                    </div>
                    <div className="form-group">
                      <button id="query" style={{width: '100%'}} className="btn btn-primary">查询</button>
                    </div>
                    <label>时间: </label>
                    <label id="timevalue"></label>
                    <label>ms</label>										
                    <br/>
                    <label>结果: </label>
                    <label id="resultsvalue"></label>
                    <label>条记录</label>
                    <div id="queryLoader" style={{textAlign: 'center'}} className="queryLoader"><img id="imgLoader1" src="images/loader.gif"/></div>
                    <div id="queryResult" className="queryResult"></div>
                  </div>
                </div>
              </div>
    );
  },

  handleClick: function(i){
    var txt='';
    switch(i){
      case 1:
        txt='SELECT ?x ?y ?z WHERE {\n?x \"Departure city code\" \"AMS\" .\n?x \"Arrival city code\" \"PAR\" .\n?x \"Operating airline\" ?y .\n?x \"Operating flight number\" ?z .\n}';
        break;
      case 2:
        txt='SELECT ?x ?y WHERE {\n?x \"Trip origin city\" \"DOH\" .\n?x \"Trip destination city\" \"CWL\" .\n?x \"Trip begin date local\" \"20130101\" .\n?x \"hasSegments\" ?y .\n}';
        break;
      case 3:
        txt='SELECT ?x ?y WHERE {\n?x \"hasTrips\" ?y .\n?y \"Trip destination city\" \"LAX\" .\n?y \"Trip marketing Airline\" \"KL_\" .\n?y \"Trip begin date local\" \"20130101\" .\n}'
        break;
      case 4:
        txt='SELECT ?x ?y ?z WHERE {\n?x \"hasTrips\" ?y .\n?y \"Trip origin city\" \"DOH\" .\n?y \"Trip destination city\" ?z .\n?y \"Trip operating Airline\" \"KL_\" .\n}';
        break;
      case 5:
        txt='SELECT ?x ?z WHERE {\n?x \"hasTrips\" ?z .\n?z \"Trip origin city\" \"DOH\" .\n?z \"Trip destination city\" \"CWL\" .\n?z \"Trip segment count\" \"02\" .\n}';
        break;
    }

    this.setState({text: txt});
  }
});
module.exports = AdvancedSearch;