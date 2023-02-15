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

    var data = {"OkPercent": 99.76471501409284, "KoPercent": 0.23528498590715702};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5461134316193914, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6663930688554491, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.4478977065890062, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.6836497890295359, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6812896405919662, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.352577363110567, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.3379786718371304, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.4326675745195945, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.44378769601930035, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.6485542991576231, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.6659356725146199, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.6197895705168746, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.45835958832178114, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6539019050999881, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.4211551684620674, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.6784548994842649, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 206133, 485, 0.23528498590715702, 2638.8605463462745, 39, 215588, 10506.0, 20522.700000000004, 26884.20000000001, 39539.660000000375, 136.64730090208576, 113.01900886780878, 37.65922775353927], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 10965, 32, 0.2918376652986776, 1818.9892384860927, 39, 32200, 160.0, 6256.599999999997, 9602.399999999987, 18648.760000000002, 7.288838073460054, 2.824028767727697, 2.509991953569802], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 10988, 12, 0.10921004732435384, 2790.4049872588253, 47, 34633, 1162.0, 8275.1, 11931.099999999984, 19461.510000000024, 7.293296313725906, 13.054702569222595, 0.968640916666722], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9480, 39, 0.41139240506329117, 1650.63154008439, 39, 32447, 135.0, 5415.699999999995, 9183.899999999998, 16856.60000000007, 6.301821346023837, 1.4138576897675839, 1.3962639107055845], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9460, 51, 0.5391120507399577, 1682.7822410148021, 39, 32978, 138.0, 5478.999999999996, 9279.949999999977, 17273.17, 6.291608749725656, 1.5150685972821714, 1.5230579396644033], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 23687, 49, 0.2068645248448516, 3830.4271541351736, 85, 34249, 2681.0, 11491.000000000015, 14278.95, 23805.75000000004, 15.717137964051036, 28.292415546385698, 2.0874323858505286], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 8252, 32, 0.3877847794474067, 7772.396631119737, 48, 215588, 2251.5, 21758.3, 32126.49999999997, 62326.71000000002, 5.471092779841555, 1.8484211808265116, 1.8700885275537016], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 13218, 17, 0.12861249810863973, 2967.3585262520783, 46, 34027, 1255.0, 8701.600000000002, 12497.549999999992, 21183.809999999998, 8.771400112678448, 15.71794867780334, 1.1649515774651065], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 8290, 19, 0.22919179734620024, 3221.6634499396864, 78, 35423, 1241.0, 9620.600000000002, 13327.599999999999, 23240.36, 5.50119612859129, 3.409098685585738, 0.7521166582058403], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 13177, 48, 0.36427107839417167, 1899.413068224939, 39, 32650, 190.0, 6467.600000000002, 9853.799999999988, 18338.539999999994, 8.75846135030655, 3.419637584970767, 3.0160482492632044], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 10944, 42, 0.38377192982456143, 1779.9925073099375, 39, 32090, 157.0, 5747.5, 9532.5, 18396.649999999983, 7.2782217303865755, 1.6108867552026251, 1.612586379628361], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 17393, 46, 0.264474213764158, 2104.967400678433, 40, 32439, 262.0, 7065.0, 10176.3, 18815.680000000102, 11.561189287637177, 7.049193750913967, 2.6646064404375744], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9522, 12, 0.1260239445494644, 2682.3064482251607, 45, 34007, 1117.0, 7860.4000000000015, 11672.250000000002, 19874.560000000012, 6.3181740065729715, 11.319803864639658, 0.8391324852479728], "isController": false}, {"data": ["POST /users [Create User]", 33804, 34, 0.10057981303987694, 1895.7051828186063, 74, 32838, 1368.0, 9254.0, 11000.0, 20244.970000000005, 22.467668331381493, 12.242435942320755, 13.581529977661274], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 17452, 25, 0.1432500573000229, 3096.766788906719, 79, 32997, 1311.0, 8943.400000000001, 12694.0, 21335.150000000052, 11.58036248684502, 7.065563830593735, 1.5832526837483427], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9501, 27, 0.2841806125670982, 1704.5627828649622, 39, 32389, 136.0, 5697.0, 9285.8, 17152.45999999999, 6.316599872883497, 2.405710958837057, 2.175233867232065], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 213, 43.91752577319588, 0.10333134432623597], "isController": false}, {"data": ["500", 272, 56.08247422680412, 0.13195364158092104], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 206133, 485, "500", 272, "400", 213, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST /reservations [Accept Reservation]", 10965, 32, "400", 20, "500", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 10988, 12, "500", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9480, 39, "400", 27, "500", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9460, 51, "400", 39, "500", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 23687, 49, "500", 49, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 8252, 32, "400", 19, "500", 13, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 13218, 17, "500", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 8290, 19, "500", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 13177, 48, "400", 30, "500", 18, "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 10944, 42, "400", 31, "500", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 17393, 46, "400", 25, "500", 21, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9522, 12, "500", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /users [Create User]", 33804, 34, "500", 34, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 17452, 25, "500", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9501, 27, "400", 22, "500", 5, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
