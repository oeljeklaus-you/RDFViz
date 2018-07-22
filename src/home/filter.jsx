import React from 'react';
export default require('maco').template(Filter, React);

function Filter() {
    return (
        <div className="panel panel-default">
                  <div id="headingUsrPref" role="tab" className="panel-heading">
                    <h4 className="panel-title"><a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseUsrPref" aria-expanded="false" aria-controls="collapseUsrPref" className="collapsed">筛选定制</a></h4>
                  </div>
                  <div id="collapseUsrPref" role="tabpanel" aria-labelledby="headingUsrPref" className="panel-collapse collapse">
                    <div className="panel-body" id="tongyong"><strong>通用特性</strong>
                      
                    </div>
                    <div className="panel-body"><strong>谓词过滤</strong>
                      <div id="tblProperties">
                        <div className="checkbox">
                          <label title="rdf:type">
                            <input type="checkbox" value="" checked=""/>rdf:type
                          </label>
                        </div>
                        <div className="checkbox">
                          <label title="rdfs:subClassOf">
                            <input type="checkbox" value="" checked=""/>rdfs:subClassOf
                          </label>
                        </div>
                        <div className="checkbox">
                          <label title="rdfs:seeAlso">
                            <input type="checkbox" value="" checked=""/>rdfs:seeAlso
                          </label>
                        </div>
                        <div className="checkbox">
                          <label title="owl:sameAs">
                            <input type="checkbox" value="" checked=""/>owl:sameAs
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

    );
}