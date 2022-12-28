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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9005704971475142, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9863945578231292, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.37748344370860926, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.9963235294117647, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9926470588235294, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.9657320872274143, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.40606060606060607, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.9736434108527132, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.9876543209876543, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.9965753424657534, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.986469864698647, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.35815602836879434, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9902597402597403, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.9632802937576499, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.9926470588235294, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4908, 0, 0.0, 373.67726161369126, 41, 5809, 160.0, 751.2000000000007, 1289.5500000000002, 4065.6699999999946, 77.57476133274325, 404.850926193929, 19.301279008543023], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 147, 0, 0.0, 127.81632653061223, 43, 707, 87.0, 247.00000000000009, 419.39999999999924, 660.440000000001, 2.4772497472194135, 0.9310916171638017, 0.8456958838894506], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 151, 0, 0.0, 1644.973509933775, 49, 5592, 1076.0, 3761.8, 4361.6, 5399.079999999996, 2.4090234680365663, 89.30266074448397, 0.31994842934860646], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 136, 0, 0.0, 97.87499999999999, 44, 607, 73.0, 156.3, 214.15, 562.9699999999995, 2.3586541796739504, 0.49170243669788416, 0.5193429153659382], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 136, 0, 0.0, 105.14705882352936, 42, 739, 75.5, 204.0, 241.0500000000005, 695.7099999999995, 2.3563248263076737, 0.5303355163989812, 0.5671530918100387], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 209, 0, 0.0, 1484.8038277511966, 87, 5809, 1007.0, 3473.0, 4419.5, 5660.4000000000015, 3.3034077258645764, 106.10669221604918, 0.438733838591389], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 642, 0, 0.0, 227.677570093458, 48, 1140, 176.0, 444.0, 582.1000000000001, 748.2800000000002, 10.771450622462334, 3.435697024638435, 3.681648161974431], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 165, 0, 0.0, 1566.7090909090914, 73, 5638, 1095.0, 3686.0, 4292.099999999998, 5167.420000000003, 2.6292306711708844, 93.46658275204761, 0.34919469851488305], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 645, 0, 0.0, 237.4341085271317, 83, 1159, 194.0, 405.0, 509.0999999999998, 815.6199999999999, 10.737830458813345, 6.342340009447626, 1.4680627580408872], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 162, 0, 0.0, 111.98148148148152, 41, 700, 77.0, 231.6000000000003, 337.4, 655.2700000000003, 2.728880653583761, 1.0255674639939358, 0.9315220194980207], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 146, 0, 0.0, 102.24657534246579, 41, 577, 77.0, 205.60000000000002, 253.60000000000002, 520.6000000000001, 2.530197736686134, 0.5273840289932932, 0.5570347837200839], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 813, 0, 0.0, 119.77859778597784, 42, 652, 84.0, 225.80000000000007, 364.1999999999998, 635.0, 13.650329924948371, 8.088240888236875, 3.145974474890445], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 141, 0, 0.0, 1706.8581560283692, 51, 5609, 1161.0, 3969.3999999999996, 4350.3, 5481.740000000003, 2.2484093699669914, 85.87720356077881, 0.29861686944874105], "isController": false}, {"data": ["POST /users [Create User]", 462, 0, 0.0, 177.1645021645022, 80, 1086, 134.0, 300.09999999999997, 400.69999999999993, 703.3200000000002, 7.861287413432252, 4.1798317352685945, 4.752086825111879], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 817, 0, 0.0, 246.98164014687893, 82, 1182, 203.0, 420.0, 588.5999999999985, 764.6399999999999, 13.602157698454981, 8.034154844207844, 1.859669997835642], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 136, 0, 0.0, 120.01470588235293, 51, 618, 78.0, 248.79999999999998, 344.4500000000003, 600.6099999999998, 2.359800111049417, 0.8871448099580095, 0.8056572845814826], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4908, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
