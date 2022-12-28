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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9397198245365784, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.988255033557047, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.7814569536423841, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.9860557768924303, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.996, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.7870514820592823, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.9610866372980911, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.7785515320334262, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.9838945827232797, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.9901685393258427, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.988255033557047, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9861842105263158, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.98914223669924, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.9829396325459318, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.9880952380952381, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7067, 0, 0.0, 254.75944530918287, 9, 1376, 193.0, 557.0, 773.0, 1018.6399999999994, 116.6344836691918, 1295.8224444946443, 30.756633746142167], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 298, 0, 0.0, 175.6140939597316, 9, 689, 134.5, 347.30000000000007, 417.0, 644.4299999999996, 5.055560268046484, 1.9002254485113241, 1.7329117715667148], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 302, 0, 0.0, 486.2781456953641, 27, 1318, 435.5, 931.4, 987.55, 1140.3999999999994, 5.0191125145421305, 252.32589693784277, 0.6666008808376267], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 251, 0, 0.0, 163.84462151394425, 12, 661, 119.0, 363.8, 400.9999999999999, 560.8399999999999, 4.216715665686687, 0.8812276879462411, 0.9306423246535069], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 250, 0, 0.0, 160.98400000000004, 17, 548, 122.0, 347.5, 391.34999999999997, 518.4400000000005, 4.210455402856374, 0.9498195293552951, 1.0156078950249259], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 641, 0, 0.0, 468.94071762870516, 30, 1376, 420.0, 914.6000000000001, 1009.0999999999998, 1168.0600000000004, 10.58996514067637, 497.13555756847956, 1.4064797452460802], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 681, 0, 0.0, 233.05433186490447, 19, 1150, 192.0, 464.80000000000007, 539.9, 688.9199999999978, 11.421383647798741, 3.669565644654088, 3.9261006289308176], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 359, 0, 0.0, 484.1281337047356, 32, 1275, 448.0, 901.0, 1007.0, 1117.9999999999995, 5.966825117175814, 297.520414873018, 0.7924689608749128], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 683, 0, 0.0, 205.39970717423137, 21, 707, 186.0, 398.0, 452.79999999999995, 568.4799999999999, 11.356267562309828, 6.828809306569343, 1.5526147057845467], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 356, 0, 0.0, 182.0955056179774, 12, 928, 142.0, 371.3, 419.5999999999999, 597.5300000000004, 5.9680474761529565, 2.2432566092772963, 2.045688148564148], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 298, 0, 0.0, 169.95973154362417, 10, 875, 124.5, 386.4000000000001, 451.30000000000007, 547.7899999999975, 5.031743887613129, 1.0515558515129002, 1.1105216001958667], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 253, 0, 0.0, 492.6284584980236, 22, 1310, 453.0, 948.6, 1023.2999999999996, 1186.2200000000005, 4.218635363169479, 213.35381315968286, 0.5602875091709464], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 760, 0, 0.0, 184.58289473684204, 9, 887, 161.0, 390.0, 438.89999999999986, 574.2399999999998, 12.733304292463894, 7.6429113140016085, 2.959498458600007], "isController": false}, {"data": ["POST /users [Create User]", 921, 0, 0.0, 171.71878393051014, 10, 888, 133.0, 351.80000000000007, 418.0, 590.3399999999999, 15.310193496908038, 8.14849165606922, 9.254892357994216], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 762, 0, 0.0, 208.42519685039372, 19, 751, 175.5, 409.70000000000005, 471.85, 587.0, 12.66327649815535, 7.614684991649217, 1.7313073337321767], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 252, 0, 0.0, 194.71825396825398, 9, 919, 157.5, 387.40000000000003, 448.64999999999986, 706.41, 4.22528126624302, 1.5882956198336715, 1.4483141840344729], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7067, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
