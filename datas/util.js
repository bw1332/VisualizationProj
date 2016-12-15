//this file has dependency on d3.js - v3
function prepare(callback){
    d3.queue()
     .defer(d3.json,"https://raw.githubusercontent.com/bw1332/VisualizationProj/master/data/fii.json")
        .await(function(e, d){
        if (e) {
            console.log("error")
        }
        
    });
    if(callback){  callback();
    }
}

function getMonth(raw, month) {
    return raw[month];
}