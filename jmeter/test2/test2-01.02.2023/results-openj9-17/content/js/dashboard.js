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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9971356783919598, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.9932789246279404, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9939309056956116, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.9902450090744102, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.9942460317460318, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.9970561594202898, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.9921787709497206, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.9944462075531577, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 39800, 0, 0.0, 92.51309045226161, 41, 2552, 88.0, 157.0, 171.0, 222.0, 641.4285484052926, 512.9612785862786, 176.94969713955905], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 2080, 0, 0.0, 48.467307692307664, 41, 112, 46.0, 55.0, 64.0, 86.0, 33.9076993299969, 12.775181662944426, 11.638928596172342], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 2083, 0, 0.0, 107.14978396543435, 49, 818, 94.0, 134.0, 159.39999999999986, 562.119999999999, 33.8583573088864, 60.68570589717332, 4.496813080086475], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 1783, 0, 0.0, 48.53168816601228, 42, 232, 46.0, 55.0, 62.0, 79.32000000000016, 29.134939050295763, 6.101082117675414, 6.442507184671068], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 1782, 0, 0.0, 47.7962962962964, 41, 115, 46.0, 55.0, 60.0, 73.17000000000007, 29.159575860714753, 6.590326725929441, 7.0459450987531085], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 4284, 0, 0.0, 143.38772175536926, 91, 975, 133.0, 174.0, 190.0, 541.0, 69.0733783718418, 123.77076665564888, 9.173808065010238], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 2204, 0, 0.0, 151.35435571687862, 55, 2552, 128.0, 225.0, 245.75, 991.3999999999905, 35.78212517249777, 11.509200092337041, 12.300105528046108], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 2520, 0, 0.0, 105.39880952380956, 49, 786, 91.0, 131.0, 151.0, 514.1599999999999, 40.942323314378555, 73.40126167749797, 5.437652315190902], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 2208, 0, 0.0, 127.18568840579702, 84, 1177, 119.0, 156.0, 167.0, 398.8199999999997, 35.62209602478059, 21.474559588966507, 4.870208440887971], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 2513, 0, 0.0, 48.28213290887387, 41, 116, 46.0, 55.0, 61.29999999999973, 77.86000000000013, 40.98440863722357, 15.44101458020745, 14.067733518779763], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 2076, 0, 0.0, 48.60163776493252, 41, 259, 46.0, 55.0, 62.0, 80.0, 33.957079298612925, 7.110683557969118, 7.508618080999738], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 1790, 0, 0.0, 108.24134078212279, 51, 803, 91.0, 134.0, 163.0, 578.5399999999995, 29.067407154804243, 52.08644153635049, 3.860515012747438], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 3143, 0, 0.0, 59.16640152720321, 42, 261, 49.0, 78.0, 140.0, 212.0, 51.14977134766547, 28.185605455717933, 11.888325762445684], "isController": false}, {"data": ["POST /users [Create User]", 6398, 0, 0.0, 90.07768052516401, 80, 395, 88.0, 96.0, 101.0, 126.01000000000022, 103.28183769996933, 55.01188579047411, 62.43306400027443], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 3151, 0, 0.0, 135.73341796255139, 85, 830, 124.0, 163.0, 177.0, 518.96, 50.81848238045319, 30.6418238700508, 6.947839387952584], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 1785, 0, 0.0, 48.21680672268906, 41, 115, 46.0, 55.0, 59.0, 75.41999999999962, 29.096777348525602, 10.963090850000814, 9.987738168736858], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 39800, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
