document.addEventListener('DOMContentLoaded', function() {
    const musicBtn = document.getElementById('musicBtn');
    const musicPlayer = document.getElementById('musicPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.querySelector('.progress');
    const timeRemaining = document.querySelector('.time-remaining');
    const audio = document.getElementById('backgroundMusic');

    let isPlaying = false;

    musicBtn.addEventListener('click', function() {
        musicPlayer.style.display = musicPlayer.style.display === 'none' ? 'block' : 'none';
    });

    playPauseBtn.addEventListener('click', togglePlayPause);

    function togglePlayPause() {
        if (isPlaying) {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audio.play().then(() => {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(error => {
                console.log('Воспроизведение не удалось:', error);
            });
        }
        isPlaying = !isPlaying;
    }

    audio.addEventListener('timeupdate', function() {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        const remainingTime = audio.duration - audio.currentTime;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);
        timeRemaining.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });

    audio.addEventListener('ended', function() {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
    });

    // Попытка автоматического воспроизведения
    window.addEventListener('load', function() {
        audio.play().then(() => {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(error => {
            console.log('Автоматическое воспроизведение не удалось:', error);
            // Показываем уведомление пользователю
            showNotification('Чтобы включить музыку, нажмите на кнопку воспроизведения.', 'info');
        });
    });

    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');
        const notificationIcon = document.getElementById('notificationIcon');

        notificationMessage.textContent = message;
        notificationIcon.className = 'notification-icon fas ' + (type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle');
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
});