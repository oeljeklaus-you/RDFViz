import React from 'react';
import Header from './header';
import Introduction from './introduction';
import AdvancedSearch from './advancedSearch';
import Filter from './filter';
import Search from './search';
import Visualization from './visualization';
export default require('maco').template(home, React);

function home() {
    return (
        <div>
            <Header />
            <div className="container">
                <Introduction />
                <section id="info">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-3">
                                <div id="accordion" role="tablist" aria-multiselectable="true" className="panel-group">
                                    {/* 左边3个组建 */}
                                    <AdvancedSearch />
                                    <Filter /> 
                                    <Search />
                                </div>
                            </div>
                            <div className="col-md-9">
                                {/* 右边展示界面 */}
                                <Visualization />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}