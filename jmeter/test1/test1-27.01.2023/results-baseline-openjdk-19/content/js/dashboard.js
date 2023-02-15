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

    var data = {"OkPercent": 99.76282536772034, "KoPercent": 0.23717463227966676};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.541672479770399, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6560836679428518, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.44542745390203015, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.6731909845788849, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.675010813148789, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.35253205824820694, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.34712482468443195, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.4298851466708055, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.45156369183829137, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.6348266458901441, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.6572618379187722, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.6106629769194536, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.4530998173417857, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.646106749916649, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.4212688538059745, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.671962516156829, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 200696, 476, 0.23717463227966676, 2715.995490692384, 38, 186484, 11552.0, 21338.500000000007, 28234.95, 46958.58000000087, 132.10011110584543, 107.94346784594859, 36.451195868810856], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 10709, 29, 0.2708002614623214, 1838.1888131478217, 38, 32503, 204.0, 5752.0, 10254.5, 17522.599999999984, 7.1094877039521425, 2.6854659970776016, 2.446326674785915], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 10738, 11, 0.10243993294840753, 2853.00568075993, 48, 34078, 1148.0, 7733.000000000004, 12702.0, 21904.100000000006, 7.120755762984537, 12.79863934102339, 0.9457253747713837], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9273, 39, 0.42057586541572306, 1727.3285883748533, 38, 32742, 175.0, 5314.6, 10062.799999999988, 17612.220000000023, 6.154550703860782, 1.2938881131818754, 1.3637626705725796], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9248, 48, 0.5190311418685121, 1717.6807958477534, 38, 32638, 167.0, 5288.300000000001, 10043.499999999993, 17661.40000000001, 6.141341160532852, 1.3931064256886432, 1.486800290822188], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 23005, 48, 0.2086502934144751, 3946.360182569005, 81, 35291, 2636.0, 12396.900000000001, 14389.700000000004, 24206.400000000096, 15.249146730531237, 27.388879657726093, 2.02527730014868], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 7843, 25, 0.3187555782226189, 8464.02575545073, 49, 186484, 2248.0, 23321.80000000001, 37245.39999999998, 79806.35999999988, 5.163435267783666, 1.6626739225698672, 1.7749694484676914], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 12886, 17, 0.13192612137203166, 3033.590485798548, 45, 33820, 1267.0, 8640.100000000008, 13059.949999999999, 22207.0, 8.54482085450861, 15.354838827659995, 1.1348590197394248], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 7866, 12, 0.15255530129672007, 3186.20111873888, 78, 33868, 1193.0, 9639.6, 13403.599999999999, 22902.149999999994, 5.214911225185913, 3.145010516754212, 0.7129761440683866], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 12835, 49, 0.3817686014803272, 1971.2987923646224, 38, 32670, 253.0, 6198.199999999997, 10555.999999999978, 19681.639999999985, 8.51830024237501, 3.216707911110027, 2.9313078063070597], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 10686, 45, 0.4211117349803481, 1860.524611641402, 38, 32513, 197.0, 5686.800000000007, 10343.599999999999, 19709.909999999996, 7.096041596111322, 1.4915977143803414, 1.5723511603864109], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 16984, 48, 0.2826189354686764, 2184.9530734809246, 39, 32655, 321.0, 7280.5, 11030.0, 20117.15000000009, 11.270746096316302, 6.422463979476213, 2.61964570710925], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9307, 11, 0.11819060921886752, 2739.0944450413663, 48, 34448, 1094.0, 7328.800000000003, 12533.800000000007, 20429.880000000005, 6.1718366104567774, 11.091295970467758, 0.8196970498262907], "isController": false}, {"data": ["POST /users [Create User]", 32993, 38, 0.11517594641287546, 1936.6504713120978, 74, 32717, 1260.0, 9821.0, 11591.900000000001, 21089.94000000001, 21.890187466204, 11.662207141074042, 13.232447306230739], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 17039, 25, 0.14672222548271613, 3150.9431891543, 78, 34565, 1303.0, 8960.0, 13178.0, 22340.799999999952, 11.296314957623073, 6.814377437858335, 1.5444180606125297], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9284, 31, 0.3339077983627747, 1742.0482550624733, 38, 32574, 174.5, 5328.0, 10133.0, 18099.149999999994, 6.16156521277443, 2.3269513569264513, 2.1200919367135445], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 212, 44.53781512605042, 0.10563239925060788], "isController": false}, {"data": ["500", 264, 55.46218487394958, 0.13154223302905887], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 200696, 476, "500", 264, "400", 212, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST /reservations [Accept Reservation]", 10709, 29, "400", 18, "500", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 10738, 11, "500", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9273, 39, "400", 31, "500", 8, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9248, 48, "400", 39, "500", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 23005, 48, "500", 48, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 7843, 25, "500", 13, "400", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 12886, 17, "500", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 7866, 12, "500", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 12835, 49, "400", 33, "500", 16, "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 10686, 45, "400", 29, "500", 16, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 16984, 48, "400", 24, "500", 24, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9307, 11, "500", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /users [Create User]", 32993, 38, "500", 38, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 17039, 25, "500", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9284, 31, "400", 26, "500", 5, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
