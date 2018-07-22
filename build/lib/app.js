// CONFIG - BEGIN *****************************
var t= '<div class="checkbox"><label><input id="chkToDisplayLabel" type="checkbox" onclick="toDisplayLabel(this);" checked="" />显示标签</label></div>'+
    '<div class="checkbox"><label><input id="chkToDisplayAllText" type="checkbox" onclick="toDisplayAllText(this);" checked="" />显示所有文字</label></div>'+
    '<div class="checkbox"><label><input id="chkToMouseOver" type="checkbox" onclick="toMouseOver(this);" checked="" />鼠标悬停</label></div>';                                  
$("#tongyong").html(t);
$("#query").attr("onclick","queryGraph(true)");

var hasQueryResult=true;
var querys;
if(document.getElementById("svg-body")!==undefined){
    document.getElementById("svg-body").style.height = document.documentElement.clientHeight*0.65 + "px";
    var svgW = document.getElementById("svg-body").clientWidth;
    var svgH = document.getElementById("svg-body").clientHeight;
}

var ignoredProps = [];
var labels = [];

var isToDisplayLabel = true;
var isToMerge = true;
var isToIgnoreTransitive = true;
var isToDisplayAllText=true;
var isToMouseOver=true;

var METADATA =[];
var color=d3.scale.category10();
var varlist=[];
var legendRectSize = 18;                                  
var legendSpacing = 4;
var nominal_stroke = 1.5;
var max_stroke = 4.5;
var nominal_text_size = 10;
var max_text_size = 24; 
var focus_node=null;

var triples = [
    {subject:"ex:ThaiLand", 	predicate:"ex:hasFood", 	object:"ex:TomYumKung"},
  {subject:"ex:TomYumKung", 	predicate:"ex:isFoodOf", 	object:"ex:ThaiLand"},
    {subject:"ex:TomYumKung", 	predicate:"rdf:type", 		object:"ex:SpicyFood"},
    {subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:shrimp"},
    {subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:chilly"},
  {subject:"ex:TomYumKung", 	predicate:"ex:requires", 	object:"ex:chilly"},
  {subject:"ex:TomYumKung", 	predicate:"ex:hasSpicy", 	object:"ex:chilly"},
    {subject:"ex:TomYumKung", 	predicate:"ex:includes", 	object:"ex:lemon"},
    {subject:"ex:lemon", 		predicate:"ex:hasTaste", 	object:"ex:sour"},
    {subject:"ex:chilly", 		predicate:"ex:hasTaste", 	object:"ex:spicy"}
];

var queryResult=[];
// CONFIG - END *****************************

function L(id){
    var l = labels[id];
    if(l==null) l=id;
    return l;
}

function checkIsTransitive(subj,pred,obj){
    var res = false;

    var sMid = [];
    var oMid = [];
    triples.forEach(function(triple){
        if(pred==triple.predicate){
            if(subj == triple.subject) sMid.push(triple.object);
            if(obj  == triple.object ) oMid.push(triple.subject);
        }
    });

    if(sMid.length>0 && oMid.length>0){
        oMid.filter(function(n){
            if (sMid.indexOf(n)>-1){
                res = true;
                return res;
            }
        });
    }
    return res;
}

function filterNodesById(nodes,id){
    if(isToMerge){
        return nodes.filter(function(n) { return L(n.id) === L(id); }); //Try to merge node
    }else{
        return nodes.filter(function(n) { return n.id === id; });
    }
}

function filterNodesByType(nodes,value){
    return nodes.filter(function(n) { return n.type === value; });
}

function filterUpdate(){
    graph = triplesToGraph(triples, graph);
    update();
}
String.prototype.endWith=function(str){
    if(str==null||str==""||this.length==0||str.length>this.length)
      return false;
    if(this.substring(this.length-str.length)==str)
      return true;
    else
      return false;
    return true;
}

function triplesToGraph(triples, xGraph){

    svg.html("");
    
    var graph={nodes:[], links:[], triples:[]};
    
    //根据triples初始化graph
    triples.forEach(function(triple){
            var subGroup=null,preGroup=null,objGroup=null;
            
            if(triple.subject.split("###").length===2){
                var subjId = triple.subject.split("###")[0];
                var subGroup=triple.subject.split("###")[1];
            }else{
                var subjId = triple.subject;
            }
            
            if(triple.predicate.split("###").length===2){
                var predId = triple.predicate.split("###")[0];
                var preGroup=triple.predicate.split("###")[1];
            }else{
                var predId = triple.predicate;
            }
            
            if(triple.object.split("###").length===2){
                var objId = triple.object.split("###")[0];
                var objGroup=triple.object.split("###")[1];
            }else{
                var objId = triple.object;
            }
            

            // Remove transitive
            if(isToIgnoreTransitive){
                if(checkIsTransitive(subjId, predId, objId)){
                    return;
                }
            }

            if($.inArray(predId, ignoredProps) === -1 && subjId!=objId){
            
                // --- Subject side ---
                var toAddSubj = false;

                var xSubjNode = filterNodesById(xGraph.nodes, subjId)[0];
                var subjNode  = filterNodesById(graph.nodes, subjId)[0];
                
                if(subjNode==null){
                    if(subGroup!=null){
                        subjNode = {id:subjId, label:subjId, weight:1, type:"node",group:varlist.indexOf(subGroup),degree:0};
                    }else{
                        subjNode = {id:subjId, label:subjId, weight:1, type:"node",group:10,degree:0};
                    }
                    
                    
                    if(xSubjNode!=null){
                        subjNode.x = xSubjNode.x;
                        subjNode.y = xSubjNode.y;
                    }

                    toAddSubj=true;
                    //graph.nodes.push(subjNode);
                }

                // --- Object side ---
                var toAddObj = false;

                var xObjNode  = filterNodesById(xGraph.nodes, objId)[0];
                var objNode   = filterNodesById(graph.nodes.concat(subjNode), objId)[0];

                if(objNode==null){
                    if(objGroup!=null){
                        objNode = {id:objId, label:objId, weight:1, type:"node",group:varlist.indexOf(objGroup),degree:0};
                    }else{
                        objNode = {id:objId, label:objId, weight:1, type:"node",group:10,degree:0};
                    }
                    
                    
                    if(xObjNode!=null){
                        objNode.x = xObjNode.x;
                        objNode.y = xObjNode.y;
                    }
                    
                    toAddObj=true;
                    //graph.nodes.push(objNode);
                }


                // --- Property side ---
                subjId = subjNode.id;
                objId = objNode.id;
                
                var trId = subjId + predId + objId ; 
                if(isToMerge) trId = L(subjId) + L(predId) + L(objId) ; //Try to merge nodes
                var xPredNode = filterNodesById(xGraph.nodes, trId)[0];
                var predNode  = filterNodesById(graph.nodes, trId)[0];
                
                if(predNode == null && subjId!==objId){

                    predNode = {id:trId, pid:predId , label:predId, weight:1, type:"pred"} ;
                    
                    if(xPredNode !=null){
                        predNode.x = xPredNode.x;
                        predNode.y = xPredNode.y;
                    }
                
                    if(toAddSubj) graph.nodes.push(subjNode);
                    if(toAddObj) graph.nodes.push(objNode);
                    graph.nodes.push(predNode);
                    
                    var blankLabel = "";
                    
                    graph.links.push({source:subjNode, target:predNode, predicate:blankLabel, weight:1});
                    graph.links.push({source:predNode, target:objNode, predicate:blankLabel, weight:1});
                    
                    graph.triples.push({s:subjNode, p:predNode, o:objNode});
                }
            }
    });
    return graph;
}


function update(){
    // Init Layout
    svgW = $("svg").parent().width() ;
    force = d3.layout.force().size([svgW, svgH]);
    var rect=svg.append("rect")
    .attr("class", "overlay")
    .attr("width", "100%")
    .attr("height", "100%"); 
    if(varlist!=null){
        var legend = svg.selectAll('.legend')                     
                          .data(varlist)                                   
                          .enter()                                               
                          .append('g')                                            
                          .attr('class', 'legend')                                
                          .attr('transform', function(d, i) {                     
                                                var height = legendRectSize + legendSpacing;          
                                                var offset =  height  / 2;    
                                                var horz = legendSpacing;                       
                                                var vert = i * height + offset;                        
                                                return 'translate(' + horz + ',' + vert + ')';        
                                              });
          legend.append('rect')                                     
              .attr('width', legendRectSize)                          
              .attr('height', legendRectSize)                         
              .style('fill', function(d){return color(varlist.indexOf(d));})                                   
              .style('stroke', "#999");                                
      
        legend.append('text')                                     
              .attr('x', legendRectSize + legendSpacing)              
              .attr('y', legendRectSize - legendSpacing)              
              .text(function(d) { return d; });
    }
                            
  
    
    var gDraw=svg.append("g");
    var zoom=d3.behavior.zoom().scaleExtent([0.2, 5]);
    
    

    // ==================== Add Marker ====================
    
     gDraw.append("svg:defs")
          .append("svg:marker")
        .attr("id", "end")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX",11)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .attr("stroke","#999")
        .attr("fill","rgba(124, 240, 10, 0)")
        .append("svg:path")
        .attr("d","M0,-5L10,0L0,5")
        ; 
     //blue marker   
     gDraw.append("svg:defs")
          .append("svg:marker")
        .attr("id", "blue")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX",11)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .attr("stroke","blue")
        .attr("fill","rgba(124, 240, 10, 0)")
        .append("svg:path")
        .attr("d","M0,-5L10,0L0,5")
        ;
        
    // ==================== Add Links ====================
     var links = gDraw.selectAll(".link")
                        .data(graph.triples)
                        .enter()
                        .append("path")
                        .attr("marker-end", "url(#end)")
                        .attr("class", "link")
                    ;
                            
    // ==================== Add Link Names =====================
    var linkTexts = gDraw.selectAll(".link-text")
                            .data(graph.triples)
                        .enter()
                        .append("text")
                        .attr("class", "link-text")
                        .text( function (d) { if(isToDisplayLabel) return L(d.p.label); else return d.p.pid;  })
                        ;

        linkTexts.append("title")
                .text(function(d) { if(isToDisplayLabel) return d.p.pid; else return L(d.p.label); });
                
    // ==================== Add Node Names =====================
    var nodeTexts = gDraw.selectAll(".node-text")
                        .data(filterNodesByType(graph.nodes, "node"))
                        .enter()
                        .append("text")
                        .attr("class", "node-text")
                        .text( function (d) { if(isToDisplayLabel) return L(d.label); else return d.id; })
                        ;

        nodeTexts.append("title")
                .text(function(d) { if(isToDisplayLabel) return d.id; else return L(d.label); });
                
                
        if(!isToDisplayAllText){
            nodeTexts.style("visibility", "hidden");
            linkTexts.style("visibility", "hidden");
        }
    
    
    // ==================== Add Node =====================
    graph.links.forEach(function(d){
        d.source.degree+=1;
        d.target.degree+=1;
    });
    var nodes = gDraw.selectAll(".node")
                        .data(filterNodesByType(graph.nodes, "node"))
                        .enter()
                        .append("g")
                        .attr("class", "node")
                        .call(force.drag);
                        
    var circle=nodes.append("circle")
                    .attr("r",function(d){return d.degree*1.3+8;})
                    .attr("fill",function(d){return color(d.group);});
    
    nodes.on("dblclick.zoom",function(d){
        d3.event.stopPropagation();
        var dcx=(svgW/2-d.x*zoom.scale());
        var dcy=(svgH/2-d.y*zoom.scale());
        zoom.translate([dcx,dcy]);
        gDraw.attr("transform","translate("+dcx+","+dcy+")scale("+ zoom.scale() + ")");
    }); 
    
    zoom.on("zoom",function(){
        var stroke = nominal_stroke;
        if (nominal_stroke*zoom.scale()>max_stroke) stroke = max_stroke/zoom.scale();
        links.style("stroke-width",stroke);
        circle.style("stroke-width",stroke);
        var text_size = nominal_text_size;
        if (nominal_text_size*zoom.scale()>max_text_size) text_size = max_text_size/zoom.scale();
        nodeTexts.style("font-size",text_size + "px");
        linkTexts.style("font-size",text_size + "px");

        gDraw.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");	
    });
    
    nodes.on("mousedown",function(d){
        d3.event.stopPropagation();
    })
    
    svg.call(zoom);
    
    function linkArc(d) {
        var sourceX = d.s.x;
        var sourceY = d.s.y;
        var targetX = d.o.x;
        var targetY = d.o.y;
    
        var theta = Math.atan((targetX - sourceX) / (targetY - sourceY));
        var phi = Math.atan((targetY - sourceY) / (targetX - sourceX));
    
        var sinTheta = (d.s.degree*1.3+8) * Math.sin(theta);
        var cosTheta = (d.s.degree*1.3+8) * Math.cos(theta);
        var sinPhi = (d.o.degree*1.3+8) * Math.sin(phi);
        var cosPhi = (d.o.degree*1.3+8) * Math.cos(phi);
    
        if (d.o.y > d.s.y) {
            sourceX = sourceX + sinTheta;
            sourceY = sourceY + cosTheta;
        }
        else {
            sourceX = sourceX - sinTheta;
            sourceY = sourceY - cosTheta;
        }
    
        if (d.s.x > d.o.x) {
            targetX = targetX + cosPhi;
            targetY = targetY + sinPhi;    
        }
        else {
            targetX = targetX - cosPhi;
            targetY = targetY - sinPhi;   
        }
    
        return "M" 	+ d.s.x + "," + d.s.y
                                + "S" + d.p.x + "," + d.p.y
                                + " " + targetX + "," + targetY;
    }

    // ==================== Force ====================
    force.on("tick", function() {
        nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .attr("cx", function(d) { return d.x; })
               .attr("cy", function(d) { return d.y; })
               ;
        
        links.attr("d",linkArc);
                           
        nodeTexts.attr("x", function(d) { return d.x+d.degree*1.3+8 ; })
                .attr("y", function(d) { return d.y + 3; })
                ;
            

        linkTexts
            .attr("x", function(d) { return 4 + (d.s.x + d.p.x + d.o.x)/3  ; })
            .attr("y", function(d) { return 4 + (d.s.y + d.p.y + d.o.y)/3 ; })
            ;
    });
    
    
    // ==================== Run ====================
    force
      .nodes(graph.nodes)
      .links(graph.links)
      .charge(-300)
      .linkDistance(10)
      .start()
      ;
      
      
    var linkedByIndex={};
    
    graph.triples.forEach(function(d){
        linkedByIndex[d.s.index+","+d.o.index]=true;
    });
    
    function isConnected(a,b){
        return linkedByIndex[a.index+","+b.index] || linkedByIndex[b.index+","+a.index]||a===b;
    }
    
    var mouseOverFunction=function(d){
            nodes.style("opacity",function(o){return isConnected(o,d)?1.0:0.2;})
                .style("stroke",function(o){return isConnected(o,d)?"blue":"white";})
                .style("fill",function(o){if(isConnected(o,d)){return color(o.group);}else{return "#000";}})
                ;
            
            links.style("opacity", function(o){return o.s===d||o.o===d?1:0.2;})
                .style("stroke",function(o){return o.s===d||o.o===d?"blue":"#999";})
                .style("marker-end", function(o){return o.s===d||o.o===d?"url(#blue)":"url(#end)"})
                ;
                
            nodeTexts.style("visibility",function(o){return isConnected(o,d)?"visible":"hidden";})
                    .style("font-weight",function(o){return 	isConnected(o,d)?"bold" : "normal";})
                    ;
            linkTexts.style("visibility",function(o){return o.s===d||o.o===d?"visible":"hidden";})
                    .style("font-weight",function(o){return o.s===d||o.o===d?"bold" : "normal";})
                    ;
                
    };
    
    var mouseOutFunction =function(d){
        nodes.style("fill",function(o){return color(o.group);})
            .style("opacity",1.0)
            .style("stroke","white")
            ;
        
        links.style("opacity", 1.0)
            .style("marker-end", "url(#end)")
            .style("stroke","#999")
            ;
        nodeTexts.style("font-weight","normal");
        linkTexts.style("font-weight","normal");
        
        if(!isToDisplayAllText){
            nodeTexts.style("visibility","hidden");
            linkTexts.style("visibility","hidden");
        }else{
            nodeTexts.style("visibility","visible");
            linkTexts.style("visibility","visible");
        }
            
    };
    
    if(isToMouseOver){
        nodes.on("mouseover", mouseOverFunction)
            .on("mouseout",mouseOutFunction);
    }
    
    
}

// ----------- QUERY --------------
function afterQuery(){
    var preds = [];
    var counts = [];

    var chks = "";

    var tblProps = $("#tblProperties");
    tblProps.empty();

    triples.forEach(function(triple){
        var pred = triple.predicate;
        if($.inArray(pred, preds) === -1) { 
            preds.push(pred);
            counts[pred]=1;
        }else{
            counts[pred]++;
        }
    });
    
    preds.sort();
    
    preds.forEach(function(pred){
        tblProps.append(
            "<div class='checkbox'>"
                + "<label title='"+ pred +"'>"
                    + "<input id='chkProp' onchange='filterProperties();' type='checkbox' checked/>" 
                    + L(pred) 
                + "</label>"
                + "<span class='badge'>" + counts[pred] + "</span> "
            + "</div>");
    });

}

function filterProperties(){
    ignoredProps = [];
    var chkProps = $( "#chkProp:not(:checked)" ).parent();
    chkProps.each(function(i){
        ignoredProps.push($(chkProps[i]).attr("title"));
    });


    filterUpdate();
}

function toDisplayLabel(elem){
    isToDisplayLabel = $(elem).is(":checked");
    filterUpdate();
}

function toMergeNodes(elem){
    isToMerge = $(elem).is(":checked");
    filterUpdate();
}

function toIgnoreMetaOnto(elem){
    isToIgnoreMetaOnto = $(elem).is(":checked");
    filterUpdate();
}

function toIgnoreMetaProperty(elem){
    isToIgnoreMetaProperty = $(elem).is(":checked");
    filterUpdate();
}

function toIgnoreTransitive(elem){
    isToIgnoreTransitive = $(elem).is(":checked");
    filterUpdate();
}

function toIgnoreTypeHierarchy(elem){
    isToIgnoreTypeHierarchy = $(elem).is(":checked");
    filterUpdate();
}

function toIgnoreWeb(elem){
    isToIgnoreWeb = $(elem).is(":checked");
    filterUpdate();
}
function toDisplayAllText(elem){
    console.log("sdadsadasd");
    isToDisplayAllText=$(elem).is(":checked");
    filterUpdate();
}
function toMouseOver(elem){
    isToMouseOver=$(elem).is(":checked");
    filterUpdate();
}


function generateRdfTable(triples){
    /* triples.sort(function(a, b) {
        return a.vw - b.vw;
    }); */
    
    var rdfTBody = $("#tblBodyRDF");
    rdfTBody.empty();
    var index=0;
    triples.forEach(function(triple){
        var subjId = triple.subject.split("###")[0];
        var predId = triple.predicate.split("###")[0];
        var objId = triple.object.split("###")[0];
        index++;
        rdfTBody.append(
            "<tr>"
                +"<td>" + index + "</td>"
                +"<td>" + L(subjId) + "</td>"
                +"<td>" + L(predId) + "</td>"
                +"<td>" + L(objId) + "</td>"
                //+"<td>" + Math.round(triple.vw*100) + "</td>"
            +"</tr>");
    });
}

function generateQueryResultTable(list){
    /* triples.sort(function(a, b) {
        return a.vw - b.vw;
    }); */
    console.log(list);
    $("#tabrs").empty();
    var size=varlist.length;
    var i=0;
    item="";
    while(i < size) {
        item +="<th align='center'>";
        item += varlist[i];
        item +="</th>";
        i++;
    }
    var tr="<thead><tr><th align='center'>No.</th>"+item+"</tr></thead>";
    $("#tabrs").append(tr);
    /* var rdfTBody = $("#tblBodyResult");
    rdfTBody.empty(); */
    //$("#tabrs").append("<tr><td>a</td><td>b</td><tr>");
        var a = "";
        var j = 0;
        var index = 0;
        while(j< list.length) {
            //a= "<td>";
            a += "<td>";
            //alert(result[i]);
            a += list[j];
            a += "</td>";
            
            j++;
            if(j % size == 0) {
                index++;
                var tr="<tr><td>"+index+"</>"+a+"</tr>";
                $("#tabrs").append(tr);
                a = "";
            } 
        }
    
}
function Mlength(){
    var query = $("#txtSparql").val();
    var Mlength=0;
    for(var i=0;i<query.length;i++){
        if(query.charAt(i)==".")
            Mlength++;
    }
    return Mlength;
}
function triplesToResults(triples,Mlength){
    var results=[];
    for(var j=0;j<triples.length;j+=Mlength){
        var Mresults=new Array();
        for(var i=0;i<Mlength;i++){
            var triple=triples[i+j];
            if(triple.subject.endWith("?x")){
                var sub=triple.subject.split("###")[0]
                if(!Mresults.includes(sub))
                    Mresults.push(sub);
            }else if(triple.subject.endWith("?y")){
                var sub=triple.subject.split("###")[0]
                if(!Mresults.includes(sub))
                    Mresults.push(sub);
            }else if(triple.subject.endWith("?z")){
                var sub=triple.subject.split("###")[0]
                if(!Mresults.includes(sub))
                    Mresults.push(sub);
            }
            
            if(triple.object.endWith("?x")){
                var sub=triple.object.split("###")[0]
                if(!Mresults.includes(sub))
                    Mresults.push(sub);
            }else if(triple.object.endWith("?y")){
                var sub=triple.object.split("###")[0]
                if(!Mresults.includes(sub))
                    Mresults.push(sub);
            }else if(triple.object.endWith("?z")){
                var sub=triple.object.split("###")[0]
                if(!Mresults.includes(sub))
                    Mresults.push(sub);
            }
            
        }
        Mresults.forEach(function(M){
            results.push(M);
        }); 
    }
    return results;	
}
function queryGraph(isD3){
    $(".queryLoader").show();
    $(".queryResult").hide();
    function isJson(obj){
        var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length; 
        return isjson;
    }
    var querystr = $("#txtSparql").val();
    console.log(querystr);
    var host = 'http://222.20.79.232:53000';
    $.ajax({
        data: {querystr: querystr, isD3: isD3},
        url: host + "/query",
        dataType: 'json',
        type: 'get',
        success: function(jgraph){
            $(".queryLoader").hide();
            if(!isJson(jgraph)){
                jgraph=JSON.parse(jgraph);
            }
            console.log(jgraph);
            triples = jgraph.Triples;
            varlist=jgraph.vars;
            var time = jgraph.Time;
            var resultsize = jgraph.Size;
            $('#timevalue').text(time);
            $('#resultsvalue').text(resultsize);

            if(triples!=undefined){
                $(".queryResult").hide();3
            }else{
                $(".queryResult").html("<div class='alert alert-warning' role='alert'>Fail to create a graph from the given URL.</div>");
                $(".queryResult").show();
                setTimeout(function(){ 
                    $(".queryResult").hide();
                }, 5000 ); 
            }
            labels = jgraph.Triples;
            graph = triplesToGraph(triples, graph);
            afterQuery();
            generateRdfTable(triples);
            var mlength=Mlength();
            generateQueryResultTable(triplesToResults(triples,mlength));
            update();
        },
        error:function (request, err, ex) {
            $(".queryLoader").hide();
            $(".queryResult").show();
            $(".queryResult").html("<div class='alert alert-warning' role='alert'>Fail to create a graph from the given URL.</div>");
            setTimeout(function(){ 
                $(".queryResult").hide();
            }, 10000 ); 
          }
    });
    
}

var svg = d3.select("#svg-body").append("svg");
svg.attr("width", "100%")
            .attr("height", "100%");
            
            

var force = d3.layout.force().size([svgW, svgH]);
var graph={nodes:[], links:[], triples:[]};
graph = triplesToGraph(triples, graph);
console.log(graph);
$(".queryLoader").hide();
afterQuery();
generateRdfTable(triples);
update();
/* $("#query1").click(function(){
    querys="query1";
    $("#txtSparql").html("SELECT ?x ?y ?z WHERE {&#13;&#10;?x \"Departure city code\" \"AMS\" .&#13;&#10;?x \"Arrival city code\" \"PAR\" .&#13;&#10;?x \"Operating airline\" ?y .&#13;&#10;?x \"Operating flight number\" ?z .&#13;&#10;}");
});
$("#query2").click(function(){
    querys="query2";
    $("#txtSparql").html("SELECT ?x ?y WHERE {&#13;&#10;?x \"Trip origin city\" \"DOH\" .&#13;&#10;?x \"Trip destination city\" \"CWL\" .&#13;&#10;?x \"Trip begin date local\" \"20130101\" .&#13;&#10;?x \"hasSegments\" ?y .&#13;&#10;}");
});
$("#query3").click(function(){
    querys="query3";
    $("#txtSparql").html("SELECT ?x ?y WHERE {&#13;&#10;?x \"hasTrips\" ?y .&#13;&#10;?y \"Trip destination city\" \"LAX\" .&#13;&#10;?y \"Trip marketing Airline\" \"KL_\" .&#13;&#10;?y \"Trip begin date local\" \"20130101\" .&#13;&#10;}");
    //$("#txtSparql").html("SELECT ?x ?y ?z WHERE {&#13;&#10;?x \"hasTrips\" ?y .&#13;&#10;?y \"Trip origin city\" \"DOH\" .&#13;&#10;?y \"Trip begin date local\" \"20130101\" .&#13;&#10;?y \"hasSegments\" ?z .&#13;&#10;?z \"Booking identifier\" \"A\" .&#13;&#10;?z \"Booking class\" \"L\" .&#13;&#10;}");
});
$("#query4").click(function(){
    querys="query4";
    
    $("#txtSparql").html("SELECT ?x ?y ?z WHERE {&#13;&#10;?x \"hasTrips\" ?y .&#13;&#10;?y \"Trip origin city\" \"DOH\" .&#13;&#10;?y \"Trip destination city\" ?z .&#13;&#10;?y \"Trip operating Airline\" \"KL_\" .&#13;&#10;}");
});
$("#query5").click(function(){
    querys="query5";
    
    $("#txtSparql").html("SELECT ?x ?z WHERE {&#13;&#10;?x \"hasTrips\" ?z .&#13;&#10;?z \"Trip origin city\" \"DOH\" .&#13;&#10;?z \"Trip destination city\" \"CWL\" .&#13;&#10;?z \"Trip segment count\" \"02\" .&#13;&#10;}");
});
$("#query6").click(function(){
    querys="query6";
    
    $("#txtSparql").html("SELECT ?x ?y WHERE {&#13;&#10;?x \"hasTrips\" ?y .&#13;&#10;?y \"Trip destination city\" \"LAX\" .&#13;&#10;?y \"Trip marketing Airline\" \"KL_\" .&#13;&#10;?y \"Trip begin date local\" \"20130101\" .&#13;&#10;}");
}); */

$(document).ready(function () {
    //Toggle fullscreen
    $("#panel-fullscreen").click(function (e) {
        e.preventDefault();
        
        var $this = $(this);
    
        if ($this.children('i').hasClass('glyphicon-resize-full'))
        {
            $this.children('i').removeClass('glyphicon-resize-full');
            $this.children('i').addClass('glyphicon-resize-small');
            document.getElementById("svg-body").style.height = document.documentElement.clientHeight-110+"px";
            svgW = document.getElementById("svg-body").clientWidth;
            svgH = document.getElementById("svg-body").clientHeight;
        }
        else if ($this.children('i').hasClass('glyphicon-resize-small'))
        {
            $this.children('i').removeClass('glyphicon-resize-small');
            $this.children('i').addClass('glyphicon-resize-full');
            document.getElementById("svg-body").style.height=document.documentElement.clientHeight*0.65+"px";
        }
        $(this).closest('.panel').toggleClass('panel-fullscreen');
    });
});


