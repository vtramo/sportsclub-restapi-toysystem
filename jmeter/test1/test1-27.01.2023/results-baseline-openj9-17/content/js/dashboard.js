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

    var data = {"OkPercent": 99.72614744221711, "KoPercent": 0.2738525577828897};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5502555163430444, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6698911185098533, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.44755966265924996, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.681195777150622, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6855151451629808, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.35780982950518986, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.34902840059790735, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.43687794656888423, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.45251460648413333, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.6505065666041275, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.6709185973136212, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.45734498543487306, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6269677921788952, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.6560133337232082, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.4356251732741891, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.6856278050307901, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 209967, 575, 0.2738525577828897, 2593.761005300842, 38, 196523, 10408.0, 20503.500000000007, 26972.35000000001, 37818.93000000001, 139.08673221993467, 113.79092864072854, 38.30462210654128], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 11113, 47, 0.42292810222262217, 1773.11347070998, 38, 32148, 162.0, 5910.6, 9551.899999999998, 17674.96000000005, 7.381777312509632, 2.7898946354745116, 2.5429614484720324], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 11146, 18, 0.16149291225551768, 2808.4189843890317, 46, 34730, 1146.0, 8224.900000000003, 12012.65, 20982.42000000001, 7.392261404582725, 13.287171190566278, 0.9817847177961432], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9567, 34, 0.355388313996028, 1669.303334378592, 38, 32370, 147.0, 5508.000000000004, 9347.400000000001, 17568.27999999999, 6.353133834173047, 1.3352847631453821, 1.407774475909623], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9541, 47, 0.49261083743842365, 1681.5224819201337, 38, 32239, 130.0, 5484.0, 9364.699999999999, 17920.299999999996, 6.350193081544173, 1.4401553028122285, 1.5373602138872287], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 23989, 53, 0.22093459502271875, 3786.641085497522, 83, 35215, 2655.0, 11743.900000000001, 13770.600000000006, 24377.200000000128, 15.903395605998329, 28.576740272934593, 2.112169728921653], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 8697, 36, 0.41393583994480854, 7306.395538691514, 50, 196523, 2366.0, 20803.399999999998, 30675.700000000004, 54230.14000000003, 5.762816086851079, 1.8555637429530243, 1.9810197971319108], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 13363, 21, 0.1571503404924044, 2958.2665569108744, 48, 34712, 1220.0, 8704.400000000001, 12187.599999999999, 20944.680000000008, 8.86219920218322, 15.930382501707712, 1.1770108315399588], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 8729, 17, 0.19475312177798143, 3138.274258219728, 77, 35492, 1175.0, 9322.0, 12367.0, 21362.600000000006, 5.788856931209493, 3.490589356401664, 0.7914452835637978], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 13325, 60, 0.450281425891182, 1861.3652532833005, 38, 32687, 190.0, 6264.199999999999, 9679.399999999998, 17917.579999999994, 8.85652757653502, 3.346967501279461, 3.0509682101755353], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 11093, 64, 0.5769404128729829, 1749.0359686288664, 38, 32285, 157.0, 5745.0, 9511.799999999996, 17591.259999999966, 7.371151043808943, 1.5505927096837642, 1.6333887916707919], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9612, 9, 0.09363295880149813, 2667.329692051604, 47, 34558, 1086.0, 7802.900000000005, 11629.500000000004, 19996.29000000005, 6.374783130037088, 11.464639838556229, 0.8466508844580506], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 17977, 61, 0.3393224675974857, 2022.9589475440891, 38, 32622, 239.0, 6890.4000000000015, 9857.0, 18499.920000000042, 11.935896593186905, 7.175710645261794, 2.7742931444617294], "isController": false}, {"data": ["POST /users [Create User]", 34199, 41, 0.11988654639024533, 1862.5211555893407, 73, 32538, 1358.0, 9332.800000000003, 10746.800000000003, 20919.100000000144, 22.69778345017724, 12.092270924674672, 13.720632769198938], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 18035, 40, 0.22179096201829776, 3013.889548100925, 77, 34930, 1206.0, 8915.799999999997, 12272.600000000002, 20963.15999999999, 11.956781885359423, 7.210023307147418, 1.6347162733889837], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9581, 27, 0.2818077444943117, 1671.5225968061773, 38, 32396, 144.0, 5629.0000000000055, 9335.399999999998, 17193.440000000002, 6.3643580009499034, 2.406479276478579, 2.1924628134102555], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 248, 43.130434782608695, 0.11811379883505503], "isController": false}, {"data": ["500", 327, 56.869565217391305, 0.15573875894783465], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 209967, 575, "500", 327, "400", 248, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST /reservations [Accept Reservation]", 11113, 47, "400", 31, "500", 16, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 11146, 18, "500", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9567, 34, "400", 27, "500", 7, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9541, 47, "400", 31, "500", 16, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 23989, 53, "500", 53, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 8697, 36, "500", 20, "400", 16, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 13363, 21, "500", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 8729, 17, "500", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 13325, 60, "400", 38, "500", 22, "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 11093, 64, "400", 47, "500", 17, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9612, 9, "500", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 17977, 61, "400", 40, "500", 21, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /users [Create User]", 34199, 41, "500", 41, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 18035, 40, "500", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9581, 27, "400", 18, "500", 9, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
