// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBCCF_SA61aMTBsOvMs2rhno-gkMQwfhjE",
    authDomain: "accounting-managment-3d0d0.firebaseapp.com",
    projectId: "accounting-managment-3d0d0",
    storageBucket: "accounting-managment-3d0d0.appspot.com",
    messagingSenderId: "407989227705",
    appId: "1:407989227705:web:062dafdcf9ac198df64b68",
    measurementId: "G-J3T5H8EZMY"
};

// Inicializar la app de Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var registrosRef = database.ref('registros');




export function agregarFila() {
    var numero = parseFloat(document.getElementById('numeroInput').value).toFixed(2);
    var descripcion = document.getElementById('descripcionInput').value;

    // Agregar registro a la tabla
    var tablaRegistros = document.getElementById('tablaRegistros');
    var newRow = tablaRegistros.insertRow();
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    cell1.innerHTML = numero;
    cell2.innerHTML = descripcion;
    cell3.innerHTML = '<button onclick="borrarFila(this)">Borrar</button>';

    // Guardar registro en Firebase
    registrosRef.push({
        numero: numero,
        descripcion: descripcion
    });

    document.getElementById('numeroInput').value = '';
    document.getElementById('descripcionInput').value = '';
}

export function borrarFila(btn) {
    var fila = btn.closest('tr');
    var index = fila.rowIndex;
    fila.remove();

    // Borrar registro en Firebase
    var key = fila.getAttribute('data-key');
    registrosRef.child(key).remove();
}

// Obtener y mostrar los registros de Firebase en la tabla
registrosRef.on('child_added', function(dataSnapshot) {
    var registro = dataSnapshot.val();
    var key = dataSnapshot.key;

    var tablaRegistros = document.getElementById('tablaRegistros');
    var newRow = tablaRegistros.insertRow();
    newRow.setAttribute('data-key', key);
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    cell1.innerHTML = registro.numero;
    cell2.innerHTML = registro.descripcion;
    cell3.innerHTML = '<button onclick="borrarFila(this)">Borrar</button>';
});