/* variables */

let tbl1 = document.getElementById("table1");
let tbl2 = document.getElementById("table2");
let firstHeading = document.getElementById("firstHeading");
let dataPoints = [];

function randomRGB() {
    return Math.floor(Math.random() * 256);
}

function getXMLHTTP(){
    let xhr = null;
    xhr = new XMLHttpRequest;
    if (!xhr) {
      alert("Your browser not support XMLHTTPRequest objects.");
    }
    return xhr;
}

function onload() {
    insertNoScriptCode();
    insertCanvasTagHtml();
    drawChartCrimesRecordedByPoliceServices();
    drawChartAveragePrisonPopulation();
    drawLiveDataPointsChart();
}

//Add noscript tag
function insertNoScriptCode() {
    const noscript = `
            <noscript>
                You don't have javascript enabled.  Good luck with that.
            </noscript>
        `;
    tbl1.insertAdjacentHTML( 'beforebegin', noscript );
}

//Insert canvas tag html for each chart 
function insertCanvasTagHtml() {
    //canvas for first chart : Crimes recorded by plice services
    const crimesChartCanvas = '<canvas id="crimes-chart" width="800" height="600" class="graph"></canvas>';
    tbl1.insertAdjacentHTML( 'beforebegin', crimesChartCanvas );

    //canvas for second chart : Average prison population per year
    const prisonPopulationChartCanvas = '<canvas id="prison-population-chart" width="800" height="600" class="graph"></canvas>';
    tbl2.insertAdjacentHTML( 'beforebegin', prisonPopulationChartCanvas );

    //canvas for h1: first heading
    const liveChartCanvas = '<canvas id="live-chart" width="800" height="400" class="graph"></canvas>';
    firstHeading.insertAdjacentHTML( 'afterend', liveChartCanvas );
}

//draw chart based on table1 data
function drawChartCrimesRecordedByPoliceServices() {
    const canvas = document.getElementById("crimes-chart");

    const data = {
        labels : [],
        datasets : []
    }

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true
            /*plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart'
            }*/
        }
    };

    const trElts = [...tbl1.querySelectorAll("tbody tr")];
    const labels = [...trElts[0].querySelectorAll("th")];
    const trEltsData = trElts.slice(1,trElts.length);

    data.labels = labels.map(v => v.innerText).filter(v => v !== "");

    trEltsData.forEach(
        trElt => {
            const tdElts = [...trElt.querySelectorAll("td")];
            const datas = tdElts.map(v => v.innerText === ":" ? 0 : v.innerText);

            data.datasets.push({
                label: datas[0],
                data : datas.slice(1,datas.length).map(v => parseFloat(v)),
                fill: false,
                borderColor: `rgb(${randomRGB()},${randomRGB()},${randomRGB()})`,
                tension : 0
            })
        }
    )

    //console.log(data.datasets);
    const ctx = canvas.getContext("2d");
    const crimesChart = new Chart(ctx,config);
}

//draw chart based on table2 data
function drawChartAveragePrisonPopulation() {
    //let tbl2 = document.getElementById("table2");
    const canvas = document.getElementById("prison-population-chart");

    const data = {
        labels : [],
        datasets : []
    }

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true
            /*plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart'
            }
            }*/
        }
    };

    const theadTrElts = [...tbl2.querySelectorAll("thead tr")];
    const trEltsData = [...tbl2.querySelectorAll("tbody tr")];
    const labels = [...theadTrElts[0].querySelectorAll("th")];

    data.labels = labels.map(v => v.innerText).filter(v => v !== "N°" && v !== "Country");

    trEltsData.forEach(
        trElt => {
            const tdElts = [...trElt.querySelectorAll("td")];
            const datas = tdElts.map(v => v.innerText);

            data.datasets.push({
                label: datas[0],
                data : datas.slice(1,datas.length).map(v => parseInt(v)),
                fill: false,
                borderColor: `rgb(${randomRGB()},${randomRGB()},${randomRGB()})`
            })
        }
    )

    const ctx = canvas.getContext("2d");
    const prisonPopulationChart = new Chart(ctx,config);
}

//get data using ajax XMLHttpRequest
function getDatapoints(xStart,yStart,length) {
    let _xmlHttp = null; //object used to call a server
    let _url = `https://canvasjs.com/services/data/datapoints.php?xstart=${xStart}&ystart=${yStart}&length=${length}&type=json`; // url to query
  
    _xmlHttp = getXMLHTTP(); //instansiate XMLHttpRequest
    //_xmlHttp = new XMLHttpRequest;
  
    if(_xmlHttp) {
      _xmlHttp.open("GET", _url, true); //query url
      _xmlHttp.onload = function() {
        if(_xmlHttp.readyState === 4 && _xmlHttp.status === 200) {  // the request succeed
          let data = JSON.parse(this.responseText);
          dataPoints = data;
        } else {
          alert ("Something went wrong. Server not respond."); //the request failed
        }
      };
      // send a query : _xmlHttp.open("GET", _url, true);
      _xmlHttp.send();
    }
}


//draw chart based on data getted from php page
function drawLiveDataPointsChart() {
    const canvas = document.getElementById("live-chart");

    let data = {
        labels : [],
        datasets : [ { label: "Live Chart", data: [], fill: false, borderColor: `rgb(${randomRGB()},${randomRGB()},${randomRGB()})` } ]
    }

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true
        }
    };

    const ctx = canvas.getContext("2d");
    let chart = new Chart(ctx,config);

    let xStart = 1
    let yStart = 10
    let length = 10

    function updateLiveDataPointsChart() {
        getDatapoints(xStart,yStart,length);
        dataPoints.forEach( value => {
            chart.data.labels.push(value[0])
            chart.data.datasets[0].data.push(value[1])

            xStart = chart.data.labels.length + 1
            yStart = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1]
            length = 1
        })
        chart.update(); //update chart
        //call updateLiveDataPointsChart() every second
        setTimeout(() => updateLiveDataPointsChart(), 1000); 
    }

    //call updateLiveDataPointsChart() first time
    updateLiveDataPointsChart();
}


//when js loaded this function will be executed
onload();