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
var auth = firebase.auth();

function toggleProfileMenu() {
    var profileMenu = document.getElementById('profile-menu');
    if (profileMenu.style.display === 'block') {
        profileMenu.style.display = 'none';
    } else {
        profileMenu.style.display = 'block';
    }
}

function logout() {
    auth.signOut().then(() => {
        console.log('Sesión cerrada correctamente');
        window.location.href = "inicio-carrusel-1.html";
    }).catch((error) => {
        console.error('Error al cerrar sesión: ', error);
    });
}
