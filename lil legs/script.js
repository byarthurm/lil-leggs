const firebaseConfig = {
    apiKey: "AIzaSyB-aO0GDzAnUSMDrKn_XWZJrHNY4oQMx-E",
    authDomain: "lil-legs-database.firebaseapp.com",
    projectId: "lil-legs-database",
    storageBucket: "lil-legs-database.appspot.com",
    messagingSenderId: "428864602132",
    appId: "1:428864602132:web:98a0dd3666c34e0d13e701",
    measurementId: "G-JNZPDEDY01",
    databaseURL: "https://lil-legs-database-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let listatemp = [];
let listaflow = [];
let historicoVisivel = false; // Variável para controlar a visibilidade do histórico

const temperatureRef = database.ref('sensor-data/temperature');
const flowRef = database.ref('sensor-data/flow');
const historicoContainer = document.getElementById('historico');
const historicoTemperaturas = document.getElementById('historico-temperaturas');
const historicoFluxos = document.getElementById('historico-fluxos');
const btnHistorico = document.getElementById('btnHistorico');

btnHistorico.addEventListener('click', function() {
    // Alternar visibilidade do histórico ao clicar no botão
    if (!historicoVisivel) {
        historicoVisivel = true;
        historicoContainer.style.display = 'block'; // Exibir div do histórico
        carregarHistorico(); // Carregar histórico ao exibir
    } else {
        historicoVisivel = false;
        historicoContainer.style.display = 'none'; // Esconder div do histórico
    }
});

function carregarHistorico() {
    // Limpar históricos ao exibir
    historicoTemperaturas.innerHTML = '';
    historicoFluxos.innerHTML = '';

    // Recuperar histórico de temperaturas do Firebase
    database.ref('historico-dados/temperaturas').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const tempValue = childSnapshot.val();
            listatemp.push(tempValue);
            const listItem = document.createElement('li');
            listItem.textContent = tempValue.toFixed(2) + " °C";
            historicoTemperaturas.appendChild(listItem);
        });
    });

    // Recuperar histórico de fluxos do Firebase
    database.ref('historico-dados/fluxos').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const flowValue = childSnapshot.val();
            listaflow.push(flowValue);
            const listItem = document.createElement('li');
            listItem.textContent = flowValue.toFixed(2) + " m³/h";
            historicoFluxos.appendChild(listItem);
        });
    });
}

temperatureRef.on('value', function(snapshot) {
    const temperatureValue = snapshot.val();
    if (temperatureValue !== null && !listatemp.includes(temperatureValue)) {
        document.getElementById('temperature').textContent = temperatureValue.toFixed(2) + " °C";
        updateFirebase(database.ref('historico-dados/temperaturas'), temperatureValue); // Enviar para coleção 'temperaturas' dentro de 'historico-dados'
    }
});

flowRef.on('value', function(snapshot) {
    const flowValue = snapshot.val();
    if (flowValue !== null && !listaflow.includes(flowValue)) {
        document.getElementById('flow').textContent = flowValue.toFixed(2) + " m³/h";
        updateFirebase(database.ref('historico-dados/fluxos'), flowValue); // Enviar para coleção 'fluxos' dentro de 'historico-dados'
    }
});

function updateFirebase(ref, data) {
    ref.push(data)  // Usar push() para adicionar dados sem substituir os existentes
        .then(() => {
            console.log('Dados enviados para o Firebase com sucesso');
        })
        .catch((error) => {
            console.error('Erro ao enviar dados para o Firebase:', error);
        });
}
// ---------------------------------------------------------------------------
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
        height: 200,
        type: 'line',
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 1000
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
        text: 'Grafico de variação da temperatura',
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