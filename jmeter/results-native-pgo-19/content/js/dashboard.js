/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9349030470914127, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.996031746031746, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.4351145038167939, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.5558510638297872, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.9764331210191083, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.475, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.991751269035533, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.9976481655691439, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.4132231404958678, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9924433249370277, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.9821930646672915, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.9956896551724138, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5415, 0, 0.0, 339.8838411819023, 41, 7618, 130.0, 458.40000000000055, 1110.7999999999984, 5824.160000000007, 84.82275724870377, 364.660038950524, 20.265258966893278], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 126, 0, 0.0, 80.71428571428572, 42, 549, 68.0, 102.3, 138.7999999999999, 507.9600000000006, 2.201411698930743, 0.8267407914162416, 0.7510365526067511], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 131, 0, 0.0, 2057.259541984733, 46, 7618, 919.0, 5956.0, 6740.999999999998, 7489.040000000003, 2.063512066032386, 78.94741133100466, 0.2740601962699263], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 116, 0, 0.0, 76.801724137931, 42, 396, 62.0, 102.3, 156.04999999999893, 393.10999999999996, 2.0282911646937456, 0.42263465296113023, 0.44640369004738506], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 116, 0, 0.0, 73.79310344827587, 42, 421, 59.0, 100.3, 104.0, 420.32, 2.02768843518389, 0.4561718586124318, 0.48785449041218015], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 188, 0, 0.0, 1666.8457446808509, 82, 7162, 727.5, 5550.9, 6131.3, 7081.899999999999, 2.944954415865159, 91.10519804524735, 0.3911267583570914], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 785, 0, 0.0, 197.31464968152866, 44, 830, 158.0, 368.79999999999995, 496.8999999999995, 792.8199999999998, 13.141814407446471, 4.1926154721845545, 4.49183109629518], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 140, 0, 0.0, 1998.4285714285718, 58, 7398, 1057.0, 5612.0, 6544.799999999997, 7334.040000000001, 2.2085502445180625, 82.34778935459063, 0.2933230793500552], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 788, 0, 0.0, 183.3667512690355, 82, 843, 159.0, 292.0, 367.54999999999995, 687.2100000000002, 13.121960967161794, 7.750932264953707, 1.7940181009791514], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 135, 0, 0.0, 81.637037037037, 41, 364, 64.0, 105.4, 201.2, 356.4399999999997, 2.383937558494764, 0.8952009736619048, 0.8132703650073284], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 126, 0, 0.0, 78.6269841269841, 42, 462, 61.5, 100.19999999999999, 204.64999999999998, 458.49000000000007, 2.2008733624454146, 0.45856645742358076, 0.484357942139738], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 1063, 0, 0.0, 83.43555973659456, 43, 742, 65.0, 112.60000000000002, 208.79999999999995, 420.0, 17.80360761719731, 10.554176279581958, 4.103175193025943], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 121, 0, 0.0, 2194.504132231405, 57, 7166, 1233.0, 6088.2, 6876.5999999999985, 7161.38, 1.9057218906021136, 76.01068597128817, 0.2531036885955932], "isController": false}, {"data": ["POST /users [Create User]", 397, 0, 0.0, 137.6020151133502, 78, 759, 99.0, 245.0, 293.8999999999997, 655.06, 6.869462901439646, 3.6518861553069626, 4.152536656241348], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 1067, 0, 0.0, 197.26335520149942, 81, 1157, 162.0, 324.0, 431.5999999999999, 752.5599999999995, 17.765863567491966, 10.494400558201102, 2.4289266596180425], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 116, 0, 0.0, 90.82758620689658, 41, 549, 63.0, 127.99999999999986, 319.19999999999993, 539.6499999999999, 2.0284685062777603, 0.7618369224985136, 0.6920775790840415], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5415, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
