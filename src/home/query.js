var net = require('net');
exports.query = function(queryString, isD3, cb){
    var host = '127.0.0.1';
    var port = 5439;
    var triples = getTriples(queryString);
    var vars = getVarList(queryString);
    var client = new net.Socket();
    client.connect(port, host, function () {
        console.log('connected!');
        var buffer = queryBuffer(queryString);
        client.write(buffer);
    });

    var curLen = 0, trueLen = 0;
    var flag = true;
    var bufArray = [];
    client.on('data', function (buffer) {
        bufArray.push(buffer);
        //console.log(buffer.length);
        curLen += buffer.length;
        if (flag) {
            trueLen = buffer.readUInt32LE(0);
            flag = false;
        }
        if (curLen - 4 === trueLen) {
            var totalLength = 0;
            bufArray.forEach(function (i) {
                totalLength += i.length;
            });
            var totalBuffer = Buffer.concat(bufArray, totalLength);
            var data = executeResult(totalBuffer);
            res = getTrueData(data, vars, triples);
            if(isD3){
                var rdfdata = res.RDFData;
                var Triples = [];
                for(var i = 0; i<rdfdata.length-2; i+=3){
                    var triple = {};
                    triple.subject = rdfdata[i];
                    triple.predicate = rdfdata[i+1];
                    triple.object = rdfdata[i+2];
                    Triples.push(triple);
                }
                res.Triples = Triples;
                
            }
            //console.log(res);
            cb(res);
            client.destroy();
        }
    });
    
}

//将查询语句转换成buffer
function queryBuffer(queryString) {
    var length = Buffer.from(queryString).length;
    var buffer = Buffer.alloc(length + 4);
    //buffer.writeInt32LE(length);
    buffer.writeUInt32LE(length >>> 0);
    buffer.write(queryString, 4);
    return buffer;
}

//将buffer转换成结果数组
function executeResult(buffer) {
    var res = [];
    var index = 4;
    var sb = [];
    for (var i = 4; i < buffer.length; i++) {
        if (buffer.readInt8(i) === 0) {
            sb.splice(0, sb.length);
            for (var j = index; j < i; j++) {
                sb.push(buffer[j]);
            }
            index = i + 1;
            res.push(Buffer.from(sb).toString('utf-8'));
        }
    }
    return res;
}

function getTriples(queryString) {
    var res = '';
    var ss = queryString.substring(queryString.indexOf('{') + 1).trim().split(/"\s+"\s?}?|\s+"\s?}?|"\s+\.?\n?\s?}?|\s+"\s?}?|\s+\.\n?\s?}?/);
    ss.pop();
    ss.forEach(function (s) {
        res += s + '$$$';
    });
    return res;
}

function getVarList(queryString) {
    var res = [];
    var ss = queryString.substring(0, queryString.indexOf('{')).split(/\s+/);
    ss.forEach(function (s) {
        if (s.length > 1 && s.charAt(0) === '?') {
            res.push(s);
        }
    });
    return res;
}

function getTrueData(data, vars, triples) {
    var res = {};
    var size = data.length;
    var temp = triples;
    var RDFData = [];
    var varList = {};
    for (var i = 0; i < vars.length; i++) {
        varList[vars[i].substring(1)] = [];
    }
    for (var i = 1, j = 0; i < size - 1; i++) {
        temp = temp.replace(new RegExp('\\' + vars[j], 'g'), data[i]+'###'+vars[j]);
        varList[vars[j].substring(1)].push(data[i]);
        j++;
        if (j === vars.length) {
            j = 0;
            var strList = temp.split('$$$');
            strList.pop();
            strList.forEach(function (s) {
                RDFData.push(s);
            });
            temp = triples;
        }
    }
    res.RDFData = RDFData;
    res.varList = varList;
    res.Time = data[size - 1];
    res.vars = vars;
    res.Size = (size-2)/vars.length;
    return res;
}

