// Inicialización de Firebase
var firebaseConfig = {
    apiKey: "AIzaSyA1ceTerLSwI02Fxfk4CcGQ7lJZR4zcbEA",
    authDomain: "speaky-22873.firebaseapp.com",
    projectId: "speaky-22873",
    storageBucket: "speaky-22873.appspot.com",
    messagingSenderId: "986263322125",
    appId: "1:986263322125:android:5bf94cfdf2a930ca299f44"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    loadCollections();
});

function loadCollections() {
    db.collection('colecciones-pictogramas').get().then((querySnapshot) => {
        var collectionsContainer = document.getElementById('collections-container');
        collectionsContainer.innerHTML = '';

        querySnapshot.forEach((doc) => {
            var collection = doc.data();
            var div = document.createElement('div');
            div.className = 'folder';
            div.onclick = function() {
                loadPictograms(doc.id, collection.name);
            };
            div.innerHTML = `
                <img src="img/icon-carpeta.png" alt="${collection.name}">
                <p>${collection.name}</p>
            `;
            collectionsContainer.appendChild(div);
        });
    }).catch((error) => {
        console.error('Error al cargar las colecciones: ', error);
    });
}

function loadPictograms(collectionId, collectionName) {
    var headerTitle = document.querySelector('.header-title');
    headerTitle.textContent = collectionName;
    
    db.collection('pictograms').where('collectionId', '==', collectionId).get().then((querySnapshot) => {
        var collectionsContainer = document.getElementById('collections-container');
        collectionsContainer.innerHTML = '';

        querySnapshot.forEach((doc) => {
            var pictogram = doc.data();
            var div = document.createElement('div');
            div.className = 'folder';
            div.onclick = function() {
                speakContent(pictogram.name);
            };
            div.innerHTML = `
                <img src="${pictogram.imageUrl}" alt="${pictogram.name}">
                <p>${pictogram.name}</p>
            `;
            collectionsContainer.appendChild(div);
        });
    }).catch((error) => {
        console.error('Error al cargar los pictogramas: ', error);
    });
}

function speakContent(content) {
    const voiceName = 'Spanish Latin American Male';

    responsiveVoice.speak(content, voiceName, {
        rate: 1.0,
        onend: function() {
            console.log('Reproducción de voz completada.');
        },
        onerror: function(event) {
            console.error('Error al sintetizar voz: ', event.error);
        }
    });
}

function goBack() {
    var headerTitle = document.querySelector('.header-title');
    if (headerTitle.textContent === 'Pictogramas') {
        window.location.href = 'home.html';
    } else {
        headerTitle.textContent = 'Pictogramas';
        loadCollections();
    }
}
