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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9344628695025234, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9705882352941176, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.7663230240549829, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.991869918699187, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9878048780487805, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.7801587301587302, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.9696296296296296, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.7632311977715878, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.9771386430678466, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.9887640449438202, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.9965277777777778, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.7569721115537849, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9809004092769441, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.9884615384615385, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.9769021739130435, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.9757085020242915, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6935, 0, 0.0, 260.39005046863696, 8, 1340, 198.0, 581.0, 760.3999999999996, 1045.2800000000007, 114.12632063983148, 1271.5062635252443, 30.149884649721884], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 289, 0, 0.0, 193.28719723183377, 10, 861, 157.0, 396.0, 518.5, 650.5000000000015, 4.825513441309067, 1.8139375313073969, 1.6540578299799633], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 291, 0, 0.0, 491.6701030927834, 36, 1232, 467.0, 967.4000000000001, 1046.3999999999999, 1168.9599999999994, 4.829154151247117, 242.1529162137606, 0.6413720357125077], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 246, 0, 0.0, 168.00813008130092, 10, 599, 134.0, 323.0, 412.1999999999998, 557.5600000000001, 4.192086159299274, 0.8760805059473092, 0.9252065156265976], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 246, 0, 0.0, 166.68699186991873, 10, 853, 130.5, 336.1000000000001, 424.65, 611.83, 4.188089482106983, 0.9447740921549934, 1.010212990312915], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 630, 0, 0.0, 479.7396825396824, 33, 1294, 436.0, 946.6999999999999, 1040.7999999999997, 1175.8699999999985, 10.36763979857157, 485.1967839488777, 1.3769521607477866], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 675, 0, 0.0, 235.16592592592596, 26, 1340, 206.0, 434.4, 529.1999999999996, 690.3200000000004, 11.26426807289233, 3.6190861288882585, 3.8720921500567385], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 359, 0, 0.0, 488.1559888579388, 34, 1197, 465.0, 926.0, 1000.0, 1151.3999999999992, 5.977953175475405, 299.14000251336296, 0.7939469061178273], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 678, 0, 0.0, 207.59882005899718, 13, 701, 186.0, 416.0, 496.0999999999999, 609.8400000000001, 11.254980079681275, 6.767931529091965, 1.5387668077689243], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 356, 0, 0.0, 180.66573033707874, 8, 938, 151.5, 324.80000000000007, 416.1999999999998, 848.8900000000001, 6.004689054936158, 2.256947006721541, 2.0582479084790934], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 288, 0, 0.0, 166.6458333333334, 10, 582, 141.5, 324.4000000000001, 401.4000000000001, 500.4100000000004, 4.8907229099801315, 1.022084670640379, 1.0793978297417086], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 251, 0, 0.0, 506.6613545816733, 27, 1156, 489.0, 966.6000000000001, 1031.7999999999997, 1109.28, 4.156523755112856, 210.85347167022704, 0.5520383112259261], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 733, 0, 0.0, 190.5457025920873, 9, 721, 170.0, 375.80000000000007, 458.1999999999998, 593.3199999999999, 12.245648033679707, 7.313728428113202, 2.8461564765779013], "isController": false}, {"data": ["POST /users [Create User]", 910, 0, 0.0, 177.78241758241748, 10, 923, 150.5, 342.69999999999993, 401.44999999999993, 605.67, 15.089458935115328, 8.031010859021341, 9.121460039879285], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 736, 0, 0.0, 218.2065217391305, 16, 680, 199.5, 417.0, 478.44999999999993, 617.41, 12.199569036963368, 7.335905773454335, 1.6679098292723356], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 247, 0, 0.0, 186.34008097166006, 8, 677, 150.0, 368.6, 499.79999999999995, 618.8400000000001, 4.130089457403227, 1.552277976339771, 1.415684960496614], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6935, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
