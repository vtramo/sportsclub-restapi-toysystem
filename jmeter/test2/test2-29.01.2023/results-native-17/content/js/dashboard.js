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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9866583799461364, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.9879903923138511, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.9976167778836987, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9971401334604385, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9702470059880239, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.9268833087149188, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.9813384813384813, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.9867354458364038, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.9987096774193548, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.9987942122186495, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.9992158912702561, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.9886148007590133, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9970284237726098, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.9755590223608944, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.9995233555767398, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 24135, 0, 0.0, 153.29185829707822, 38, 1265, 112.0, 389.0, 461.0, 597.9900000000016, 386.89044916802925, 308.82589140797825, 106.3689965404684], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 1248, 0, 0.0, 93.65624999999997, 39, 479, 46.0, 241.3000000000004, 322.0, 394.53, 20.227232207977437, 7.538788994756803, 6.930129033695846], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 1249, 0, 0.0, 167.5716573258607, 45, 815, 102.0, 385.0, 452.5, 548.0, 20.206432407946675, 35.72003426215783, 2.6836668041804184], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 1049, 0, 0.0, 88.85700667302198, 39, 537, 48.0, 220.0, 288.5, 419.0, 17.164081418941027, 3.585762499795471, 3.786904078923686], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 1049, 0, 0.0, 85.34413727359399, 39, 520, 46.0, 216.0, 318.5, 481.5, 17.18094863731656, 3.874516837002097, 4.142969159460168], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 2672, 0, 0.0, 230.99513473053875, 85, 811, 181.0, 447.0, 514.0, 626.27, 42.957508721724736, 75.88639991217987, 5.705294127104065], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 1354, 0, 0.0, 262.3774002954209, 52, 1265, 183.0, 561.0, 706.75, 981.5000000000005, 21.845404236782237, 6.973706534058825, 7.466690901243929], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 1554, 0, 0.0, 156.81917631917628, 45, 672, 97.0, 383.5, 470.0, 590.3500000000001, 25.071795037268885, 44.31703395239747, 3.3298477783872737], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 1357, 0, 0.0, 193.65659543109783, 79, 834, 148.0, 401.0, 458.0999999999999, 536.8400000000001, 21.820930082974208, 12.914264885307455, 2.98333028478163], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 1550, 0, 0.0, 85.71999999999994, 38, 509, 46.0, 199.0, 306.0, 410.49, 25.119520298193013, 9.361879988453124, 8.606189480187991], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 1244, 0, 0.0, 89.79260450160777, 39, 534, 48.0, 223.5, 336.25, 438.59999999999945, 20.32812602130858, 4.246744706557618, 4.484964933369828], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 1913, 0, 0.0, 100.07893361212757, 40, 520, 50.0, 216.0, 313.0, 434.4399999999996, 31.208705156859228, 18.684132176126077, 7.1926312666199], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 1054, 0, 0.0, 174.80455407969657, 48, 781, 103.0, 417.0, 477.0, 617.2000000000007, 17.004662568768854, 30.04793148927932, 2.2584317474146136], "isController": false}, {"data": ["POST /users [Create User]", 3870, 0, 0.0, 145.5131782945739, 75, 569, 88.0, 308.0, 378.0, 478.7399999999998, 62.25267831290416, 33.12781630030885, 37.63125769110125], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 1923, 0, 0.0, 221.71086843473722, 79, 687, 169.0, 433.8000000000004, 498.79999999999995, 598.76, 30.82669402542441, 18.24727405980988, 4.214587073788493], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 1049, 0, 0.0, 97.29837940896091, 39, 509, 46.0, 276.0, 349.5, 440.0, 17.15313547543128, 6.393238747853814, 5.876764854672553], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 24135, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
