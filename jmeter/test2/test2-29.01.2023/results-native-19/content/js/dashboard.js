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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9944018373456917, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.9976114649681529, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9920810313075507, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.9307184750733137, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.9971172325432415, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.9981698389458272, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.9957904583723106, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9971881390593047, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.9998715643462626, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24383, 0, 0.0, 151.06652175696232, 39, 1209, 118.0, 359.0, 414.0, 540.9800000000032, 393.2297966358637, 313.64794562005096, 107.90806947703486], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 1250, 0, 0.0, 94.39760000000005, 39, 419, 47.0, 248.0, 313.0, 383.0, 20.339424312934245, 7.5620549479717525, 6.9501719698325655], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 1256, 0, 0.0, 164.1799363057325, 47, 786, 105.0, 354.29999999999995, 409.0, 473.43000000000006, 20.365145766449395, 35.96629936237312, 2.7047459221065604], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 1068, 0, 0.0, 98.03651685393257, 39, 416, 49.0, 246.10000000000002, 299.54999999999995, 380.2399999999998, 17.46696323433207, 3.6490287017123513, 3.85371967711468], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 1068, 0, 0.0, 70.60299625468164, 39, 409, 46.0, 140.30000000000007, 221.0999999999999, 321.33999999999924, 17.40717801610327, 3.9255253070296967, 4.19751246353131], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 2715, 0, 0.0, 226.42983425414374, 84, 855, 195.0, 414.0, 452.1999999999998, 554.5200000000004, 43.80233289773002, 77.33537446759595, 5.817497337979769], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 1364, 0, 0.0, 266.6319648093844, 49, 1209, 193.0, 564.0, 709.75, 868.0, 22.10481962856124, 7.055745566679091, 7.555358271480893], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 1561, 0, 0.0, 156.58872517616902, 47, 828, 101.0, 357.0, 409.89999999999986, 471.13999999999965, 25.306810628536226, 44.71460304095132, 3.3610607866024673], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 1366, 0, 0.0, 183.45754026354325, 78, 786, 145.0, 367.0, 401.0, 461.65999999999985, 22.049328512396695, 13.065779504697185, 3.0145566325542354], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 1557, 0, 0.0, 90.04110468850354, 39, 438, 46.0, 219.0, 291.1999999999998, 389.0, 25.33066523500415, 9.417829765361901, 8.65573384397319], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 1246, 0, 0.0, 96.19903691813796, 39, 416, 49.0, 261.29999999999995, 304.0, 396.53, 20.41551972735614, 4.2649565494330846, 4.50420092123804], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 1946, 0, 0.0, 102.1685508735866, 39, 434, 53.5, 234.0, 303.0, 402.0, 31.74033599739031, 18.768859076822704, 7.315155561898548], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 1069, 0, 0.0, 153.13002806361098, 45, 737, 95.0, 358.0, 414.5, 490.4999999999998, 17.337009406422318, 30.60560495560331, 2.302571561790464], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 1956, 0, 0.0, 212.1630879345605, 79, 796, 180.0, 389.0, 421.14999999999986, 473.43000000000006, 31.569773072081087, 18.71105918021079, 4.316179912198586], "isController": false}, {"data": ["POST /users [Create User]", 3893, 0, 0.0, 144.32057539172888, 75, 1123, 94.0, 301.0, 340.0, 403.1199999999999, 62.89989013119627, 33.471501390527045, 38.0224921789165], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 1068, 0, 0.0, 99.48970037453186, 39, 425, 47.0, 277.0, 325.0, 373.30999999999995, 17.46382143733137, 6.492899062832148, 5.967530634249039], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24383, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
