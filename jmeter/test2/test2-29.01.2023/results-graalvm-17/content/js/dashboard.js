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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 45037, 0, 0.0, 81.73246441814442, 38, 382, 85.0, 153.0, 167.0, 219.0, 725.7711025880684, 583.8194638188111, 200.37976940950622], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 2356, 0, 0.0, 44.70161290322575, 38, 206, 43.0, 49.0, 52.0, 66.42999999999984, 38.333251980930996, 14.445882729495127, 13.15838562767446], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 2361, 0, 0.0, 86.72808132147405, 46, 225, 84.0, 124.0, 131.0, 149.3800000000001, 38.28441705853738, 68.66002386695314, 5.084649140586995], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 2009, 0, 0.0, 44.58636137381779, 39, 107, 43.0, 49.0, 52.0, 65.0, 32.80160660930331, 6.871334641900828, 7.255728469353601], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 2008, 0, 0.0, 43.96862549800788, 39, 101, 42.0, 49.0, 52.0, 61.730000000000246, 32.838359390331654, 7.424193912719958, 7.93729327819389], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 4895, 0, 0.0, 125.51256384065353, 82, 265, 121.0, 163.0, 170.0, 196.0, 78.92488028248496, 141.5058445425743, 10.482210662517534], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 2628, 0, 0.0, 119.21651445966518, 49, 300, 101.0, 206.0, 229.0, 251.0, 42.566287111874175, 13.693181300515072, 14.63216119470675], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 2850, 0, 0.0, 86.91473684210528, 45, 193, 84.0, 122.80000000000018, 131.0, 153.48999999999978, 46.2354601645009, 82.93648847256696, 6.140647053097776], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 2632, 0, 0.0, 114.31003039513686, 79, 261, 111.0, 150.0, 157.0, 179.67000000000007, 42.46668172577366, 25.587913377529123, 5.805991642195617], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 2846, 0, 0.0, 44.55340829234009, 39, 210, 43.0, 49.0, 52.0, 65.0, 46.27416548786238, 17.437951451555207, 15.883927283018714], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 2356, 0, 0.0, 44.89940577249572, 38, 138, 43.0, 49.0, 55.0, 65.0, 38.432677563537894, 8.050674707799093, 8.501057647996802], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 2014, 0, 0.0, 87.65491559086391, 46, 195, 85.0, 124.0, 130.0, 150.0, 32.66087182148417, 58.56476859472301, 4.337772038790867], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 3414, 0, 0.0, 59.99560632688929, 38, 382, 46.0, 88.0, 137.75, 292.5499999999997, 55.44367935559308, 33.44320560161427, 12.886323912725738], "isController": false}, {"data": ["POST /users [Create User]", 7235, 0, 0.0, 83.46938493434695, 75, 257, 82.0, 88.0, 91.0, 101.0, 116.78584687898501, 62.21383003300996, 70.5961320489177], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 3423, 0, 0.0, 119.43529068068935, 78, 254, 117.0, 153.0, 160.0, 182.0, 55.22125606982109, 33.28321991909594, 7.549781103295852], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 2010, 0, 0.0, 44.831840796019854, 39, 205, 43.0, 49.0, 53.0, 71.0, 32.69887750122011, 12.322973223727022, 11.224542968114527], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 45037, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
