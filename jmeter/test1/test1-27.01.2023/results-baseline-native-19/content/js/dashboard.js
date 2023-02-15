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

    var data = {"OkPercent": 97.60953578246496, "KoPercent": 2.3904642175350377};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5317316198724217, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6504890201144122, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.4087912087912088, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.6618843683083512, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6523420713364847, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.3628059595601277, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.3462603878116344, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.40785244145109445, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.44796496651210715, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.6432428262881826, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.6514338575393155, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.6259036757967621, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.4036629261062884, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6271161182641869, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.4547802309094592, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.659919028340081, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 107385, 2567, 2.3904642175350377, 5102.05224193327, 38, 236118, 18361.0, 31797.9, 36033.95, 45749.46000000009, 70.69611828046183, 66.01034308659641, 19.29678874683502], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 5419, 200, 3.690717844620779, 3274.397305775975, 39, 40930, 178.0, 10762.0, 18243.0, 31579.200000000004, 3.572813127170786, 1.808003547058742, 1.2290642861181145], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 5460, 85, 1.5567765567765568, 6519.328205128207, 46, 49694, 1770.5, 20624.9, 27725.349999999995, 36366.55000000002, 3.596773970423451, 6.952566452210665, 0.4776965429468646], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 4670, 209, 4.475374732334047, 2973.9985010706573, 39, 46176, 165.5, 10070.800000000007, 17344.899999999994, 29624.829999999994, 3.081611227358901, 0.915093052946304, 0.6828006769151685], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 4654, 242, 5.199828104856038, 2985.7372152986704, 38, 45976, 185.0, 10053.5, 16245.5, 29982.89999999998, 3.0708526333848, 0.9749335426646608, 0.7434721081264763], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 11276, 202, 1.7914153955303298, 8120.440936502301, 83, 58806, 4177.5, 23201.200000000015, 28645.3, 36769.53, 7.426282163158238, 14.530818390775169, 0.9863030997944534], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 5776, 138, 2.389196675900277, 9621.5425900277, 47, 236118, 4090.0, 27177.000000000007, 35918.799999999996, 81284.9299999997, 3.803400540351538, 1.7785702912176082, 1.300274004233061], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 6533, 83, 1.2704729833154753, 6600.952701668458, 46, 57622, 1921.0, 20819.600000000002, 27249.59999999999, 36087.32, 4.3035388092510605, 8.195318433793155, 0.5715637481036564], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 5823, 69, 1.184956208140134, 6160.0522067662705, 76, 48604, 1274.0, 20116.40000000001, 24803.8, 35144.40000000001, 3.8354756800015806, 2.790132258207938, 0.5243814406252162], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 6482, 231, 3.5637149028077753, 3451.622647331066, 39, 44767, 188.5, 11133.499999999996, 18826.249999999985, 31320.420000000002, 4.273487368752777, 2.1580288135699375, 1.4701012928008022], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 5405, 247, 4.569842738205366, 3085.508788159115, 39, 46243, 190.0, 10239.400000000001, 17770.899999999994, 30918.919999999933, 3.563265599423021, 1.122008389661058, 0.7894922148744749], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 9821, 263, 2.677935037165258, 3796.7657061399104, 39, 46136, 234.0, 11732.000000000011, 21161.599999999995, 32757.820000000043, 6.473236354528497, 4.808040139082963, 1.4924599284770328], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 4723, 65, 1.376243912767309, 6326.546262968456, 47, 50707, 1856.0, 20607.4, 26780.800000000017, 35218.520000000004, 3.111215923523243, 5.957670302306041, 0.41320836484293066], "isController": false}, {"data": ["POST /users [Create User]", 16776, 219, 1.3054363376251787, 3878.2024320457685, 74, 46636, 289.0, 12308.900000000003, 20994.449999999997, 34137.47999999997, 11.056103000490328, 7.587777326264769, 6.6833278879917115], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 9874, 137, 1.3874822766862467, 5474.597427587598, 77, 48865, 1112.0, 19050.5, 24198.0, 34577.0, 6.502962028734478, 4.879697682488302, 0.8890768398660419], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 4693, 177, 3.7715746857021095, 3258.099083741744, 39, 45953, 173.0, 10813.000000000002, 18242.300000000007, 33336.520000000295, 3.0969252474966575, 1.6027970085685117, 1.065358133124232], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 1171, 45.617452278924816, 1.0904688736788193], "isController": false}, {"data": ["500", 1396, 54.382547721075184, 1.2999953438562182], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 107385, 2567, "500", 1396, "400", 1171, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST /reservations [Accept Reservation]", 5419, 200, "400", 135, "500", 65, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 5460, 85, "500", 85, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 4670, 209, "400", 173, "500", 36, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 4654, 242, "400", 204, "500", 38, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 11276, 202, "500", 202, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 5776, 138, "500", 75, "400", 63, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 6533, 83, "500", 83, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 5823, 69, "500", 69, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 6482, 231, "400", 154, "500", 77, "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 5405, 247, "400", 197, "500", 50, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 9821, 263, "500", 134, "400", 129, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 4723, 65, "500", 65, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /users [Create User]", 16776, 219, "500", 219, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 9874, 137, "500", 137, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 4693, 177, "400", 116, "500", 61, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
