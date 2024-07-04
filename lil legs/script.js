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