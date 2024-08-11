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
var storage = firebase.storage();

document.addEventListener('DOMContentLoaded', function() {
    loadCollections();
    loadPictograms();
});

function showTab(tab) {
    document.querySelectorAll('.tab').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.tab[onclick="showTab('${tab}')"]`).classList.add('active');
    if (tab === 'colecciones-pictogramas') {
        document.getElementById('colecciones-pictogramas').style.display = 'block';
        document.getElementById('pictogramas').style.display = 'none';
    } else {
        document.getElementById('colecciones-pictogramas').style.display = 'none';
        document.getElementById('pictogramas').style.display = 'block';
    }
}

function showCreateCollectionModal() {
    document.getElementById('create-collection-modal').style.display = 'block';
}

function closeCreateCollectionModal() {
    document.getElementById('create-collection-modal').style.display = 'none';
}

function createCollection() {
    var collectionName = document.getElementById('collection-name').value;
    if (collectionName) {
        db.collection('colecciones-pictogramas').add({
            name: collectionName
        }).then((docRef) => {
            console.log('Colección creada con ID: ', docRef.id);
            closeCreateCollectionModal();
            loadCollections();
        }).catch((error) => {
            console.error('Error al crear la colección: ', error);
        });
    }
}

function loadCollections() {
    db.collection('colecciones-pictogramas').get().then((querySnapshot) => {
        var collectionsList = document.getElementById('collections-list');
        var pictogramCollectionSelect = document.getElementById('pictogram-collection');
        var editPictogramCollectionSelect = document.getElementById('edit-pictogram-collection');
        var filterCollections = document.getElementById('filter-collections');

        collectionsList.innerHTML = '';
        pictogramCollectionSelect.innerHTML = '';
        editPictogramCollectionSelect.innerHTML = '';
        filterCollections.innerHTML = '<option value="">Todas las Colecciones</option>';

        querySnapshot.forEach((doc) => {
            var collection = doc.data();
            var div = document.createElement('div');
            div.className = 'collection-card';
            div.innerHTML = `
                <span>${collection.name}</span>
                <div class="actions">
                    <button onclick="editCollection('${doc.id}', '${collection.name}')">Editar</button>
                    <button onclick="deleteCollection('${doc.id}')">Eliminar</button>
                </div>
            `;
            collectionsList.appendChild(div);

            var option = document.createElement('option');
            option.value = doc.id;
            option.textContent = collection.name;
            pictogramCollectionSelect.appendChild(option);

            var editOption = document.createElement('option');
            editOption.value = doc.id;
            editOption.textContent = collection.name;
            editPictogramCollectionSelect.appendChild(editOption);

            var filterOption = document.createElement('option');
            filterOption.value = doc.id;
            filterOption.textContent = collection.name;
            filterCollections.appendChild(filterOption);
        });
    }).catch((error) => {
        console.error('Error al cargar las colecciones: ', error);
    });
}

function editCollection(id, currentName) {
    var newName = prompt('Nuevo nombre de la colección', currentName);
    if (newName) {
        db.collection('colecciones-pictogramas').doc(id).update({
            name: newName
        }).then(loadCollections)
        .catch((error) => {
            console.error('Error al renombrar la colección: ', error);
        });
    }
}

function deleteCollection(id) {
    db.collection('colecciones-pictogramas').doc(id).delete()
        .then(loadCollections)
        .catch((error) => {
            console.error('Error al eliminar la colección: ', error);
        });
}

function showCreatePictogramModal() {
    document.getElementById('create-pictogram-modal').style.display = 'block';
}

function closeCreatePictogramModal() {
    document.getElementById('create-pictogram-modal').style.display = 'none';
}

function createPictogram() {
    var pictogramName = document.getElementById('pictogram-name').value;
    var pictogramImage = document.getElementById('pictogram-image').files[0];
    var pictogramCollection = document.getElementById('pictogram-collection').value;

    if (pictogramName && pictogramImage && pictogramCollection) {
        var storageRef = storage.ref('pictogramas/' + pictogramImage.name);
        var uploadTask = storageRef.put(pictogramImage);

        uploadTask.on('state_changed', function(snapshot) {
            // Observa los cambios en el estado de la carga, como el progreso, pausa y reanudación
        }, function(error) {
            console.error('Error al cargar la imagen: ', error);
        }, function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                db.collection('pictograms').add({
                    name: pictogramName,
                    imageUrl: downloadURL,
                    collectionId: pictogramCollection
                }).then((docRef) => {
                    console.log('Pictograma creado con ID: ', docRef.id);
                    closeCreatePictogramModal();
                    loadPictograms();
                }).catch((error) => {
                    console.error('Error al crear el pictograma: ', error);
                });
            });
        });
    }
}

function loadPictograms() {
    db.collection('pictograms').get().then((querySnapshot) => {
        var pictogramsList = document.getElementById('pictograms-list');
        pictogramsList.innerHTML = '';

        querySnapshot.forEach((doc) => {
            var pictogram = doc.data();
            var div = document.createElement('div');
            div.className = 'pictogram-card';
            div.innerHTML = `
                <img src="${pictogram.imageUrl}" alt="${pictogram.name}">
                <span>${pictogram.name}</span>
                <div class="actions">
                    <button onclick="showEditPictogramModal('${doc.id}', '${pictogram.name}', '${pictogram.imageUrl}', '${pictogram.collectionId}')">Editar</button>
                    <button onclick="deletePictogram('${doc.id}')">Eliminar</button>
                </div>
            `;
            pictogramsList.appendChild(div);
        });
    }).catch((error) => {
        console.error('Error al cargar los pictogramas: ', error);
    });
}

function showEditPictogramModal(id, name, imageUrl, collectionId) {
    document.getElementById('edit-pictogram-name').value = name;
    document.getElementById('edit-pictogram-collection').value = collectionId;

    document.getElementById('edit-pictogram-modal').style.display = 'block';
    document.getElementById('edit-pictogram-modal').dataset.id = id;
}

function closeEditPictogramModal() {
    document.getElementById('edit-pictogram-modal').style.display = 'none';
}

function savePictogramEdits() {
    var pictogramId = document.getElementById('edit-pictogram-modal').dataset.id;
    var newName = document.getElementById('edit-pictogram-name').value;
    var newImage = document.getElementById('edit-pictogram-image').files[0];
    var newCollectionId = document.getElementById('edit-pictogram-collection').value;

    if (newName && pictogramId && newCollectionId) {
        if (newImage) {
            var storageRef = storage.ref('pictogramas/' + newImage.name);
            var uploadTask = storageRef.put(newImage);

            uploadTask.on('state_changed', function(snapshot) {
                // Observa los cambios en el estado de la carga, como el progreso, pausa y reanudación
            }, function(error) {
                console.error('Error al cargar la imagen: ', error);
            }, function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    db.collection('pictograms').doc(pictogramId).update({
                        name: newName,
                        imageUrl: downloadURL,
                        collectionId: newCollectionId
                    }).then(() => {
                        console.log('Pictograma actualizado');
                        closeEditPictogramModal();
                        loadPictograms();
                    }).catch((error) => {
                        console.error('Error al actualizar el pictograma: ', error);
                    });
                });
            });
        } else {
            db.collection('pictograms').doc(pictogramId).update({
                name: newName,
                collectionId: newCollectionId
            }).then(() => {
                console.log('Pictograma actualizado');
                closeEditPictogramModal();
                loadPictograms();
            }).catch((error) => {
                console.error('Error al actualizar el pictograma: ', error);
            });
        }
    }
}

function deletePictogram(id) {
    db.collection('pictograms').doc(id).delete()
        .then(loadPictograms)
        .catch((error) => {
            console.error('Error al eliminar el pictograma: ', error);
        });
}

function filterPictogramsByCollection() {
    var selectedCollection = document.getElementById('filter-collections').value;

    db.collection('pictograms').get().then((querySnapshot) => {
        var pictogramsList = document.getElementById('pictograms-list');
        pictogramsList.innerHTML = '';

        querySnapshot.forEach((doc) => {
            var pictogram = doc.data();

            if (!selectedCollection || pictogram.collectionId === selectedCollection) {
                var div = document.createElement('div');
                div.className = 'pictogram-card';
                div.innerHTML = `
                    <img src="${pictogram.imageUrl}" alt="${pictogram.name}">
                    <span>${pictogram.name}</span>
                    <div class="actions">
                        <button onclick="showEditPictogramModal('${doc.id}', '${pictogram.name}', '${pictogram.imageUrl}', '${pictogram.collectionId}')">Editar</button>
                        <button onclick="deletePictogram('${doc.id}')">Eliminar</button>
                    </div>
                `;
                pictogramsList.appendChild(div);
            }
        });
    }).catch((error) => {
        console.error('Error al cargar los pictogramas: ', error);
    });
}
