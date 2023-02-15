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

    var data = {"OkPercent": 99.73093677014099, "KoPercent": 0.2690632298590169};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5398593669512335, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6568820224719101, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.44405006538389685, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.6724924012158054, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6730664636136191, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.35209038554534666, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.33403465346534655, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.4305392960274721, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.43424623735504564, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.6369187411930484, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.6578157252767874, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.6111177311725453, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.45219080509389165, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.646278376240034, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.4175328146344361, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.6700595560368164, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 199953, 538, 0.2690632298590169, 2723.508069396312, 39, 108287, 11432.0, 22183.20000000001, 28841.850000000017, 42179.30000000011, 131.8874629968709, 107.97699085883373, 36.416260060637974], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 10680, 37, 0.3464419475655431, 1818.4666666666678, 41, 32772, 205.0, 5659.199999999997, 10194.949999999977, 17285.180000000113, 7.099586322793195, 2.682063563857721, 2.4438987576887254], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 10706, 15, 0.14010835045768727, 2915.430226041477, 49, 35417, 1180.0, 8208.0, 12749.899999999998, 22455.040000000008, 7.105854398348649, 12.776408971796608, 0.9437462872806799], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9212, 50, 0.5427702996092054, 1706.6128962223167, 40, 33075, 169.5, 5454.500000000004, 9288.250000000005, 16547.39000000008, 6.118665716409275, 1.2869899437550354, 1.355828669223417], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9193, 58, 0.6309148264984227, 1706.0618949200484, 40, 32714, 169.0, 5345.000000000002, 9421.499999999996, 16656.039999999957, 6.117182675723442, 1.388220669978893, 1.4809775240282244], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 22747, 39, 0.17145118037543414, 3988.4116586802675, 85, 36884, 2576.0, 11991.900000000001, 15045.800000000003, 25005.780000000035, 15.086758645023764, 27.122236344434008, 2.0037101325422184], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 8080, 23, 0.28465346534653463, 7901.310891089097, 50, 108287, 2445.5, 22567.9, 33158.399999999994, 62756.59999999963, 5.331074224651996, 1.7166965951969528, 1.8325889808576168], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 12813, 26, 0.20291891048154218, 3078.440802310153, 46, 35296, 1263.0, 8891.800000000007, 13188.499999999996, 22772.24000000002, 8.501064540549077, 15.277119820482769, 1.1290476342916742], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 8106, 10, 0.1233654083395016, 3383.756476683927, 81, 36584, 1291.5, 9968.800000000001, 14176.349999999993, 23887.55000000004, 5.376308427393306, 3.2431763391110184, 0.7350421678076785], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 12774, 58, 0.4540472835447002, 1944.9846563331805, 41, 32641, 250.0, 5987.5, 10384.25, 19112.5, 8.483767339953072, 3.204100642168521, 2.92051337119836], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 10658, 46, 0.4316006755488835, 1815.1104334772015, 41, 33132, 200.5, 5637.1, 9907.249999999996, 19031.05, 7.0798458881360435, 1.4884761213796998, 1.5687755849774145], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 16784, 53, 0.3157769304099142, 2148.22134175405, 39, 33001, 324.0, 7172.5, 10814.75, 19863.500000000015, 11.146005096189413, 6.71346502363147, 2.590659710900493], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9266, 14, 0.151090006475286, 2820.7233973667144, 47, 35541, 1140.0, 7850.200000000004, 12634.199999999997, 21275.739999999994, 6.148203146823683, 11.05330262922606, 0.8165582304375204], "isController": false}, {"data": ["POST /users [Create User]", 32862, 44, 0.13389325056296025, 1943.0325908343934, 78, 33044, 1259.5, 9296.700000000004, 11797.95, 21980.950000000008, 21.817066466965688, 11.62205731199859, 13.188246233448986], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 16837, 26, 0.15442180911088674, 3243.349230860607, 81, 36728, 1314.0, 9543.800000000007, 13496.599999999991, 23378.33999999989, 11.166044930780071, 6.735752533573738, 1.526607705380088], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9235, 39, 0.4223064428803465, 1759.7618841364379, 41, 32828, 180.0, 5490.4, 9925.599999999975, 18996.439999999988, 6.134068757364536, 2.316759978115622, 2.11149923162237], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 258, 47.95539033457249, 0.12903032212569954], "isController": false}, {"data": ["500", 280, 52.04460966542751, 0.14003290773331734], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 199953, 538, "500", 280, "400", 258, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST /reservations [Accept Reservation]", 10680, 37, "400", 26, "500", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 10706, 15, "500", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9212, 50, "400", 39, "500", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9193, 58, "400", 50, "500", 8, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 22747, 39, "500", 39, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 8080, 23, "500", 13, "400", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 12813, 26, "500", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 8106, 10, "500", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 12774, 58, "400", 44, "500", 14, "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 10658, 46, "400", 37, "500", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 16784, 53, "500", 27, "400", 26, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9266, 14, "500", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /users [Create User]", 32862, 44, "500", 44, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 16837, 26, "500", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9235, 39, "400", 26, "500", 13, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
