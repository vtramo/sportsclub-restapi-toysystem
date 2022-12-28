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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9382619790189963, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9847972972972973, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.7625418060200669, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.9900398406374502, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9920318725099602, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.7793427230046949, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.7632311977715878, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.980349344978166, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.9901408450704225, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.9949324324324325, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.7696850393700787, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9893899204244032, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.992942453854506, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.9794973544973545, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7054, 0, 0.0, 255.4980153104617, 6, 1293, 194.0, 557.5, 777.0, 1022.4499999999998, 115.88250755684058, 1308.8378745821149, 30.57528438259791], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 296, 0, 0.0, 182.8445945945946, 9, 950, 155.5, 360.6, 447.15, 621.0699999999981, 5.002873271811513, 1.8803688985228004, 1.7148520687557043], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 299, 0, 0.0, 495.6488294314383, 32, 1237, 474.0, 929.0, 1015.0, 1124.0, 4.967437533227007, 253.51140348281334, 0.6597377973817119], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 251, 0, 0.0, 161.86852589641424, 10, 810, 132.0, 330.20000000000005, 402.9999999999999, 720.1999999999983, 4.263269639065817, 0.8909567409766455, 0.9409169320594479], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 251, 0, 0.0, 159.60956175298796, 6, 757, 121.0, 329.40000000000003, 428.1999999999996, 607.48, 4.249123935602919, 0.958542606566674, 1.0249351680604697], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 639, 0, 0.0, 473.1705790297339, 31, 1293, 427.0, 912.0, 1001.0, 1127.4, 10.520077048451622, 505.58523780786453, 1.3971977329974812], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 684, 0, 0.0, 231.1038011695906, 18, 1139, 203.0, 448.5, 506.5, 689.5499999999987, 11.44616620368821, 3.6775280088021685, 3.9346196325178218], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 359, 0, 0.0, 485.86072423398326, 30, 1227, 488.0, 913.0, 1006.0, 1125.3999999999992, 5.927711639119594, 299.8492401507521, 0.7872742020705711], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 687, 0, 0.0, 205.44250363901028, 13, 817, 182.0, 405.4000000000001, 465.80000000000007, 593.4000000000001, 11.435705368289637, 6.875715251768622, 1.5634753433208488], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 355, 0, 0.0, 182.44225352112664, 12, 790, 149.0, 375.40000000000003, 434.59999999999997, 674.28, 5.954677357129678, 2.238016473908449, 2.0411052269067547], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 296, 0, 0.0, 154.043918918919, 10, 632, 128.0, 306.20000000000005, 371.04999999999984, 512.8099999999993, 4.985431088205076, 1.041877200074108, 1.1003002206390111], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 254, 0, 0.0, 502.8110236220469, 29, 1172, 479.0, 950.5, 1003.5, 1147.2999999999997, 4.220951874501463, 216.08816287328003, 0.5605951708322254], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 754, 0, 0.0, 186.7586206896553, 6, 629, 166.0, 370.0, 449.5, 541.8000000000002, 12.585334913454957, 7.53627646634174, 2.925107138088164], "isController": false}, {"data": ["POST /users [Create User]", 921, 0, 0.0, 172.1802388707927, 9, 852, 151.0, 343.80000000000007, 387.9, 522.1199999999999, 15.295700264062578, 8.140777972572367, 9.246131311967515], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 756, 0, 0.0, 209.54497354497346, 16, 818, 190.0, 412.0, 477.7499999999999, 600.1499999999997, 12.58301293254107, 7.565388938474725, 1.7203337993708492], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 252, 0, 0.0, 188.05158730158732, 9, 921, 157.5, 376.9000000000001, 475.04999999999995, 665.0699999999999, 4.208838560978054, 1.5819842763553462, 1.442678061429001], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7054, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
