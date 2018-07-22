import React from 'react';
export default require('maco').template(visualization, React);

function visualization() {
    return (
        <div className="panel panel-default" id="parent">
        <div className="panel-heading">
          <h3 className="panel-title">展示</h3>
          <ul className="list-inline panel-actions">
            <li>
              <a id="panel-fullscreen" href="#" role="button" title="Toggle fullscreen">
                <i className="glyphicon glyphicon-resize-full glyphicon-fullscreen"></i>
              </a>
            </li>
          </ul>
        </div>
        <div align="center" className="panel-body" id="child">
          <ul role="tablist" className="nav nav-tabs">
            <li role="presentation" className="active">
              <a href="#tabsvg" aria-controls="tabsvg" role="tab" data-toggle="tab">图可视化</a>
            </li>
            <li role="presentation">
              <a href="#tabrdf" aria-controls="tabrdf" role="tab" data-toggle="tab">RDF三元组</a>
            </li>
            <li role="presentation">
              <a href="#tabresult" aria-controls="tabresult" role="tab" data-toggle="tab">查询结果</a>
            </li>
          </ul>
          <div className="tab-content">
            <div id="tabsvg" role="tabpanel" className="tab-pane active">
              <div id="svg-body" className="panel-body"></div>
            </div>
            <div id="tabrdf" role="tabpanel" className="tab-pane">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Subject</th>
                    <th>Predicate</th>
                    <th>Object</th>
                  </tr>
                </thead>
                <tbody id="tblBodyRDF">
                  <tr>
                    <td>0</td>
                    <td>:s</td>
                    <td>:p</td>
                    <td>:o</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div id="tabresult" role="tabpanel" className="tab-pane">
              <table id="tabrs" className="table table-hover"></table>
            </div>
          </div>
        </div>
      </div>
    );
}