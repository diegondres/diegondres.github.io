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

function monedaAFloat(input) {
    // Remueve símbolo de moneda y separadores de miles.
    let numSinFormato = input.replace(/[$.]/g, '').replace(/,/g, '.');

    // Convierte a float.
    let num = parseFloat(numSinFormato);

    if (!isNaN(num)) {
        return num;
    } else {
        throw new Error("El input no es un número válido.");
    }
}

function formatoMoneda(input) {
    let num = parseFloat(input.replace(/\D/g, ''));

    if (!isNaN(num)) {
        return input = num.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    }
}

export function agregarFila() {
    let moneda = monedaAFloat(document.getElementById('numeroInput').value)
    var numero = parseFloat(moneda).toFixed(2);
    var descripcion = document.getElementById('descripcionInput').value;
    var dropdown = document.getElementById("typeDropdown");
    var selectedType = dropdown.options[dropdown.selectedIndex].value;


    // Guardar registro en Firebase
    registrosRef.push({
        numero: numero,
        descripcion: descripcion,
        type: selectedType
    });

    document.getElementById('numeroInput').value = '';
    document.getElementById('descripcionInput').value = '';
    
    var tablaRegistrosA = document.getElementById('tablaCC');
    var tablaRegistrosB = document.getElementById('tablaTC');
    actualizarSumaTabla(tablaRegistrosA);
    actualizarSumaTabla(tablaRegistrosB);
}

function inicializarBotonBorrar() {
    document.querySelectorAll('.btn-borrar').forEach(button => {
        button.addEventListener('click', function () {
            borrarFila(this);
        });
    });
}

function borrarFila(btn) {
    var fila = btn.closest('tr');

    // Borrar registro en Firebase
    var key = fila.getAttribute('data-key');
    fila.remove();
    registrosRef.child(key).remove();
}

function actualizarSumaTabla(tabla) {
    let total = 0;

    tabla.querySelectorAll('tr').forEach((fila, index) => {
        if (index !== 0) { // Excluir la última fila que es la suma
            total += parseFloat(fila.cells[1].innerHTML.replace(/[$.]/g, '').replace(/,/g, '.'))
        }
    });

    let totalRow = tabla.insertRow();
    let cell1 = totalRow.insertCell(0);
    let cell2 = totalRow.insertCell(1);
    cell1.innerHTML = "Total";
    cell2.innerHTML = total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) // Mostrar el total con 2 decimales
}

registrosRef.on('child_added', function (dataSnapshot) {
    var registro = dataSnapshot.val();
    var key = dataSnapshot.key;

    var tablaRegistrosA = document.getElementById('tablaCC');
    var tablaRegistrosB = document.getElementById('tablaTC');

    var newRow, cell1, cell2, cell3;

    if (registro.type === 'cc') {
        newRow = tablaRegistrosA.insertRow();
        cell1 = newRow.insertCell(0);
        cell2 = newRow.insertCell(1);
        cell3 = newRow.insertCell(2);

        newRow.setAttribute('data-key', key);
        cell1.innerHTML = registro.descripcion;
        cell2.innerHTML = formatoMoneda(registro.numero);
        cell3.innerHTML = '<button class="btn-borrar">Borrar</button>';
    } else {
        newRow = tablaRegistrosB.insertRow();
        cell1 = newRow.insertCell(0);
        cell2 = newRow.insertCell(1);
        cell3 = newRow.insertCell(2);

        newRow.setAttribute('data-key', key);
        cell1.innerHTML = registro.descripcion;
        cell2.innerHTML = formatoMoneda(registro.numero);
        cell3.innerHTML = '<button class="btn-borrar">Borrar</button>';
    }

    inicializarBotonBorrar();
});