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

auth.onAuthStateChanged(user => {
    if (user) {
        // Obtén el nombre del usuario desde el perfil
        const userName = user.displayName || "Usuario";
        // Actualiza el saludo en el encabezado
        document.getElementById('greeting').innerText = `Hola ${userName}, ¿Qué deseas hacer?`;
    } else {
        // Redirige a la página de inicio de sesión si no hay usuario autenticado
        window.location.href = "inicio-carrusel-1.html";
    }
});

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

// Evitar que el botón de retroceso envíe a la pantalla de inicio de sesión o carga
window.addEventListener('popstate', function(event) {
    // Reemplaza la URL actual en el historial con la URL de la página de inicio actual
    history.replaceState(null, '', location.href);
    // Navegar a la página principal si se usa el botón de retroceso
    window.location.href = "home.html"; // Cambia esto a la página principal que desees
});

// Añadir un estado al historial para manejar el botón de retroceso
window.history.pushState(null, '', window.location.href);
