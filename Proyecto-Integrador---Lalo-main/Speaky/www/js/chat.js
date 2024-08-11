document.addEventListener('deviceready', function() {
    console.log('Device is ready');
    checkAndRequestPermissions();

    // Asegurar que las funciones de botón se registren después de `deviceready`
    document.getElementById('tts-button').addEventListener('click', showTTSForm);
    document.getElementById('people-button').addEventListener('click', showAddPersonModal);
}, false);

function checkAndRequestPermissions() {
    if (cordova.platformId == 'android') {
        var permissions = cordova.plugins.permissions;
        permissions.checkPermission(permissions.RECORD_AUDIO, function(status) {
            if (!status.hasPermission) {
                console.log('Solicitando permiso para grabar audio');
                permissions.requestPermission(permissions.RECORD_AUDIO, function(status) {
                    if (!status.hasPermission) {
                        console.warn('No se concedió el permiso para el micrófono.');
                    } else {
                        console.log('Permiso para el micrófono concedido.');
                    }
                });
            } else {
                console.log('Permiso para el micrófono ya concedido.');
            }
        }, function(error) {
            console.error('Error verificando el permiso:', error);
        });
    }
}

function requestMicrophonePermission() {
    console.log('Requesting microphone permission');
    var permissions = cordova.plugins.permissions;
    permissions.requestPermission(permissions.RECORD_AUDIO, function(status) {
        if (status.hasPermission) {
            console.log('Microphone permission granted');
            showTTSModal();
        } else {
            alert('Permiso de micrófono no concedido.');
        }
    }, function(error) {
        console.error('Permiso de micrófono denegado:', error);
    });
}

function goHome() {
    console.log('Navigating to home');
    window.location.href = 'home.html';
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
}

function showInfoModal() {
    document.getElementById('info-modal').style.display = 'flex';
    toggleMenu();
}

function closeInfoModal() {
    document.getElementById('info-modal').style.display = 'none';
}

function showAddPersonModal() {
    document.getElementById('add-person-modal').style.display = 'flex';
}

function closeAddPersonModal() {
    document.getElementById('add-person-modal').style.display = 'none';
}

function addPerson() {
    const personName = document.getElementById('person-name').value;
    if (personName) {
        const personList = document.createElement('div');
        personList.className = 'person';
        personList.textContent = personName;
        document.body.appendChild(personList);
        
        document.getElementById('person-name').value = '';
        closeAddPersonModal(); // Cerrar el modal después de agregar la persona
    }
}

function showWriteMessageForm() {
    const personCheckboxes = document.getElementById('person-checkboxes');
    personCheckboxes.innerHTML = ''; // Limpiar los checkboxes anteriores
    const personList = Array.from(document.getElementsByClassName('person'));
    personList.forEach(person => {
        const checkboxLabel = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'radio'; // Cambiar a radio button para permitir solo una selección
        checkbox.name = 'person';
        checkbox.value = person.textContent;
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(document.createTextNode(person.textContent));
        personCheckboxes.appendChild(checkboxLabel);
        personCheckboxes.appendChild(document.createElement('br'));
    });
    document.getElementById('write-message-modal').style.display = 'flex';
}

function closeWriteMessageModal() {
    document.getElementById('write-message-modal').style.display = 'none';
}

function sendMessage() {
    const selectedPerson = document.querySelector('input[name="person"]:checked');
    if (selectedPerson) {
        const messageText = document.getElementById('message-text').value;
        if (messageText) {
            addMessageToChat(`${selectedPerson.value} dice: ${messageText}`, 'user');
            document.getElementById('message-text').value = ''; // Limpiar el campo de mensaje
            closeWriteMessageModal(); // Cerrar el modal después de enviar el mensaje
        } else {
            alert('Por favor, escribe un mensaje.');
        }
    } else {
        alert('Por favor, selecciona una persona.');
    }
}

let recognition;

function showTTSForm() {
    const ttsPersonCheckboxes = document.getElementById('tts-person-checkboxes');
    ttsPersonCheckboxes.innerHTML = ''; // Limpiar los checkboxes anteriores
    const personList = Array.from(document.getElementsByClassName('person'));
    personList.forEach(person => {
        const checkboxLabel = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'radio'; // Cambiar a radio button para permitir solo una selección
        checkbox.name = 'person';
        checkbox.value = person.textContent;
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(document.createTextNode(person.textContent));
        ttsPersonCheckboxes.appendChild(checkboxLabel);
        ttsPersonCheckboxes.appendChild(document.createElement('br'));
    });
    document.getElementById('tts-modal').style.display = 'flex';
}

function closeTTSModal() {
    document.getElementById('tts-modal').style.display = 'none';
}

function startListening() {
    const selectedPerson = document.querySelector('#tts-person-checkboxes input[name="person"]:checked');
    if (selectedPerson) {
        console.log('Starting to listen for', selectedPerson.value);
        if (!recognition) {
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'es-ES';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = function(event) {
                let transcript = event.results[0][0].transcript;
                console.log('Transcription result:', transcript);
                addMessageToChat(`${selectedPerson.value} dice: ${transcript}`, 'user');
                document.getElementById('transcription').textContent = transcript;
            };

            recognition.onspeechend = function() {
                console.log('Speech ended');
                recognition.stop();
            };

            recognition.onerror = function(event) {
                console.error('Speech recognition error:', event.error);
                document.getElementById('transcription').textContent = 'Error: ' + event.error;
            };
        }
        recognition.start();
    } else {
        alert('Por favor, selecciona una persona.');
    }
}

function stopListening() {
    console.log('Stopping listening');
    if (recognition) {
        recognition.stop();
    }
}

function addMessageToChat(message, sender) {
    console.log('Adding message to chat:', message);
    let chatContainer = document.getElementById('chat-container');
    let messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.innerHTML = `${message} <img src="speaker-icon.png" class="icon" alt="Escuchar" onclick="playMessage('${message}')"> <img src="save-icon.png" class="icon" alt="Guardar">`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function playMessage(message) {
    TTS.speak({
        text: message,
        locale: 'es-ES',
        rate: 1.0
    }, function() {
        console.log('Text-to-speech success.');
    }, function(error) {
        console.error('Text-to-speech error:', error);
    });
}
