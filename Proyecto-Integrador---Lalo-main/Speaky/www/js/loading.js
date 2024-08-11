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

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                // Usuario autenticado
                window.location.href = "home.html";
            } else {
                // Usuario no autenticado
                window.location.href = "inicio-carrusel-1.html";
            }
        });
    }, 5000);
});
