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

// Lista de correos electrónicos de administradores
const adminEmails = [
  "audeloadmin@gmail.com",
  "roaadmin@gmail.com",
  "julianadmin@gmail.com"
];

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  // Iniciar sesión con correo y contraseña
  auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
          console.log('Usuario autenticado');

          // Verificar si el correo electrónico es de un administrador
          if (adminEmails.includes(userCredential.user.email)) {
              // Redirigir al dashboard si el usuario es un administrador
              window.location.href = "dashboard.html";
          } else {
              // Redirigir al home para usuarios normales
              window.location.href = "home.html";
          }
      })
      .catch((error) => {
          console.error('Error en el inicio de sesión: ', error.message);
          // Mostrar un mensaje de error al usuario
          var errorMessage = document.getElementById('error-message');
          errorMessage.textContent = 'Error al ingresar los datos, Favor de intentarlo de nuevo.';
          errorMessage.style.display = 'block';

          // Ocultar el mensaje de error después de 3 segundos
          setTimeout(() => {
              errorMessage.style.display = 'none';
          }, 3000);
      });
});
