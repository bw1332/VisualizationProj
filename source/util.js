//has dependency on d3 -v3
var _SOURCE = "https://raw.githubcontent.com/bw1332/VisualizationProj/master/source/fii.json";

function getMonthSource(jsonData, mon){
    var month = 0;
    if (typeof mon === 'string'){
        month = parseInt(mon);
    } else{
        month = mon;
    }
    if (month > 0 && month < 13) {
        return jsonData[month];
    }
}

// obj is array of json, attrs is array of selected attributes(string)
// return a new array of json
function getJsonArrWith(objs, attrs){
    return objs.map(function(obj){
        var one = {};
        attrs.map(function(attr){
            one[attr] = obj[attr];
        });
        return one;
    })
}

// data is json obj from _SOURCE
// return an arr of{"mon":"vol"}
function getMonthAndAmount(data){
    var res = new Array();
    for (var i = 1; i <= 12; i++) {
        var one = new Object();
        one.month = i;
        var sum = 0;
        data[i].map( function(e){
            sum = sum + parseInt(e["num"]);
        });
        one.vol = parseInt(sum);
        res.push(one);
    }
    return res;
}

// objs is an array of json objs for given month
// this function usually uses getMonthSource() as input
function getHeatMapFromTo(objs){
  return getJsonArrWith(objs, ["from","to","num"]);
}

//
