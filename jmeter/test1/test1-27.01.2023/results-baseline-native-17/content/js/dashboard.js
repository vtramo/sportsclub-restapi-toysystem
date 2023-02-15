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

    var data = {"OkPercent": 98.8827581166755, "KoPercent": 1.1172418833245026};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5173752580709993, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6413023596122188, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.3931297709923664, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.6511012282930961, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6496598639455783, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.35503320517301645, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.3256547041707081, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.3930355791067373, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.41631899871630296, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.6294010059442158, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.6367388114453412, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.6142657899980075, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.3929320469798658, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6136806088136393, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.43964321110009913, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.6510328836424958, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 109466, 1223, 1.1172418833245026, 5023.700390988988, 38, 53742, 15280.0, 28769.700000000004, 34933.9, 40319.64000000006, 71.919776986013, 61.73860555669893, 19.59368029067735], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 5467, 100, 1.8291567587342235, 3331.537955002746, 38, 40855, 177.0, 11214.0, 15707.999999999985, 27751.99999999997, 3.597493927954048, 1.538958175267114, 1.2361507927466442], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 5502, 39, 0.7088331515812432, 6386.764631043257, 46, 53742, 2292.5, 19987.199999999997, 26553.799999999985, 35679.500000000015, 3.6176162525782583, 6.686417698572744, 0.4804646585455499], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 4722, 89, 1.8847945785684033, 3157.3862770012697, 39, 41239, 177.5, 10840.599999999999, 15508.0, 27685.359999999873, 3.1086650252142887, 0.8404115652444404, 0.6885171299161279], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 4704, 108, 2.295918367346939, 3128.664965986395, 39, 41491, 154.0, 10834.0, 14981.5, 25830.999999999985, 3.0958896536473453, 0.8485825869205244, 0.7492368971768435], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 11444, 96, 0.8388675288360713, 8029.118315274384, 83, 53720, 4505.0, 24305.5, 27922.75, 37742.2, 7.522731216836614, 14.00113815800069, 0.9991127397361127], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 6186, 96, 1.5518913676042676, 8314.945037180725, 45, 52134, 5132.0, 25053.700000000004, 28582.799999999996, 37451.13, 4.065166204576565, 1.6357078055413354, 1.3896902111786813], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 6605, 43, 0.6510219530658592, 6663.659651778955, 46, 52415, 2433.0, 20526.4, 26648.899999999998, 37569.299999999945, 4.342923270638749, 8.001738140178452, 0.5767944968817088], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 6232, 53, 0.8504492939666238, 6477.55584082157, 76, 49781, 1931.0, 20332.399999999998, 25158.05, 35757.42, 4.0969030647227855, 2.8259008229552136, 0.5601234658800683], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 6561, 123, 1.8747142203932328, 3451.4855967078292, 38, 45304, 205.0, 11433.8, 15983.299999999997, 30520.18000000001, 4.317552320955823, 1.9353360878622883, 1.4835378202875604], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 5452, 130, 2.3844460748349228, 3281.562545854732, 38, 45665, 187.0, 11128.5, 15526.849999999973, 28157.810000000107, 3.589834421191875, 0.9781057271505261, 0.7951330000483956], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 10038, 116, 1.1556086869894402, 3720.0238095238105, 39, 45093, 261.0, 11999.200000000004, 16475.05, 29034.770000000033, 6.60467735907653, 4.414536287974592, 1.5224011241456292], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 4768, 19, 0.39848993288590606, 6270.0100671140835, 45, 53248, 2261.0, 19838.600000000002, 26332.100000000006, 35409.04000000004, 3.1348436424411017, 5.696788476211546, 0.4163464212617088], "isController": false}, {"data": ["POST /users [Create User]", 16951, 92, 0.5427408412483039, 3638.5858651406857, 74, 43917, 297.0, 11629.800000000001, 16175.799999999997, 28010.839999999986, 11.150983300825255, 6.653767593009832, 6.740682288291829], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 10090, 54, 0.535183349851338, 5365.4410307234775, 76, 46258, 1346.0, 15528.699999999999, 24124.59999999999, 32431.39000000001, 6.633597296595433, 4.340167989975641, 0.9069371303939068], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 4744, 65, 1.370151770657673, 3299.565767284991, 39, 45658, 166.0, 11177.5, 15861.0, 29392.15000000003, 3.1228873278840794, 1.397208863908204, 1.0730103792063364], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 540, 44.15372035977106, 0.49330385690534045], "isController": false}, {"data": ["500", 683, 55.84627964022894, 0.6239380264191621], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 109466, 1223, "500", 683, "400", 540, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST /reservations [Accept Reservation]", 5467, 100, "400", 73, "500", 27, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 5502, 39, "500", 39, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 4722, 89, "400", 64, "500", 25, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 4704, 108, "400", 88, "500", 20, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 11444, 96, "500", 96, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 6186, 96, "400", 51, "500", 45, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 6605, 43, "500", 43, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 6232, 53, "500", 53, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 6561, 123, "400", 79, "500", 44, "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 5452, 130, "400", 100, "500", 30, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 10038, 116, "500", 65, "400", 51, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 4768, 19, "500", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /users [Create User]", 16951, 92, "500", 92, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 10090, 54, "500", 54, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 4744, 65, "400", 34, "500", 31, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
