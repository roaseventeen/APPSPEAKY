let currentIndex = 1;
const views = ['inicio-carrusel-1.html', 'inicio-carrusel-2.html', 'inicio-carrusel-3.html', 'inicio-carrusel-4.html'];
let isPaused = false;
let startX;
let autoChange;

function navigateToView(index) {
    if (index >= 0 && index < views.length) {
        window.location.href = views[index];
    }
}

function autoNavigate() {
    if (!isPaused && currentIndex < views.length - 1) {
        currentIndex++;
        navigateToView(currentIndex);
    } else if (!isPaused && currentIndex === views.length - 1) {
        clearTimeout(autoChange);
    }
}

function startAutoChange() {
    autoChange = setTimeout(autoNavigate, 5000);
}

function stopAutoChange() {
    clearTimeout(autoChange);
}

function handleTouchStart(event) {
    startX = event.touches[0].clientX;
    isPaused = true;
    stopAutoChange();
    updateProgressBar();
}

function handleTouchMove(event) {
    if (!startX) {
        return;
    }

    let endX = event.touches[0].clientX;
    let diffX = startX - endX;

    if (diffX > 50) {
        // Swipe left
        if (currentIndex < views.length - 1) {
            currentIndex++;
            navigateToView(currentIndex);
        }
    } else if (diffX < -50) {
        // Swipe right
        if (currentIndex > 0) {
            currentIndex--;
            navigateToView(currentIndex);
        }
    }

    startX = null;
}

function handleTouchEnd() {
    isPaused = false;
    startAutoChange();
    updateProgressBar();
}

function updateProgressBar() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach((bar, index) => {
        bar.style.width = index <= currentIndex ? '100%' : '0';
        if (index === currentIndex) {
            bar.style.transition = 'width 5s linear';
            setTimeout(() => {
                bar.style.width = '100%';
            }, 50); // Espera a que se apliquen los estilos iniciales
        } else {
            bar.style.transition = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    updateProgressBar();
    startAutoChange();

    document.body.addEventListener('click', (e) => {
        const screenWidth = window.innerWidth;
        if (e.clientX > screenWidth / 2) {
            // Click on right side of the screen
            if (currentIndex < views.length - 1) {
                currentIndex++;
                navigateToView(currentIndex);
            }
        } else {
            // Click on left side of the screen
            if (currentIndex > 0) {
                currentIndex--;
                navigateToView(currentIndex);
            }
        }
    });
});
