// Inicialización de Firebase (si no está inicializado ya en otro lugar)
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

function toggleLogout() {
    var logoutBox = document.getElementById('logout-box');
    if (logoutBox.style.display === 'block') {
        logoutBox.style.display = 'none';
    } else {
        logoutBox.style.display = 'block';
    }
}

function navigateTo(page) {
    window.location.href = page;
}
