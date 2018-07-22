import React from 'react';
import { createHashHistory } from 'history';
export const history = createHashHistory()

export default class Search extends React.Component {
  constructor(props){
    super(props);
    this.state = {value: ''};
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleClick(event){
    event.preventDefault();
    if(this.state.value!==''){
      //browserHistory.push('/galaxy/'+this.state.value+'?l=1');
      history.push('/galaxy/'+this.state.value+'?l=1');
    }
  }

  render(){
    return (
      <div className="panel panel-default">
        <div className="panel-heading" role="tab" id="headingSearch">
          <h4 className="panel-title">
            <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSearch" aria-expanded="false" aria-controls="collapseSearch">
              图加载</a>
          </h4>
        </div>
        <div id="collapseSearch" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSearch">
          <div className="panel-body">
            <div className="form-group">
              <label htmlFor="txtEndPoint">数据集：  </label>
              <select className="form-control" value={this.state.value} onChange={this.handleChange.bind(this)}>
                <option value='' style={{display: 'none'}}>请选择</option>
                <option value='data'>Bower</option>
                <option value='composer'>Composer</option>
                <option value='rubygems'>RubyGems</option>
                <option value='npm'>npm</option>
                <option value='gosearch'>Go Search</option>
                <option value='python'>Python</option>
                <option value='nuget'>NuGet</option>
                <option value='cran'>R Language</option>
                <option value='debian'>Debian</option>
              </select>
            </div>
            <div className="form-group">
              <button className="btn btn-primary" onClick={this.handleClick.bind(this)} style={{ width: '100%' }}>Go</button>
            </div>
            <div id="queryLoader" className="queryLoader" style={{ textAlign: 'center' }}>
              <img id="imgLoader1" src="images/loader.gif" />
            </div>
            <div id="queryResult" className="queryResult"></div>
          </div>
        </div>
      </div>
    );
  }
}


