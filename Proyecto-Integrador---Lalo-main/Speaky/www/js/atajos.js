// Configuración de Firebase
var firebaseConfig = {
    apiKey: "AIzaSyA1ceTerLSwI02Fxfk4CcGQ7lJZR4zcbEA",
    authDomain: "speaky-22873.firebaseapp.com",
    projectId: "speaky-22873",
    storageBucket: "speaky-22873.appspot.com",
    messagingSenderId: "986263322125",
    appId: "1:986263322125:android:5bf94cfdf2a930ca299f44"
};
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();

let currentCollectionId = null;
let currentUser = null;
let shortcutToEditId = null;
let collectionToDeleteId = null;

document.addEventListener("DOMContentLoaded", function() {
    auth.onAuthStateChanged(function(user) {
        if (user) {
            currentUser = user;
            loadCollections();
        } else {
            alert('Por favor, inicie sesión para acceder a sus atajos.');
            window.location.href = "login.html"; // Redirigir al login si no está autenticado
        }
    });

    document.getElementById('create-collection-button').addEventListener('click', showCreateCollectionModal);
    document.getElementById('create-shortcut-button').addEventListener('click', showCreateShortcutModal);
    document.getElementById('back-button').addEventListener('click', navigateToPrevious);

    document.getElementById('create-shortcut-form').addEventListener('submit', function(event) {
        event.preventDefault();
        createShortcut();
    });

    document.getElementById('edit-shortcut-form').addEventListener('submit', function(event) {
        event.preventDefault();
        updateShortcut();
    });

    document.getElementById('confirm-delete-button').addEventListener('click', function() {
        if (collectionToDeleteId) {
            deleteCollection(collectionToDeleteId);
        }
        closeDeleteConfirmationModal();
    });
});

function loadCollections() {
    var collectionsList = document.getElementById('collections-list');
    var collectionSelect = document.getElementById('collection-select');
    if (!collectionsList || !collectionSelect) {
        console.error('Error: los elementos collections-list o collection-select no se encontraron en el DOM.');
        return;
    }

    db.collection('collections').where('userId', '==', currentUser.uid).get()
        .then((querySnapshot) => {
            collectionsList.innerHTML = '';
            collectionSelect.innerHTML = '';
            querySnapshot.forEach((doc) => {
                var collection = doc.data();
                var div = document.createElement('div');
                div.className = 'collection';
                div.onclick = function() {
                    toggleCollection(doc.id, collection.name);
                };
                div.innerHTML = `
                    <img src="img/icon-carpeta.png" alt="Icono" class="collection-icon">
                    <span class="collection-name">${collection.name}</span>
                    <div class="collection-actions">
                        <button onclick="event.stopPropagation(); renameCollection('${doc.id}', '${collection.name}')">Editar</button>
                        <button onclick="event.stopPropagation(); confirmDeleteCollection('${doc.id}')">Eliminar</button>
                    </div>
                `;
                collectionsList.appendChild(div);

                var option = document.createElement('option');
                option.value = doc.id;
                option.textContent = collection.name;
                collectionSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error al cargar las colecciones: ', error);
        });
}

function showCreateCollectionModal() {
    var modal = document.getElementById('create-collection-modal');
    modal.style.display = 'block';
}

function closeCreateCollectionModal() {
    var modal = document.getElementById('create-collection-modal');
    modal.style.display = 'none';
}

function showCreateShortcutModal() {
    var modal = document.getElementById('create-shortcut-modal');
    modal.style.display = 'block';
}

function closeCreateShortcutModal() {
    var modal = document.getElementById('create-shortcut-modal');
    modal.style.display = 'none';
}

function showEditShortcutModal(id, name, content) {
    shortcutToEditId = id;
    var modal = document.getElementById('edit-shortcut-modal');
    document.getElementById('edit-shortcut-name').value = name;
    document.getElementById('edit-shortcut-content').value = content;
    modal.style.display = 'block';
}

function closeEditShortcutModal() {
    var modal = document.getElementById('edit-shortcut-modal');
    modal.style.display = 'none';
}

function createCollection() {
    var collectionName = document.getElementById('collection-name').value;
    db.collection('collections').add({
        userId: currentUser.uid,
        name: collectionName
    })
    .then((docRef) => {
        console.log('Colección creada con ID: ', docRef.id);
        loadCollections();
        closeCreateCollectionModal();
    })
    .catch((error) => {
        console.error('Error al crear la colección: ', error);
    });
}

function renameCollection(id, currentName) {
    document.getElementById('rename-collection-modal').style.display = 'block';
    const renameForm = document.getElementById('rename-collection-form');
    const newNameInput = document.getElementById('new-collection-name');
    newNameInput.value = currentName;

    renameForm.onsubmit = function(event) {
        event.preventDefault();
        const newName = newNameInput.value;
        if (newName) {
            db.collection('collections').doc(id).update({
                name: newName
            }).then(() => {
                loadCollections();
                closeRenameCollectionModal();
            }).catch((error) => {
                console.error('Error al renombrar la colección: ', error);
            });
        }
    };
}

function closeRenameCollectionModal() {
    document.getElementById('rename-collection-modal').style.display = 'none';
}

function confirmDeleteCollection(id) {
    document.getElementById('delete-confirmation-modal').style.display = 'block';
    collectionToDeleteId = id;
}

function closeDeleteConfirmationModal() {
    document.getElementById('delete-confirmation-modal').style.display = 'none';
}

function deleteCollection(id) {
    db.collection('collections').doc(id).delete()
        .then(loadCollections)
        .catch((error) => {
            console.error('Error al eliminar la colección: ', error);
        });
}

function toggleCollection(collectionId, collectionName) {
    currentCollectionId = collectionId;
    document.getElementById('collections-list').style.display = 'none';
    document.getElementById('main-action-bar').style.display = 'none';
    document.getElementById('main-search-container').style.display = 'none';
    document.getElementById('shortcuts-container').style.display = 'block';
    document.getElementById('back-button').style.display = 'block';
    document.getElementById('back-button').onclick = navigateToMain;
    document.getElementById('header-title').textContent = collectionName;
    loadShortcuts(collectionId);
}

function loadShortcuts(collectionId) {
    db.collection('collections').doc(collectionId).collection('shortcuts').get()
        .then((querySnapshot) => {
            var shortcutsList = document.getElementById('shortcuts-list');
            shortcutsList.innerHTML = '';
            shortcutsList.style.display = 'grid';
            querySnapshot.forEach((doc) => {
                var shortcut = doc.data();
                var div = document.createElement('div');
                div.className = 'shortcut';
                div.innerHTML = `
                    <strong>${shortcut.name}</strong>
                    <div class="content">${shortcut.content}</div>
                    <div class="actions">
                        <button onclick="speakContent('${shortcut.content}')">🔊</button>
                        <button onclick="showEditShortcutModal('${doc.id}', '${shortcut.name}', '${shortcut.content}')">✏️</button>
                        <button onclick="deleteShortcut('${doc.id}')">🗑️</button>
                    </div>
                `;
                shortcutsList.appendChild(div);
            });
        })
        .catch((error) => {
            console.error('Error al cargar los atajos: ', error);
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

function deleteShortcut(id) {
    db.collection('collections').doc(currentCollectionId).collection('shortcuts').doc(id).delete()
        .then(() => {
            loadShortcuts(currentCollectionId);
        })
        .catch((error) => {
            console.error('Error al eliminar el atajo: ', error);
        });
}

function updateShortcut() {
    var shortcutName = document.getElementById('edit-shortcut-name').value;
    var shortcutContent = document.getElementById('edit-shortcut-content').value;

    if (shortcutToEditId) {
        db.collection('collections').doc(currentCollectionId).collection('shortcuts').doc(shortcutToEditId).update({
            name: shortcutName,
            content: shortcutContent
        })
        .then(() => {
            loadShortcuts(currentCollectionId);
            closeEditShortcutModal();
        })
        .catch((error) => {
            console.error('Error al actualizar el atajo: ', error);
        });
    }
}

function navigateToMain() {
    document.getElementById('collections-list').style.display = 'grid';
    document.getElementById('main-action-bar').style.display = 'flex';
    document.getElementById('main-search-container').style.display = 'block';
    document.getElementById('shortcuts-container').style.display = 'none';
    document.getElementById('back-button').style.display = 'none';
    document.getElementById('header-title').textContent = 'Atajos';
    currentCollectionId = null;
}

function navigateToPrevious() {
    if (currentCollectionId) {
        navigateToMain();
    } else {
        window.location.href = "home.html";
    }
}

function filterCollections() {
    var searchValue = document.getElementById('search-bar').value.toLowerCase();
    var collections = document.querySelectorAll('.collection');

    collections.forEach(function(collection) {
        var collectionName = collection.querySelector('.collection-name').textContent.toLowerCase();
        if (collectionName.includes(searchValue)) {
            collection.style.display = 'block';
        } else {
            collection.style.display = 'none';
        }
    });
}

function createShortcut() {
    var collectionId = document.getElementById('collection-select').value;
    var shortcutName = document.getElementById('shortcut-name').value;
    var shortcutContent = document.getElementById('shortcut-content').value;

    db.collection('collections').doc(collectionId).collection('shortcuts').add({
        userId: currentUser.uid,
        name: shortcutName,
        content: shortcutContent
    })
    .then((docRef) => {
        console.log('Atajo creado con ID: ', docRef.id);
        loadShortcuts(collectionId);
        closeCreateShortcutModal();
    })
    .catch((error) => {
        console.error('Error al crear el atajo: ', error);
    });
}
