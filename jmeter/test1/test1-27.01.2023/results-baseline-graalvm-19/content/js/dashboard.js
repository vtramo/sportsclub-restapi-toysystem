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

    var data = {"OkPercent": 99.7230810082886, "KoPercent": 0.2769189917113973};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5679731805853233, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6791621718806184, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.4724935041662933, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.6954844092188966, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6945082480684903, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.3825056385378101, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.3783518639633748, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.4598786244099798, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.47875, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.661203007518797, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.6812207418077062, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.4821465642516089, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6430263302853365, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.6672998801765204, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.46494505494505495, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.6927240553762881, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 210892, 584, 0.2769189917113973, 2582.049115186883, 38, 131343, 11436.5, 21773.800000000003, 27741.40000000001, 35881.990000000005, 139.48953755711415, 113.50176465464612, 38.41904966543399], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 11124, 50, 0.4494786048184106, 1756.844750089897, 38, 32846, 170.0, 5516.0, 9871.75, 18735.25, 7.392025198273599, 2.793204379005758, 2.5460593381715304], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 11161, 17, 0.15231610070782187, 2807.2310724845447, 46, 35018, 1048.0, 7718.800000000001, 12542.599999999999, 22696.259999999857, 7.402867624575584, 13.308113226987999, 0.9831933563889447], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9589, 50, 0.5214308061320263, 1665.3259985399943, 38, 32787, 141.0, 5190.0, 9681.5, 18207.500000000007, 6.378977381206598, 1.3415663111961729, 1.413536862393304], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9578, 69, 0.7204009187721863, 1682.6564000835272, 38, 32539, 140.0, 5181.900000000003, 9764.349999999995, 18644.889999999992, 6.360949692844097, 1.4436885169350822, 1.5400243078615308], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 23499, 59, 0.25107451380909823, 3862.78433124813, 82, 35879, 2469.5, 12301.0, 14722.750000000004, 25315.900000000016, 15.582529583199328, 27.991713321267408, 2.069554710268661], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 9174, 30, 0.3270111183780249, 6690.864944408094, 47, 131343, 1971.0, 20160.0, 27643.0, 47122.0, 6.069262631561886, 1.9544533127727746, 2.0863574845886776], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 13347, 15, 0.11238480557428636, 2956.03356559527, 47, 35447, 1115.0, 8350.80000000001, 12883.599999999999, 21643.68000000008, 8.852140013304407, 15.919160298339403, 1.1756748455169916], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 9200, 15, 0.16304347826086957, 3226.363478260866, 78, 34533, 1027.0, 10133.299999999997, 13679.649999999992, 23420.55999999999, 6.1011558374466395, 3.679853520242574, 0.8341423996509078], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 13300, 51, 0.38345864661654133, 1888.371278195489, 38, 32789, 196.0, 5819.9, 10121.949999999999, 19089.899999999998, 8.832350042634351, 3.3380066429814694, 3.042102942077382], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 11108, 61, 0.549153763053655, 1710.7635037810587, 38, 32460, 167.5, 5420.200000000001, 9729.649999999998, 17727.009999999984, 7.381878644254322, 1.5528414955797114, 1.6357823917888228], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9634, 6, 0.062279427029271334, 2651.1006850736976, 48, 34896, 980.5, 7495.5, 12246.25, 19326.049999999967, 6.389996743317001, 11.495998230546624, 0.8486714424717892], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 18154, 49, 0.2699129668392641, 1978.688718739668, 39, 32685, 239.0, 6490.5, 10402.75, 18799.650000000012, 12.054664990673803, 7.232433522629556, 2.801855381661889], "isController": false}, {"data": ["POST /users [Create User]", 34217, 49, 0.1432036706900079, 1868.855072040216, 74, 33107, 1212.0, 9600.900000000001, 11544.95, 21548.7400000002, 22.717706093951463, 12.101350260127926, 13.732675851714799], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 18200, 27, 0.14835164835164835, 3012.3295604395607, 77, 35882, 1058.0, 8747.9, 13110.0, 22397.950000000008, 12.0692376353313, 7.281705590925127, 1.6500910829554514], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9607, 36, 0.374726761736234, 1658.3681690434075, 38, 32508, 150.0, 5275.600000000002, 9550.6, 16935.240000000005, 6.378895927121098, 2.41085454866506, 2.1971022226455124], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 262, 44.863013698630134, 0.12423420518559262], "isController": false}, {"data": ["500", 322, 55.136986301369866, 0.15268478652580467], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 210892, 584, "500", 322, "400", 262, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST /reservations [Accept Reservation]", 11124, 50, "400", 33, "500", 17, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 11161, 17, "500", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9589, 50, "400", 36, "500", 14, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9578, 69, "400", 49, "500", 20, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 23499, 59, "500", 59, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 9174, 30, "400", 15, "500", 15, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 13347, 15, "500", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 9200, 15, "500", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 13300, 51, "400", 31, "500", 20, "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 11108, 61, "400", 50, "500", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9634, 6, "500", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 18154, 49, "400", 27, "500", 22, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /users [Create User]", 34217, 49, "500", 49, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 18200, 27, "500", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9607, 36, "400", 21, "500", 15, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
