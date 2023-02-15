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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9997967169792144, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.9959473150962512, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 39354, 0, 0.0, 93.43774457488452, 38, 617, 85.0, 196.0, 225.0, 363.0, 633.1182934088387, 511.92966638479544, 175.60986178087646], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 2108, 0, 0.0, 47.91698292220109, 39, 343, 45.0, 56.0, 62.0, 78.90999999999985, 34.49347929245823, 12.993859735244547, 11.8378780650189], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 2113, 0, 0.0, 108.59867486985321, 47, 315, 101.0, 167.0, 185.29999999999995, 220.72000000000025, 34.44902750379054, 61.743405667663886, 4.57526146534718], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 1810, 0, 0.0, 47.74475138121547, 39, 325, 45.0, 56.0, 62.0, 76.88999999999987, 29.634238187235994, 6.205915745030944, 6.553191973787616], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 1807, 0, 0.0, 46.84283342556719, 38, 363, 43.0, 53.200000000000045, 59.0, 71.0, 29.62537912943684, 6.695861341093533, 7.158757889990983], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 4282, 0, 0.0, 143.3094348435307, 84, 421, 133.0, 203.0, 221.0, 270.5100000000002, 69.1459298851874, 123.89078383116411, 9.183443812876451], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 1974, 0, 0.0, 182.59321175278603, 50, 617, 147.0, 362.0, 408.0, 487.5, 32.03609334934597, 10.30200692167873, 11.012407088837676], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 2541, 0, 0.0, 106.89807162534444, 45, 298, 98.0, 166.0, 182.0, 222.57999999999993, 41.42349450621108, 74.25991902978383, 5.501557864106159], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 1976, 0, 0.0, 128.5263157894737, 81, 434, 117.0, 186.0, 205.14999999999986, 245.23000000000002, 31.91317549016441, 19.209204234834782, 4.363129461545916], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 2538, 0, 0.0, 47.404255319148845, 39, 326, 43.0, 55.0, 62.0, 78.0, 41.48685759121224, 15.627937222113246, 14.237609520073232], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 2105, 0, 0.0, 47.616152019002314, 39, 326, 45.0, 55.0, 62.0, 76.94000000000005, 34.48614820033093, 7.221753202870296, 7.625887752092924], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 1814, 0, 0.0, 109.2816979051819, 48, 300, 104.0, 169.0, 190.0, 225.0, 29.560342860867582, 52.96958006061989, 3.925983036208976], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 2996, 0, 0.0, 62.0026702269692, 38, 376, 46.0, 84.30000000000018, 163.0, 300.0900000000006, 48.911091520553754, 29.60163826035851, 11.368007599503706], "isController": false}, {"data": ["POST /users [Create User]", 6475, 0, 0.0, 86.13142857142846, 74, 433, 82.0, 92.0, 95.0, 111.0, 104.6989198628808, 55.76736551848199, 63.289679096800015], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 3005, 0, 0.0, 142.10183028286193, 80, 427, 136.0, 196.0, 214.69999999999982, 255.94000000000005, 48.54212099184234, 29.227716612147645, 6.6366181043534445], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 1810, 0, 0.0, 47.880662983425374, 39, 317, 45.0, 56.0, 62.44999999999982, 80.66999999999962, 29.606608325836262, 11.153594503966632, 10.160930343706552], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 39354, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
