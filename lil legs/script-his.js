// Configuração do Firebase
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

// Inicialização do Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referências aos dados no Firebase
const temperaturasRef = database.ref('historico-dados/temperaturas');
const fluxosRef = database.ref('historico-dados/fluxos');

// Função para exibir histórico de temperaturas
temperaturasRef.on('value', function(snapshot) {
    const historicoTemperaturas = document.getElementById('historico-temperaturas');
    historicoTemperaturas.innerHTML = ''; // Limpa a lista antes de atualizar

    snapshot.forEach(function(childSnapshot) {
        const temperatura = childSnapshot.val();
        const li = document.createElement('li');
        li.textContent = temperatura.toFixed(2) + " °C";
        historicoTemperaturas.appendChild(li);
    });
});

// Função para exibir histórico de fluxos
fluxosRef.on('value', function(snapshot) {
    const historicoFluxos = document.getElementById('historico-fluxos');
    historicoFluxos.innerHTML = ''; // Limpa a lista antes de atualizar

    snapshot.forEach(function(childSnapshot) {
        const fluxo = childSnapshot.val();
        const li = document.createElement('li');
        li.textContent = fluxo.toFixed(2) + " M³/H";
        historicoFluxos.appendChild(li);
    });
});
