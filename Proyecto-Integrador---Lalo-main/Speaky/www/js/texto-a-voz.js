document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log("Cordova is ready");

    document.getElementById('playButton').addEventListener('click', () => {
        let text = document.getElementById('textInput').value;
        if (text) {
            readTextAloud(text);
        } else {
            alert('Por favor, ingrese un texto o suba una imagen.');
        }
    });

    document.getElementById('fileInput').addEventListener('change', processFile);
}

function processFile() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];

    if (file && file.type.startsWith('image/')) {
        // Procesar imagen con Tesseract.js
        Tesseract.recognize(
            file,
            'eng',
            {
                logger: m => console.log(m)
            }
        ).then(({ data: { text } }) => {
            console.log(text);
            document.getElementById('textInput').value = text;
        }).catch(error => {
            console.error(error);
            alert('Hubo un error al procesar la imagen.');
        });
    } else {
        alert('Por favor, suba una imagen válida.');
    }
}

function readTextAloud(text) {
    TTS.speak({
        text: text,
        locale: 'es-ES',
        rate: 1.0
    }, function () {
        console.log("Text-to-Speech exitoso");
    }, function (reason) {
        console.log(reason);
    });
}
