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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9998137108792846, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.997872340425532, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.9989799387963277, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40260, 0, 0.0, 91.46952309985076, 39, 751, 85.0, 185.0, 209.0, 333.0, 648.2361086511987, 519.071672677798, 179.8175993144895], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 2164, 0, 0.0, 47.231515711645145, 39, 437, 45.0, 52.0, 59.0, 75.0, 35.23167594672918, 13.161907200392369, 12.087516738709258], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 2169, 0, 0.0, 102.60350391885666, 46, 245, 95.0, 156.0, 172.5, 199.0, 35.18191108011224, 62.268860196914886, 4.672597565327408], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 1847, 0, 0.0, 47.611802923660015, 39, 359, 45.0, 55.0, 62.0, 75.0, 30.11674928254631, 6.304057435021523, 6.6569880906763625], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 1845, 0, 0.0, 47.5154471544715, 39, 358, 45.0, 52.0, 58.0, 71.53999999999996, 30.13622553983862, 6.808421732587958, 7.279300256647937], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 4415, 0, 0.0, 139.18301245753133, 87, 291, 130.0, 193.0, 209.0, 240.84000000000015, 71.19704568544292, 125.9671923126542, 9.455857630097885], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 2115, 0, 0.0, 167.24680851063815, 48, 751, 137.0, 323.0, 362.0, 420.0, 34.254340502720915, 10.94530060613177, 11.708026539015936], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 2604, 0, 0.0, 101.89055299539152, 47, 251, 95.0, 156.0, 169.0, 205.79999999999927, 42.252835515747456, 74.7991509678885, 5.6117047169352094], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 2119, 0, 0.0, 123.1448796602172, 81, 291, 114.0, 176.0, 189.0, 222.80000000000018, 34.18789629079879, 20.2448160777093, 4.674126446007647], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 2598, 0, 0.0, 47.451886066204736, 41, 417, 45.0, 55.0, 62.0, 76.01999999999953, 42.352020605448054, 15.820366626999006, 14.529772014533036], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 2162, 0, 0.0, 47.593894542090695, 40, 358, 45.0, 55.0, 62.0, 75.73999999999978, 35.247892789018046, 7.377913208992941, 7.790974452614245], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 2941, 0, 0.0, 72.75280516831027, 42, 552, 51.0, 104.80000000000018, 218.0, 422.7399999999998, 47.789278692253944, 28.67679803911214, 11.013935323605402], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 1853, 0, 0.0, 103.2104695089045, 45, 258, 98.0, 157.0, 172.0, 203.84000000000015, 30.08165716975925, 53.229861686066336, 3.9952200928586503], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 2949, 0, 0.0, 135.6229230247539, 80, 291, 131.0, 186.0, 199.0, 225.0, 47.57142165798261, 28.18048625506122, 6.50390530480231], "isController": false}, {"data": ["POST /users [Create User]", 6631, 0, 0.0, 85.85477303574109, 76, 411, 84.0, 91.0, 96.0, 108.0, 107.13304790370789, 57.054253928023265, 64.76109048085468], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 1848, 0, 0.0, 47.114177489177465, 41, 258, 45.0, 55.0, 62.0, 75.0, 30.09232873589422, 11.242355553158228, 10.324439916098093], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 40260, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
