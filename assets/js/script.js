// assets/js/scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling für interne Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Modal Dynamische Inhalte
    const beatModal = document.getElementById('beatModal');
    const modalTitle = beatModal.querySelector('.modal-title');
    const modalImage = beatModal.querySelector('.modal-body img');
    const modalGenre = beatModal.querySelector('.modal-body p:nth-of-type(1)');
    const modalAudio = beatModal.querySelector('.modal-body audio source');
    const modalDescription = beatModal.querySelector('.modal-body p:nth-of-type(2)');
    const modalAudioPlayer = beatModal.querySelector('.modal-body audio');
    const modalFormItemName = beatModal.querySelector('form input[name="item_name"]');
    const modalFormAmount = beatModal.querySelector('form input[name="amount"]');

    document.querySelectorAll('.card-title').forEach(title => {
        title.addEventListener('click', () => {
            const card = title.closest('.card');
            const beatTitle = title.textContent;
            const beatGenreText = card.querySelector('.card-text').textContent.replace('Genre: ', '');
            const beatImageSrc = card.querySelector('img').src;
            const beatAudioSrc = card.querySelector('audio source') ? card.querySelector('audio source').src : '';
            const beatDescription = `Dieser Beat eignet sich perfekt für energiegeladene ${beatGenreText}-Tracks und bietet eine einzigartige Mischung aus kraftvollen Drums und melodischen Synths.`;

            // Setze die Modal-Inhalte
            modalTitle.textContent = beatTitle;
            modalImage.src = beatImageSrc;
            modalGenre.textContent = `Genre: ${beatGenreText}`;
            if (beatAudioSrc) {
                modalAudio.src = beatAudioSrc;
                modalAudioPlayer.load();
                modalAudioPlayer.parentElement.style.display = 'block';
            } else {
                modalAudioPlayer.parentElement.style.display = 'none';
            }
            modalDescription.textContent = `Beschreibung: ${beatDescription}`;
            modalFormItemName.value = beatTitle;
            // Preis wird aus dem Preis-Paragraphen geholt
            const priceText = card.querySelector('.mt-2 strong') ? card.querySelector('.mt-2 strong').nextSibling.textContent.trim() : '49.99';
            const priceValue = priceText.replace('€', '').trim();
            modalFormAmount.value = priceValue;
        });
    });

    // Filter-Buttons Funktionalität (falls vorhanden)
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                const beats = document.querySelectorAll('.beat-item');

                beats.forEach(beat => {
                    if (filter === 'all' || beat.classList.contains(filter)) {
                        beat.style.display = 'block';
                        beat.classList.add('aos-animate');
                    } else {
                        beat.style.display = 'none';
                        beat.classList.remove('aos-animate');
                    }
                });

                // Setze aktive Klasse
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Initialisiere "Alle" als aktiven Filter beim Laden
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) {
            allBtn.classList.add('active');
        }
    }
});
