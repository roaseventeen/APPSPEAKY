// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA1ceTerLSwI02Fxfk4CcGQ7lJZR4zcbEA",
    authDomain: "speaky-22873.firebaseapp.com",
    projectId: "speaky-22873",
    storageBucket: "speaky-22873.appspot.com",
    messagingSenderId: "986263322125",
    appId: "1:986263322125:web:5bf94cfdf2a930ca299f44"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function goBack() {
    window.location.href = 'home.html';
}

function toggleMenu() {
    var menu = document.getElementById('menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

function openAddCollectionModal() {
    document.getElementById('add-collection-modal').style.display = 'flex';
}

function closeAddCollectionModal() {
    document.getElementById('add-collection-modal').style.display = 'none';
}

function addCollection() {
    const collectionName = document.getElementById('collection-name').value;
    if (collectionName) {
        db.collection(collectionName).add({})
            .then(() => {
                alert('Colección añadida con éxito');
                closeAddCollectionModal();
            })
            .catch(error => {
                console.error('Error al añadir colección: ', error);
                alert('Error al añadir colección');
            });
    } else {
        alert('Por favor, ingrese un nombre para la colección');
    }
}
