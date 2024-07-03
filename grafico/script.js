// Defina os seus dados aqui
var data = []; 
var lastDate = new Date().getTime(); // Defina a última data aqui
var XAXISRANGE = 777600000; // Defina o intervalo do eixo X

var options = {
    series: [{
        data: data.slice()
    }],
    chart: {
        id: 'realtime',
        height: 350,
        type: 'line',
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 300
            }
        },
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: 'Dynamic Updating Chart',
        align: 'left'
    },
    markers: {
        size: 0
    },
    xaxis: {
        type: 'datetime',
        range: XAXISRANGE,
    },
    yaxis: {
        max: 100
    },
    legend: {
        show: false
    },
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

function getNewSeries(baseval, yrange) {
    var newDate = baseval + 86400000;
    lastDate = newDate;

    var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    data.push([newDate, y]);
}

window.setInterval(function () {
    getNewSeries(lastDate, {
        min: 10,
        max: 90
    });

    chart.updateSeries([{
        data: data
    }]);
}, 1000);
