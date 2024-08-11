document.addEventListener('DOMContentLoaded', function() {
    const selectedVoice = localStorage.getItem('selectedVoice');
    if (selectedVoice) {
        document.querySelector(`input[name="voice"][value="${selectedVoice}"]`).checked = true;
    }

    document.getElementById('play-button').addEventListener('click', playMessage);
    document.querySelectorAll('input[name="voice"]').forEach((input) => {
        input.addEventListener('click', (event) => selectVoice(event.target.value));
    });
});

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

function selectVoice(voice) {
    localStorage.setItem('selectedVoice', voice);
    console.log('Selected voice:', voice);
}

function playMessage() {
    const messageText = document.getElementById('message-input').value;
    const selectedVoice = localStorage.getItem('selectedVoice');

    if (!selectedVoice) {
        alert('Por favor, selecciona una voz primero.');
        return;
    }

    if (messageText) {
        let voiceName;
        if (selectedVoice === 'male') {
            voiceName = 'Spanish Latin American Male'; // Voz masculina en español latino
        } else if (selectedVoice === 'female') {
            voiceName = 'Spanish Latin American Female'; // Voz femenina en español latino
        }

        console.log(`Playing message: ${messageText} with voice: ${voiceName}`);
        
        responsiveVoice.speak(messageText, voiceName, { rate: 1.0 });
    } else {
        alert('Por favor, escribe un mensaje.');
    }
}
