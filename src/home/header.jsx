import React from 'react';
export default require('maco').template(header, React);

function header() {
    return (
        <div>
            <nav className="navbar navbar-fixed-top navbar-inverse">
                <div className="navbar-header">
                    <button type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" className="navbar-toggle collapsed"><span className="sr-only">Toggle navigation</span>				<span className="icon-bar"></span>				<span className="icon-bar"></span>				<span className="icon-bar"></span></button>			<a href="/" className="navbar-brand">大规模关联数据查询处理系统TripleBit</a>
                </div>
                <div id="navbar" className="collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                        <li className="active"><a href="/">主页</a></li>
                        <li><a href="/performance.html">性能对比</a></li>
                    </ul>
                </div>
            </nav> <br /> <br />
        </div>

    );
}
