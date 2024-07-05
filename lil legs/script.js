//---------------------------- SISTEMA DE EXIBIÇÃO E ATUALIZAÇÃO ----------------------------------//
//conexão links com o firebase
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
// inicialização do firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
let listatemp = [];
let listaflow = [];
let historicoVisivel = false; // Variável para controlar a visibilidade do histórico
const temperatureRef = database.ref('sensor-data/temperature');
const flowRef = database.ref('sensor-data/flow');

//pega o valor da temperatura
temperatureRef.on('value', function(snapshot) {
    const temperatureValue = snapshot.val();
    if (temperatureValue !== null && !listatemp.includes(temperatureValue)) {
        document.getElementById('temperature').textContent = temperatureValue.toFixed(2) + " °C";
        updateFirebase(database.ref('historico-dados/temperaturas'), temperatureValue); // Enviar para coleção 'temperaturas' dentro de 'historico-dados'
    }
});
//pega o valor de fluxo
flowRef.on('value', function(snapshot) {
    const flowValue = snapshot.val();
    if (flowValue !== null && !listaflow.includes(flowValue)) {
        document.getElementById('flow').textContent = flowValue.toFixed(2) + " M³/H";
        updateFirebase(database.ref('historico-dados/fluxos'), flowValue); // Enviar para coleção 'fluxos' dentro de 'historico-dados'
    }
});
//atualiza o bando de dados
function updateFirebase(ref, data) {
    ref.push(data)  // Usar push() para adicionar dados sem substituir os existentes
        .then(() => {
            console.log('Dados enviados para o Firebase com sucesso');
        })
        .catch((error) => {
            console.error('Erro ao enviar dados para o Firebase:', error);
        });
}
//---------------------------------------------------------------------------------------------------//
const sensorDataRef = database.ref('sensor-data');
// Elementos HTML
const temperatureElement = document.getElementById('temperature');
const flowElement = document.getElementById('flow');
const mensagem1 = document.querySelector('.mensagem1');
const mensagem2 = document.querySelector('.mensagem2');
const mensagem3 = document.querySelector('.mensagem3');
// Função para atualizar dados do sensor
sensorDataRef.on('value', function(snapshot) {
    const data = snapshot.val();
    const temperature = data.temperature; // Supondo que a temperatura está em centésimos de grau
    const flow = data.flow;
    // Atualizar os elementos com os dados do sensor
    temperatureElement.textContent = `${temperature.toFixed(2)} °C`; // Exibe o valor da temperatura com precisão total
    flowElement.textContent = `${flow.toFixed(2)} M³/H`;
    
    // Lógica para exibir mensagens
    let exibeMensagem1 = false;
    let exibeMensagem2 = false;
    if (temperature > 50) {
        exibeMensagem1 = true;
    }
    if (flow > 7) {
        exibeMensagem2 = true;
    }
    // Atualizar exibição das mensagens
    mensagem1.style.display = exibeMensagem1 ? 'block' : 'none';
    mensagem2.style.display = exibeMensagem2 ? 'block' : 'none';

    if (!exibeMensagem1 && !exibeMensagem2) {
        mensagem3.style.display = 'block';
    } else {
        mensagem3.style.display = 'none';
    }
});
//---------------------------------------------------------------------------------------------------//
// Inicialização dos gráficos
const ctx1 = document.getElementById('myChart1').getContext('2d');
const myChart1 = new Chart(ctx1, {
    type: 'line',
    data: {
        labels: [], // Labels iniciais vazios
        datasets: [{
            label: 'Temperatura',
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(255,165,0,1.0)", // Laranja
            borderColor: "rgba(255,140,0,1.0)", // Laranja forte
            data: []
        }]
    },
    options: {
        legend: { display: false },
        scales: {
            yAxes: [{ ticks: { min: 0, max: 50 } }],
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'minute',
                    tooltipFormat: 'HH:mm',
                    displayFormats: {
                        minute: 'HH:mm'
                    }
                }
            }]
        }
    }
});

const ctx2 = document.getElementById('myChart2').getContext('2d');
const myChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: [], // Labels iniciais vazios
        datasets: [{
            label: 'Fluxo',
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(0,0,255,1.0)", // Azul forte
            borderColor: "rgba(0,0,139,1.0)", // Azul mais escuro
            data: []
        }]
    },
    options: {
        legend: { display: false },
        scales: {
            yAxes: [{ ticks: { min: 0, max: 50 } }],
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'minute',
                    tooltipFormat: 'HH:mm',
                    displayFormats: {
                        minute: 'HH:mm'
                    }
                }
            }]
        }
    }
});

// Função para obter o horário atual em Brasília
function getBrasiliaTime() {
    const now = new Date();
    const brasiliaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    const hours = brasiliaTime.getHours().toString().padStart(2, '0');
    const minutes = brasiliaTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Função para atualizar o gráfico
function updateChart(chart, value) {
    if (chart.data.labels.length >= 10) { // Limita o histórico a 10 valores
        chart.data.labels.shift(); // Remove o label mais antigo
        chart.data.datasets[0].data.shift(); // Remove o dado mais antigo
    }
    chart.data.labels.push(getBrasiliaTime()); // Adiciona um novo label com horário de Brasília
    chart.data.datasets[0].data.push(value); // Adiciona o novo valor ao dataset
    chart.update(); // Atualiza o gráfico
}

// Função para obter dados do Firebase e atualizar os gráficos
function fetchDataAndUpdateCharts() {
    temperatureRef.once('value', function(snapshot) {
        const temperatureValue = snapshot.val();
        if (temperatureValue !== null && !listatemp.includes(temperatureValue)) {
            updateChart(myChart1, temperatureValue); // Atualiza o gráfico de temperatura
        }
    });

    flowRef.once('value', function(snapshot) {
        const flowValue = snapshot.val();
        if (flowValue !== null && !listaflow.includes(flowValue)) {
            updateChart(myChart2, flowValue); // Atualiza o gráfico de fluxo
        }
    });
}

// Atualiza os dados a cada segundo
setInterval(fetchDataAndUpdateCharts, 1000);
//////////////////////////////////////////////////////////////////////////////////
// Elementos dos LEDs
const ledBlue = document.querySelector('.led-blue');
const ledYellow = document.querySelector('.led-yellow');
const ledWhite = document.querySelector('.led-white');

// Função para atualizar os LEDs
function updateLeds(temperature, flow) {
    let isBlueVisible = false;
    let isYellowVisible = false;
    let isWhiteVisible = false;

    if (temperature <= 50 && flow <= 7 && flow != 0) {
        isBlueVisible = true;
    } else {
        if (temperature > 50) {
            isYellowVisible = true;
        }
        if (flow > 7 || flow == 0) {
            isWhiteVisible = true;
        }
    }

    // Atualizar visibilidade dos LEDs
    ledBlue.style.display = isBlueVisible ? 'block' : 'none';
    ledYellow.style.display = isYellowVisible ? 'block' : 'none';
    ledWhite.style.display = isWhiteVisible ? 'block' : 'none';
}

// Função para obter dados do sensor e atualizar os LEDs
sensorDataRef.on('value', function(snapshot) {
    const data = snapshot.val();
    const temperature = data.temperature; // Convertendo centésimos de grau para graus
    const flow = data.flow;

    // Atualizar os elementos com os dados do sensor
    temperatureElement.textContent = `${temperature.toFixed(2)} °C`;
    flowElement.textContent = `${flow.toFixed(2)} M³/H`;

    // Lógica para exibir mensagens
    let exibeMensagem1 = false;
    let exibeMensagem2 = false;
    if (temperature > 50) {
        exibeMensagem1 = true;
    }
    if (flow > 7 || flow === 0) {
        exibeMensagem2 = true;
    }
    // Atualizar exibição das mensagens
    mensagem1.style.display = exibeMensagem1 ? 'block' : 'none';
    mensagem2.style.display = exibeMensagem2 ? 'block' : 'none';
    mensagem3.style.display = (!exibeMensagem1 && !exibeMensagem2) ? 'block' : 'none';

    // Atualizar LEDs
    updateLeds(temperature, flow);
});

// Termômetro
var tempMax = 50;
let thermometerLevel = document.getElementById('thermometerLevel');
let temperatureDisplay = document.getElementById('temperatureDisplay');
let temperatureCircle = document.getElementById('temperatureCircle');

function updateThermometer(temp) {
    let height = temp * 109.35 / tempMax;
    if (height > 109.35) {
        height = 109.35;
    } else if (height < 13) {
        height = 13;
    }
    thermometerLevel.style.height = height + 'px';
    temperatureDisplay.textContent = temp + '°C';

    if (temp > 50) {
        thermometerLevel.classList.remove('bg-blue');
        thermometerLevel.classList.add('bg-red');
        temperatureCircle.classList.remove('bg-blue');
        temperatureCircle.classList.add('bg-red');
    } else {
        thermometerLevel.classList.remove('bg-red');
        thermometerLevel.classList.add('bg-blue');
        temperatureCircle.classList.remove('bg-red');
        temperatureCircle.classList.add('bg-blue');
    }
}

// Observa mudanças na temperatura no Firebase
temperatureRef.on('value', function(snapshot) {
    const temperatureValue = snapshot.val();
    if (temperatureValue !== null) {
        updateThermometer(temperatureValue);
        updateFirebase(database.ref('historico-dados/temperaturas'), temperatureValue);
    }
});

// Atualização do valor de fluxo no Firebase
flowRef.on('value', function(snapshot) {
    const flowValue = snapshot.val();
    if (flowValue !== null) {
        document.getElementsByClassName('flow-text')[0].textContent = flowValue.toFixed(2) + " m³/h";
        updateFirebase(database.ref('historico-dados/fluxos'), flowValue); // Enviar para coleção 'fluxos' dentro de 'historico-dados'
    }
});
