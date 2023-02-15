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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9999653459628046, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.9993844891259746, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 43285, 0, 0.0, 85.08002772322958, 38, 597, 85.0, 166.0, 186.0, 261.0, 696.7628736538802, 560.5633493734205, 192.2952216520049], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 2270, 0, 0.0, 45.89030837004412, 38, 258, 43.0, 49.0, 56.0, 123.57999999999993, 36.96586763939551, 13.929183188672486, 12.688315243942156], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 2272, 0, 0.0, 93.92077464788743, 45, 225, 91.0, 138.0, 150.0, 180.53999999999996, 36.869949044172536, 66.0792500547694, 4.896790107429165], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 1939, 0, 0.0, 46.03403816400204, 39, 265, 43.0, 52.0, 58.0, 75.59999999999991, 31.61533319202361, 6.622253249783959, 6.9927454356279855], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 1936, 0, 0.0, 45.35795454545455, 39, 226, 43.0, 49.0, 55.0, 67.25999999999976, 31.61280841266472, 7.14652203997322, 7.640472171421107], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 4704, 0, 0.0, 130.62988945578206, 85, 313, 124.0, 177.0, 189.0, 211.89999999999964, 75.83305121632732, 135.87534294848544, 10.071577114668472], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 2437, 0, 0.0, 136.3311448502259, 51, 597, 109.0, 248.0, 280.0, 336.0, 39.459835813403714, 12.692102568046762, 13.564318560857528], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 2737, 0, 0.0, 93.47022287175764, 45, 202, 88.0, 140.0, 150.0, 170.0, 44.410189842609114, 79.60849398628915, 5.898228338471523], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 2438, 0, 0.0, 115.84290401968829, 77, 316, 108.0, 156.0, 167.0, 192.61000000000013, 39.35114195787265, 23.719143430715842, 5.380038939552901], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 2734, 0, 0.0, 45.719458668617534, 38, 207, 43.0, 50.0, 55.0, 75.0, 44.519711452345675, 16.775213189615865, 15.28084723217339], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 2267, 0, 0.0, 45.57653286281422, 39, 168, 43.0, 52.0, 56.0, 72.32000000000016, 36.96396543290396, 7.742279216941139, 8.175450686857982], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 3350, 0, 0.0, 59.21104477611943, 39, 346, 45.0, 93.80000000000018, 156.44999999999982, 252.48999999999978, 54.43790828431213, 32.74390036440899, 12.65256071451786], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 1943, 0, 0.0, 93.96860524961417, 45, 212, 88.0, 137.0, 150.0, 175.55999999999995, 31.527876939053677, 56.49286026136659, 4.187296155968067], "isController": false}, {"data": ["POST /users [Create User]", 6960, 0, 0.0, 84.67227011494242, 74, 315, 82.0, 88.0, 92.0, 138.17000000000098, 112.29428848015489, 59.81894361084221, 67.88102008712488], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 3357, 0, 0.0, 123.71313672922257, 80, 315, 120.0, 163.0, 173.0, 193.0, 54.13817571926203, 32.6420362342359, 7.401703711617856], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 1941, 0, 0.0, 45.95620814013394, 39, 249, 43.0, 52.0, 56.899999999999864, 79.0, 31.607744793108502, 11.911028284738393, 10.84941870287743], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 43285, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
