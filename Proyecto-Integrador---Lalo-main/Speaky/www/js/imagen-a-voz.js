function goBack() {
    window.history.back();
}

function convertTextToSpeech() {
    const text = document.getElementById('text-input').value;
    const voiceType = document.querySelector('input[name="voice"]:checked').value;
    const msg = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    if (voiceType === 'male') {
        msg.voice = voices.find(voice => voice.name.includes('male'));
    } else {
        msg.voice = voices.find(voice => voice.name.includes('female'));
    }
    
    window.speechSynthesis.speak(msg);
}

document.getElementById('image-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            processImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

function processImage(imageData) {
    Tesseract.recognize(
        imageData,
        'spa',
        {
            logger: m => console.log(m),
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        }
    ).then(({ data: { text } }) => {
        document.getElementById('text-input').value = text;
        document.getElementById('output').innerText = text;
    }).catch(err => {
        console.error(err);
        document.getElementById('output').innerText = "Error al reconocer el texto de la imagen.";
    });
}
