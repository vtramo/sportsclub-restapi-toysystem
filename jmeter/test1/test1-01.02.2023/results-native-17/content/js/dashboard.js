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

    var data = {"OkPercent": 98.96284190298306, "KoPercent": 1.0371580970169358};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.49973060828648913, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6382676606318779, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.3736981465136805, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.6450144807612743, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6405310101638664, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.3360203648705982, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.27867515092184697, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.38579387186629527, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.37528344671201813, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.6256084968284408, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.6323241317898486, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.5910372608257805, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.3699078812691914, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6034561815784949, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.40025037556334503, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 111362, 1155, 1.0371580970169358, 4928.8080853433175, 40, 51361, 15003.5, 27954.9, 34614.850000000006, 40650.900000000016, 73.31294704722531, 62.673944419254184, 20.033423363391584], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 5634, 85, 1.508697195598154, 3270.7896698615555, 40, 45550, 201.0, 10858.0, 15590.0, 25112.699999999986, 3.7142224261506573, 1.5936044341991282, 1.2768766240246374], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 5665, 22, 0.3883495145631068, 6177.196469549856, 50, 50833, 2518.0, 18993.800000000007, 25895.0, 34589.60000000002, 3.731409642911013, 6.774560823500372, 0.49557784319911896], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 4834, 98, 2.027306578402979, 3060.436491518411, 41, 41072, 201.0, 10652.0, 15199.5, 24846.79999999999, 3.187023001418799, 0.8567707406202366, 0.7059033539725048], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 4821, 112, 2.323169466915578, 3088.5332918481636, 40, 41338, 204.0, 10533.0, 15269.599999999999, 24814.839999999953, 3.178647087097304, 0.8289625699635322, 0.7692954584115468], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 11785, 72, 0.6109461179465422, 7773.832498939325, 87, 51133, 4445.0, 22997.6, 27024.199999999983, 37329.81999999999, 7.760656992131346, 14.26575126604566, 1.0307122567674443], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 6129, 89, 1.4521129058573992, 8438.721161690335, 49, 51361, 5738.0, 24170.0, 27780.0, 37621.899999999994, 4.0358239461521395, 1.6585670882475148, 1.3796120659711364], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 6821, 37, 0.5424424571177247, 6424.937985632604, 49, 50519, 2586.0, 19761.400000000023, 26286.9, 35515.89999999997, 4.4928441198478195, 8.226342892565631, 0.5967058596672885], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 6174, 41, 0.6640751538710722, 6456.810495626833, 81, 47694, 2379.5, 19648.5, 24850.0, 36028.75, 4.066197216492401, 2.718522546269952, 0.5559254006923204], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 6779, 106, 1.5636524561144711, 3371.3046172001764, 40, 46878, 216.0, 11222.0, 15680.0, 29122.59999999996, 4.469919859262473, 1.9502968888263212, 1.5366450625073356], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 5615, 111, 1.9768477292965272, 3186.2427426536046, 41, 42178, 226.0, 10702.200000000004, 15168.2, 26384.440000000017, 3.7032811136620403, 0.972274243506727, 0.8202427337123234], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 9930, 121, 1.2185297079556898, 3773.807250755284, 42, 43312, 353.0, 12264.399999999998, 16046.899999999998, 30513.350000000006, 6.545827051734446, 4.430224776523948, 1.5088248773728623], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 4885, 31, 0.6345957011258956, 6035.50706243603, 49, 48479, 2332.0, 18783.800000000003, 25492.0, 35758.10000000002, 3.2176430912559146, 5.920840484108729, 0.4273432230574262], "isController": false}, {"data": ["POST /users [Create User]", 17447, 107, 0.613285951739554, 3569.851665042708, 78, 46976, 328.0, 11589.200000000019, 15709.599999999991, 27511.160000000003, 11.498381382204695, 6.95642069505992, 6.950681714438189], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 9985, 49, 0.49073610415623437, 5404.827441161741, 80, 47399, 1756.0, 14738.599999999991, 23827.29999999999, 32817.99999999994, 6.576841350910219, 4.268317059946082, 0.8991775284447565], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 4858, 74, 1.5232606010703993, 3046.425072046107, 40, 47092, 192.0, 10419.800000000003, 14957.25, 24464.179999999986, 3.2041473195441115, 1.2967883810910457, 1.1015286974989447], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 528, 45.714285714285715, 0.4741294157791706], "isController": false}, {"data": ["500", 627, 54.285714285714285, 0.5630286812377652], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 111362, 1155, "500", 627, "400", 528, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST /reservations [Accept Reservation]", 5634, 85, "400", 57, "500", 28, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 5665, 22, "500", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 4834, 98, "400", 73, "500", 25, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 4821, 112, "400", 97, "500", 15, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 11785, 72, "500", 72, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 6129, 89, "500", 49, "400", 40, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 6821, 37, "500", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 6174, 41, "500", 41, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 6779, 106, "400", 68, "500", 38, "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 5615, 111, "400", 85, "500", 26, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 9930, 121, "500", 73, "400", 48, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 4885, 31, "500", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /users [Create User]", 17447, 107, "500", 107, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 9985, 49, "500", 49, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 4858, 74, "400", 60, "500", 14, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
