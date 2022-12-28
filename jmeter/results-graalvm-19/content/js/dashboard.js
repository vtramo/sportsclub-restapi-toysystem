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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9524844133761572, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.99581589958159, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.5061475409836066, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.601823708206687, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.9978031634446397, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.5248091603053435, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.9980544747081712, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.48504273504273504, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9990141955835962, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10586, 0, 0.0, 171.19950878518796, 6, 3090, 69.0, 235.0, 925.9499999999989, 2418.129999999999, 172.3935771748689, 1212.168325621682, 40.428424772212814], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 239, 0, 0.0, 49.45606694560669, 7, 549, 43.0, 85.0, 95.0, 379.5999999999978, 4.133803791338038, 1.5537066134374566, 1.4169581355074718], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 244, 0, 0.0, 1133.4836065573766, 38, 3090, 1023.5, 2462.5, 2737.0, 2948.2500000000005, 4.016130359641182, 276.8215289636655, 0.5333923133898444], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 229, 0, 0.0, 26.85152838427948, 9, 229, 16.0, 76.0, 85.0, 224.89999999999992, 3.869092875124605, 0.8085799563248687, 0.8539208884552352], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 229, 0, 0.0, 31.598253275109183, 6, 218, 14.0, 90.0, 98.0, 122.2999999999999, 3.872364171330977, 0.8735509019311091, 0.9340565921081556], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 329, 0, 0.0, 925.629179331307, 33, 2892, 591.0, 2348.0, 2563.5, 2849.7999999999993, 5.357782627104843, 305.6595936522897, 0.711580505162362], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 1138, 0, 0.0, 181.37961335676624, 21, 1267, 202.0, 309.0, 321.0, 342.0, 19.053040450040182, 6.121533503967988, 6.549482654701312], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 262, 0, 0.0, 1078.4236641221373, 42, 2923, 920.5, 2425.7, 2700.5499999999997, 2876.4700000000003, 4.302417235943248, 282.90298469932344, 0.5714147891487126], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 1140, 0, 0.0, 80.87631578947365, 13, 489, 97.5, 123.0, 131.0, 172.9799999999982, 19.054623253326202, 11.45983721041987, 2.6051242729156914], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 257, 0, 0.0, 44.30739299610894, 7, 521, 37.0, 81.0, 88.0, 127.61999999999986, 4.40362570894947, 1.6552919276143316, 1.5094459217199843], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 239, 0, 0.0, 24.648535564853564, 9, 482, 16.0, 30.0, 83.0, 334.7999999999979, 4.138384817841807, 0.8648577646661587, 0.9133544617502424], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 234, 0, 0.0, 1139.9871794871797, 42, 2890, 1034.0, 2452.0, 2637.75, 2852.0000000000005, 3.8314803595696953, 273.4849585741653, 0.5088684852553501], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 2536, 0, 0.0, 64.42665615141955, 6, 538, 71.0, 87.30000000000018, 97.0, 148.0, 42.55890447741156, 25.532730347343424, 9.89162037658589], "isController": false}, {"data": ["POST /users [Create User]", 745, 0, 0.0, 42.30201342281879, 9, 479, 18.0, 90.0, 97.0, 223.0, 12.46298743663951, 6.633132961883333, 7.533778538359235], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 2536, 0, 0.0, 53.05717665615147, 12, 239, 41.0, 93.0, 118.0, 145.0, 42.38817944775022, 25.4965438684646, 5.7952589088721], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 229, 0, 0.0, 49.63318777292576, 8, 362, 45.0, 84.0, 89.5, 354.79999999999995, 3.864717993721943, 1.4525984005299222, 1.3247226716761737], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10586, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
