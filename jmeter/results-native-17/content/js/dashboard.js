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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8725737577639752, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9302325581395349, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.6894977168949772, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.9502762430939227, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.93646408839779, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.7053763440860215, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.8812877263581489, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.6828358208955224, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.918, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.9564393939393939, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.9441860465116279, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.6810810810810811, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.9280510018214936, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.9397058823529412, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.9065335753176044, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.9093406593406593, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5152, 0, 0.0, 358.77484472049656, 9, 6495, 226.0, 821.6999999999998, 1183.699999999999, 1804.2900000000018, 78.20635426628414, 637.6823562994293, 20.623306503028374], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 215, 0, 0.0, 258.8418604651162, 9, 1525, 190.0, 583.0000000000001, 753.8, 1048.8000000000004, 3.6941580756013743, 1.3706440614261168, 1.2610408612542954], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 219, 0, 0.0, 692.9954337899546, 21, 5362, 575.0, 1469.0, 1615.0, 2145.6000000000017, 3.443721105764695, 125.07659675047961, 0.45736920935937353], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 181, 0, 0.0, 215.36464088397784, 12, 1150, 127.0, 502.80000000000007, 706.9, 1035.200000000001, 3.088631787311013, 0.6441426380498959, 0.6803375418074469], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 181, 0, 0.0, 226.45856353591168, 9, 949, 146.0, 559.4000000000003, 687.0, 898.9800000000005, 3.0809559474365082, 0.6936905032937292, 0.7418304399724246], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 465, 0, 0.0, 694.1569892473115, 16, 6495, 484.0, 1501.4000000000005, 1735.0, 4699.6999999999625, 7.05860922628535, 237.83558041881082, 0.9374715378660231], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 497, 0, 0.0, 324.784708249497, 22, 1548, 254.0, 696.0, 818.1999999999999, 1205.3599999999997, 8.375745727864102, 2.670644496359837, 2.8628037155785497], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 268, 0, 0.0, 693.3992537313436, 19, 4312, 581.5, 1513.1999999999998, 1699.0499999999997, 2712.370000000003, 4.222134698700275, 154.18858002658527, 0.5607522646711304], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 500, 0, 0.0, 282.65000000000015, 13, 5619, 206.0, 583.9000000000001, 711.95, 1205.92, 7.6996519757306965, 4.5541636830515255, 1.0526867935569313], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 264, 0, 0.0, 231.06818181818193, 12, 1037, 172.5, 468.5, 642.75, 889.4000000000005, 4.47116605978491, 1.6592217799983062, 1.5262624110847658], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 215, 0, 0.0, 217.6232558139536, 10, 1119, 136.0, 528.4000000000001, 658.7999999999995, 1039.88, 3.6686915568903147, 0.7650994919288786, 0.8080919711111869], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 185, 0, 0.0, 718.2594594594593, 17, 4368, 547.0, 1564.4000000000003, 1853.7999999999995, 4177.939999999997, 2.9138446999527488, 106.54845989525909, 0.3869949992124744], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 549, 0, 0.0, 264.2786885245903, 9, 1342, 217.0, 548.0, 698.0, 1026.0, 9.177532597793379, 5.422240027373788, 2.115134465897693], "isController": false}, {"data": ["POST /users [Create User]", 680, 0, 0.0, 222.65147058823513, 16, 5501, 138.5, 535.9, 653.8499999999998, 875.3699999999986, 10.449802529466908, 5.557160323790206, 6.316823989980484], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 551, 0, 0.0, 286.04174228675146, 13, 5598, 185.0, 664.0, 808.5999999999997, 1184.92, 8.469886555784425, 5.009690266932087, 1.1579923025486518], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 182, 0, 0.0, 301.6153846153846, 12, 4783, 224.5, 608.4000000000001, 711.55, 1800.809999999955, 2.8718401868274057, 1.065660306277022, 0.9803532402878151], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5152, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
