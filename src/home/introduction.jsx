import React from 'react';
export default require('maco').template(introduction, React);

function introduction() {
    return (
        <div className="page-header">
            <h4><strong>TripleBit是本中心研发的关联数据存储及查询的数据库系统，可处理Billion级规模的图数据。<br />与国际上同类系统，如RDF-3X、MonetDB等相比，实现了几十倍的性能提升。
            					<strong></strong></strong></h4>
        </div>
    );
}