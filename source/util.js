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
        one.mon = i;
        var sum = 0;
        data[i].map( function(e){
            sum = sum + parseInt(e["num"]);
        });
        one.vol = parseInt(sum);
        res.push(one);
    }
    return res;
}

// data is json onj from _Source
// return an arr of {"mon":"vol"}
function getMonthAndContasts(data){
    var res = new Array();
    for (var i = 1; i <=12; i++){
        var one = new Object();
        one.mon = i;
        one.vol = data[i].length;
        res.push(one);
    }
    return res;
}

// objs is an array of json objs for given month
// this function usually uses getMonthSource() as input
// return [{from,to, num}];
function getHeatMapDataFromTo(objs){
  return getJsonArrWith(objs, ["from","to","num"]);
}

// objs is an array of json objs for given month
// this function usually uses getMonthSource() as input
// return [{from,to,num}] but in from to have same meanning in this case, num is the total num of sending and reveiving
function getHeatMapDataTotal(objs){
    var fromToList = getHeatMapDataFromTo(objs);
    var res = [];
    fromToList.map(function(one){
      fromToList.map(function(other){
          if (one.from == other.to && one.to == other.from) {
              one.num = one.num + other.num;
          }
      });
        res.push(one);
        var other = new Object();
        other.from = one.to;
        other.to = one.from;
        other.num = one.num;
        res.push(other);
    });
    return res;
}

// from _SOURCE
// return a array of email sorted by total nums
function getEmailList(data){
    var all = new Object();
    for (var i = 1; i <= 12; i++) {
       data[i].map(function(e){
           var to = e.to;
           var from = e.from;
           if (all.hasOwnProperty(to)){
               var num = all[to];
               num = parseInt(num) + 1;
               all[to] = num;
           } else {
               all[to] = 1;
           }
           if (all.hasOwnProperty(from)){
               var num = all[from];
               num = parseInt(num) + 1;
               all[from] = num;
           } else {
               all[from] = 1;
           }
       });
    }
    var list = [];
    for (var att in all) {
        list.push([att,all[att]]);
    }
    list.sort(function(a, b){
        return (b[1]) - (a[1]);
    });
    
    var res = [];
    list.map(function(x){
        res.push(x[0]);
    })
    return res;
}

// data is array from given month data, from email to email 
function getBarData(data, from, to){
    var res = []
    data.map(function(o){
        if (o.from == from && o.to == to){
            for (var i = 0; i < o.topics.length; i++) {
                var one = new Object();
                one.topic = o.topics[i];
                one.times = o.times[i];
                res.push(one);
            }
        }
    });
    return res;
}

// input email addr
// return the name
function cutEmail(email){
    var end = email.indexOf("@");
    if (end > 0) {
        return email.substring(0,end).replace("."," ");
    } 
    return  email;
}



