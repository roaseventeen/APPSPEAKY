document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    document.addEventListener('copy', function(e) {
        e.preventDefault();
    });

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    let xDown = null;
    let yDown = null;

    function handleTouchStart(evt) {
        const firstTouch = (evt.touches || evt.originalEvent.touches)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    };

    function handleTouchMove(evt) {
        if (!xDown || !yDown) {
            return;
        }

        let xUp = evt.touches[0].clientX;
        let yUp = evt.touches[0].clientY;

        let xDiff = xDown - xUp;
        let yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                navigateToNext(); // Swipe left
            } else {
                navigateToPrev(); // Swipe right
            }
        }

        xDown = null;
        yDown = null;
    }

    function navigateTo(pageNumber) {
        switch(pageNumber) {
            case 1:
                window.location.href = 'registro-1.html';
                break;
            case 2:
                window.location.href = 'registro-1.1.html';
                break;
            case 3:
                window.location.href = 'registro-1.2.html';
                break;
        }
    }

    function navigateToNext() {
        const currentPage = getCurrentPageNumber();
        let nextPage = currentPage + 1;
        if (nextPage > 3) nextPage = 1; // loop back to the first page
        navigateTo(nextPage);
    }

    function navigateToPrev() {
        const currentPage = getCurrentPageNumber();
        let prevPage = currentPage - 1;
        if (prevPage < 1) prevPage = 3; // loop back to the last page
        navigateTo(prevPage);
    }

    function getCurrentPageNumber() {
        const currentPage = window.location.href.split('registro-')[1].split('.')[0];
        if (currentPage === '1') return 1;
        if (currentPage === '1.1') return 2;
        if (currentPage === '1.2') return 3;
        return 1; // default to the first page
    }
});
