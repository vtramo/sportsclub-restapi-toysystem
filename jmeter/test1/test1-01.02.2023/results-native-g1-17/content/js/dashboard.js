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

    var data = {"OkPercent": 99.8074045469904, "KoPercent": 0.19259545300960565};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5544045952599315, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6707660192412416, 500, 1500, "POST /reservations [Accept Reservation]"], "isController": false}, {"data": [0.4585972850678733, 500, 1500, "GET /sports-fields [Accept Reservation]"], "isController": false}, {"data": [0.687037428631846, 500, 1500, "PUT /reservations/reservationId/status [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6835999576226295, 500, 1500, "POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]"], "isController": false}, {"data": [0.36305705781243447, 500, 1500, "GET /sports-fields [Available Sports Fields]"], "isController": false}, {"data": [0.3685412160538332, 500, 1500, "POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]"], "isController": false}, {"data": [0.4416993070201868, 500, 1500, "GET /sports-fields [Request a Reservation]"], "isController": false}, {"data": [0.47500299007295776, 500, 1500, "GET /sports-facilities [Create Sports Field]"], "isController": false}, {"data": [0.6501208824418253, 500, 1500, "POST /reservations [Request a Reservation]"], "isController": false}, {"data": [0.6686067660967625, 500, 1500, "PUT /reservations/reservationId/status [Accept Reservation]"], "isController": false}, {"data": [0.6273975712177959, 500, 1500, "GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]"], "isController": false}, {"data": [0.4662382808385126, 500, 1500, "GET /sports-fields [Evaluate Sports Experience]"], "isController": false}, {"data": [0.6576595179798814, 500, 1500, "POST /users [Create User]"], "isController": false}, {"data": [0.4333050367855122, 500, 1500, "GET /sports-facilities [View User Rating]"], "isController": false}, {"data": [0.6853962224332595, 500, 1500, "POST /reservations [Evaluate Sports Experience]"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 207170, 399, 0.19259545300960565, 2625.461567794559, 39, 203596, 10545.5, 19691.9, 25434.800000000003, 44715.73000000004, 137.18822738665597, 113.11483508188945, 37.776818864995384], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /reservations [Accept Reservation]", 11018, 28, 0.25412960609911056, 1788.5401161735338, 39, 32604, 148.0, 6120.700000000003, 9724.199999999997, 17427.339999999993, 7.329106691119195, 2.8085890754536127, 2.5235684184798193], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 11050, 10, 0.09049773755656108, 2795.7289592760203, 47, 32979, 1100.0, 8253.9, 11747.899999999998, 19914.64999999998, 7.335763540126627, 13.126009834445759, 0.9742810951730676], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9458, 35, 0.370057094523155, 1662.3611757242556, 39, 33035, 127.0, 5562.300000000001, 9484.05, 16099.379999999968, 6.291144704975379, 1.4040781274631946, 1.3939018595893395], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9439, 43, 0.4555567327047357, 1697.0805170039173, 41, 32505, 126.0, 5631.0, 9490.0, 16802.0, 6.283116329845302, 1.4903616034876987, 1.521000579119738], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 23853, 26, 0.10900096423929904, 3804.6493942061848, 85, 33648, 2628.0, 11587.700000000004, 13627.95, 22298.910000000014, 15.830068170234455, 28.36254442625211, 2.1024309288592633], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 8322, 23, 0.27637587118481133, 7842.252102859894, 47, 203596, 2111.5, 21958.199999999997, 33069.249999999985, 66372.91000000003, 5.5117839052201, 1.8391260025376592, 1.883969372534533], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 13276, 13, 0.09792106056040976, 2955.8401626996074, 48, 32970, 1205.0, 8988.300000000001, 12015.15, 19564.679999999993, 8.812836098906097, 15.776341876230966, 1.1704547943859658], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 8361, 13, 0.15548379380456884, 3072.9140055017315, 79, 33090, 1057.0, 9530.2, 12544.399999999998, 22100.859999999964, 5.547773823876594, 3.392062247319505, 0.7584847024831282], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 13236, 43, 0.3248715624055606, 1891.8586430945868, 40, 32692, 180.0, 6535.000000000022, 9764.0, 16705.519999999997, 8.797993132300919, 3.3730040095228504, 3.029344736126676], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 10996, 36, 0.327391778828665, 1771.7738268461264, 40, 31893, 147.0, 6071.900000000003, 9566.15, 15410.0, 7.30954209002649, 1.5943980490133514, 1.6195285468745326], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 17622, 36, 0.20429009193054137, 2098.268527976389, 42, 32635, 219.0, 7567.800000000003, 10044.849999999999, 18339.54, 11.71342197832, 7.116018902823863, 2.6996595113724284], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9493, 7, 0.07373854419045613, 2667.7025176445836, 49, 32703, 1053.0, 7775.800000000003, 11604.899999999998, 18841.099999999984, 6.304449175898981, 11.269609413290414, 0.8373096561740834], "isController": false}, {"data": ["POST /users [Create User]", 33899, 44, 0.12979733915454733, 1886.0935130829791, 77, 33015, 1315.0, 9494.600000000006, 11018.800000000003, 20377.920000000013, 22.526467719084668, 12.351770099318736, 13.617073748157626], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 17670, 18, 0.10186757215619695, 3034.682625919636, 79, 32840, 1220.5, 9316.9, 11991.600000000006, 19775.49000000007, 11.725873368530861, 7.100614189899424, 1.6031467496038287], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9477, 24, 0.25324469768914215, 1714.0346101086811, 40, 32281, 132.0, 5700.000000000007, 9608.1, 17537.819999999978, 6.302135424424914, 2.423704067502407, 2.169985989643737], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 186, 46.61654135338346, 0.08978133899695902], "isController": false}, {"data": ["500", 213, 53.38345864661654, 0.10281411401264662], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 207170, 399, "500", 213, "400", 186, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST /reservations [Accept Reservation]", 11018, 28, "400", 20, "500", 8, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Accept Reservation]", 11050, 10, "500", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Evaluate Sports Experience]", 9458, 35, "400", 24, "500", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations/updatedReservationId/rating [Evaluate Sports Experience]", 9439, 43, "400", 34, "500", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Available Sports Fields]", 23853, 26, "500", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /sports-facilities/sportsFacilityId/sports-fields [Create Sports Field]", 8322, 23, "400", 13, "500", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Request a Reservation]", 13276, 13, "500", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [Create Sports Field]", 8361, 13, "500", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Request a Reservation]", 13236, 43, "400", 33, "500", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /reservations/reservationId/status [Accept Reservation]", 10996, 36, "400", 28, "500", 8, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities/sportsFacilityId/reservations-summaries [View User Rating]", 17622, 36, "400", 18, "500", 18, "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-fields [Evaluate Sports Experience]", 9493, 7, "500", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /users [Create User]", 33899, 44, "500", 44, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /sports-facilities [View User Rating]", 17670, 18, "500", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /reservations [Evaluate Sports Experience]", 9477, 24, "400", 16, "500", 8, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
