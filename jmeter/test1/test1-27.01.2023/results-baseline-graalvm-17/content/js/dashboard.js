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

    var data = {"OkPercent": 99.7478194918468, "KoPercent": 0.2521805081532044};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.57847459233978, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.684553210597216, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.4863823687511199, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.6961979166666666, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6996866840731071, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.4008175650048464, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.4158812696349258, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.4735761737702471, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.5069166756727548, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.666754044337927, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.6849068490684906, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.4925373134328358, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.64764988277325, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.6751649057264608, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.47492764915405167, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.6944819702795386, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 210960, 532, 0.2521805081532044, 2580.4233883200445, 38, 125070, 11398.0, 22123.0, 29007.100000000013, 39698.97000000016, 139.51854989593645, 113.67840209252198, 38.420495716886], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 11135, 46, 0.4131118096093399, 1779.574584643014, 38, 32460, 144.0, 5628.199999999999, 9945.199999999977, 19094.359999999913, 7.399890480291769, 2.7907993725876423, 2.543034811550342], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 11162, 19, 0.1702203906110016, 2786.630352983332, 46, 34438, 996.0, 7954.900000000005, 12453.700000000008, 22160.77000000002, 7.406906034086898, 13.312020261076517, 0.983729707652166], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9600, 36, 0.375, 1678.1478125000006, 38, 32491, 122.0, 5394.899999999996, 9809.449999999988, 17043.89, 6.378038288161099, 1.3405072336338542, 1.4133034470058101], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9575, 46, 0.4804177545691906, 1641.5890339425596, 38, 32807, 109.0, 5186.399999999998, 9635.0, 17712.639999999992, 6.363758412456617, 1.4433746327546466, 1.540675595410185], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 23729, 46, 0.19385561970584517, 3823.9382611993856, 82, 35310, 2442.0, 12079.800000000003, 14705.0, 24515.43000000009, 15.740557091940534, 28.28589879163911, 2.0905427387733524], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 9231, 24, 0.25999350016249595, 6825.263785072048, 46, 125070, 1802.0, 20229.40000000001, 30050.8, 54330.56000000002, 6.106640963778906, 1.96650301983021, 2.099186902715474], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 13397, 21, 0.15675151153243264, 2919.900947973422, 46, 34549, 1063.0, 8670.200000000008, 12749.099999999984, 22711.90000000002, 8.89077362406037, 15.980544671873579, 1.180805871945518], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 9253, 9, 0.09726575164811413, 3041.113800929423, 79, 34811, 894.0, 9477.2, 13562.19999999999, 22888.659999999894, 6.138950055763401, 3.705430433912906, 0.8393095779364025], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 13352, 62, 0.46434991012582383, 1896.0152037147968, 38, 32501, 163.0, 6063.600000000006, 10312.399999999994, 19846.149999999907, 8.870246077580108, 3.3447303091349183, 3.048319261262362], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 11111, 57, 0.5130051300513006, 1741.5750157501582, 38, 32210, 136.0, 5510.800000000001, 9763.399999999987, 18494.519999999837, 7.3843924873393325, 1.5531060069218294, 1.636330528989938], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9648, 9, 0.09328358208955224, 2649.0173092868977, 46, 33878, 966.0, 7450.4000000000015, 11890.099999999999, 20076.200000000026, 6.403177165187105, 11.51560128902268, 0.8504219672514123], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 17914, 54, 0.30144021435748575, 2026.2001786312348, 38, 32560, 208.0, 6677.5, 10658.5, 19781.249999999993, 11.903867992921736, 7.117361391562767, 2.766832880822107], "isController": false}, {"data": ["POST /users [Create User]", 34262, 44, 0.12842215865973966, 1854.4729729729725, 74, 32636, 1170.0, 9532.900000000001, 11584.95, 21605.660000000054, 22.753232815870284, 12.12125335596404, 13.754151477562212], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 17968, 35, 0.19479073909171862, 3020.5868766696367, 79, 35056, 1037.0, 9118.500000000002, 13228.849999999995, 22925.0, 11.919862014063952, 7.192917932988921, 1.6296686347353058], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9623, 24, 0.24940247324119297, 1692.3008417333485, 38, 32491, 131.0, 5422.200000000003, 9820.999999999996, 17954.24000000002, 6.395031240820807, 2.4130172090752557, 2.197694277193005], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 239, 44.92481203007519, 0.11329161926431551], "isController": false}, {"data": ["500", 293, 55.07518796992481, 0.1388888888888889], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 210960, 532, "500", 293, "400", 239, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST /reservations [Accept Reservation]", 11135, 46, "400", 31, "500", 15, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 11162, 19, "500", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9600, 36, "400", 24, "500", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9575, 46, "400", 36, "500", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 23729, 46, "500", 46, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 9231, 24, "500", 15, "400", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 13397, 21, "500", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 9253, 9, "500", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 13352, 62, "400", 41, "500", 21, "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 11111, 57, "400", 46, "500", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9648, 9, "500", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 17914, 54, "400", 35, "500", 19, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /users [Create User]", 34262, 44, "500", 44, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 17968, 35, "500", 35, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9623, 24, "400", 17, "500", 7, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
