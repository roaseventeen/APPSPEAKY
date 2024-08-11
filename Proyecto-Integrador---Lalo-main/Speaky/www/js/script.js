function readCollectionsFromJS(userId) {
    return db.collection('collections').where('userId', '==', userId).get();
}

function readShortcutsFromJS(collectionId) {
    return db.collection('collections').doc(collectionId).collection('shortcuts').get();
}


