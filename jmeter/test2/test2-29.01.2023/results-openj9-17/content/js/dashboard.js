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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9994980549629816, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9990366088631984, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.9991462720546386, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.9954853273137697, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.9987966305655837, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.9997589199614272, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.9995271867612293, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [1.0, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [1.0, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 39845, 0, 0.0, 92.3490776759943, 38, 921, 85.0, 182.0, 221.0, 287.9900000000016, 642.63019531313, 516.541979319549, 176.70005634807993], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 2076, 0, 0.0, 51.07129094412322, 39, 522, 44.0, 56.0, 68.0, 195.0, 33.90384112882153, 12.77397081999608, 11.637715343896982], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 2080, 0, 0.0, 104.27211538461543, 48, 430, 94.0, 158.0, 196.94999999999982, 304.0, 33.880635913474066, 60.720547618175004, 4.499771957258274], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 1757, 0, 0.0, 52.021058622652305, 38, 525, 45.0, 59.0, 78.0, 198.42000000000007, 28.750490901950517, 6.020452202513418, 6.3573720177706505], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 1754, 0, 0.0, 49.26624857468646, 39, 226, 43.0, 55.0, 66.5, 184.0, 28.75598399895075, 6.498969322783461, 6.948281572767066], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 4342, 0, 0.0, 141.43643482266188, 85, 491, 127.0, 192.0, 237.0, 343.0, 70.03677656623009, 125.46241642605975, 9.301759387702432], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 2215, 0, 0.0, 155.40135440180563, 55, 921, 123.0, 251.0, 271.0, 489.08000000000175, 36.05906197600404, 11.597591831564296, 12.395302554251387], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 2499, 0, 0.0, 100.2072829131654, 48, 466, 90.0, 141.0, 195.0, 291.0, 40.712924194783405, 72.95480788028868, 5.40718524461967], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 2218, 0, 0.0, 121.49864743011717, 82, 487, 111.0, 156.0, 166.0, 323.0, 35.78746954515385, 21.565317955652905, 4.892818101876503], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 2493, 0, 0.0, 54.09626955475329, 39, 538, 43.0, 62.0, 120.0, 198.0, 40.71467067335173, 15.338909978197318, 13.975110008614918], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 2074, 0, 0.0, 50.359209257473495, 39, 525, 45.0, 59.0, 70.25, 178.0, 33.941575975779394, 7.1073708933393345, 7.5051237368054995], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 1761, 0, 0.0, 103.83702441794426, 48, 423, 94.0, 150.0, 205.6999999999996, 316.75999999999976, 28.682183168558726, 51.38984994686223, 3.8093524520742057], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 3233, 0, 0.0, 56.78657593566341, 39, 265, 45.0, 84.0, 147.0, 198.65999999999985, 52.73287771779022, 31.385408468781094, 12.256274313314522], "isController": false}, {"data": ["POST /users [Create User]", 6345, 0, 0.0, 91.13884948778586, 74, 574, 82.0, 94.0, 131.0, 250.0, 102.41965424286936, 54.55294305176672, 61.91188083626576], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 3240, 0, 0.0, 132.59197530864253, 81, 489, 118.0, 176.0, 254.0, 329.59000000000015, 52.27239727021926, 31.50563019799784, 7.146616814287789], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 1758, 0, 0.0, 49.52389078498296, 39, 490, 43.0, 55.0, 69.0, 189.28000000000065, 28.71047818134309, 10.817799644181147, 9.8551442924043], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 39845, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
