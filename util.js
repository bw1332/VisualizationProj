//has dependency on d3 -v3
var _SOURCE = "https://rawgit.com/bw1332/VisualizationProj/master/source/fii.json";

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
function getHeatMapDataFromTo1(objs, emailList){
    var list = getJsonArrWith(objs,["from","to","num"]);
    var allRes = [];
//    for (var i in emailList) {
//        for (var j in emailList) {
//            var one = new Object();
//            if (i == j) {
//                one.from = i;
//                one.to = j;
//                one.num = 0;
//                res.push(one);
//            } else {
//                var exist = false;
//                list.map(function(e){
//                    if(e.from == i && e.to == j) {
//                        exist = true;
//                        res.push(e);
//                    }
//                });
//                if(!exist) {
//                    one.from = i;
//                    one.to = j;
//                    one.num = 0;
//                    res.push(one);
//                }
//            }
//        }
//    }
       for(var i = 0; i < emailList.length; i++) {
        for(var j = 0; j <emailList.length; j++) {
            var exit = false;
            list.map(function(e){
                if(e.from == emailList[i] && e.to == emailList[j]){
                    exit = true;
                    allRes.push(e);
                }
            });
            if(!exit) {
                var one = new Object();
                one.from = emailList[i];
                one.to = emailList[j];
                one.num = 0;
                allRes.push(one);
            }
        }
    }
   // console.log(res);
    return allRes;
}

// objs is an array of json objs for given month
// this function usually uses getMonthSource() as input
// return [{from,to,num}] but in from to have same meanning in this case, num is the total num of sending and reveiving
function getHeatMapDataTotal1(objs, emailList){
    var fromToList = getJsonArrWith(objs,["from","to","num"]);
    console.log(emailList);
    console.log(objs);
    console.log(fromToList);
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
  //  console.log(res);
    var allRes = [];
    for(var i = 0; i < emailList.length; i++) {
        for(var j = 0; j <emailList.length; j++) {
            var exit = false;
            res.map(function(e){
                if(e.from == emailList[i] && e.to == emailList[j]){
                    exit = true;
                    allRes.push(e);
                }
            });
            if(!exit) {
                var one = new Object();
                one.from = emailList[i];
                one.to = emailList[j];
                one.num = 0;
                allRes.push(one);
            }
        }
    }
    
  //  console.log(allRes);
    return allRes;
}

// from _SOURCE
// return a array of email sorted by total nums
function findEmailList(data){
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
        if (o.from == from && o.to == to || o.from == to && o.to == from){
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
        email = email.substring(0,end);
        email = email.charAt(0).toUpperCase() + email.substring(1, email.length);
        email = email.substring(0, email.indexOf(".") + 1) + email.charAt(email.indexOf(".") + 1).toUpperCase() + email.substring(email.indexOf(".") + 2, email.length);
        return email.replace("."," ");
    } 
    return  email;
}


