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

document.getElementById('registration-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  var firstName = document.getElementById('first-name').value;
  var lastName = document.getElementById('last-name').value;
  var middleName = document.getElementById('middle-name').value;
  var username = document.getElementById('username').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  // Crear el usuario con correo y contraseña
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      // Guardar información adicional en Firestore
      return db.collection('usuarios').doc(user.uid).set({
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        username: username,
        email: email
      });
    })
    .then(() => {
      console.log('Usuario registrado y datos guardados en Firestore');
      // Mostrar el mensaje de éxito
      var successMessage = document.getElementById('success-message');
      successMessage.style.display = 'flex';
      setTimeout(() => {
        window.location.href = "login.html"; // Redirigir al login después de 3 segundos
      }, 3000);
    })
    .catch((error) => {
      console.error('Error en el registro: ', error.message);
      // Mostrar un mensaje de error al usuario
      alert('Error en el registro: ' + error.message);
    });
});