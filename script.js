document.addEventListener('DOMContentLoaded', function() {
    var video = document.getElementById('videoPlayer');
    var statsList = document.getElementById('stats');
    var qualitySelector = document.getElementById('qualitySelector');
    var profileInfo = document.getElementById('profileInfo');
    var watermark = document.querySelector('.watermark');

    // Function to append a new log entry to the ordered list
    function appendLog(message) {
        var newEntry = document.createElement('li');
        newEntry.innerHTML = message;
        statsList.appendChild(newEntry); // Append the new entry to the list
    }

    video.addEventListener('play', function() {
        appendLog('Video is playing.');
    });

    video.addEventListener('pause', function() {
        appendLog('Video is paused.');
    });

    document.getElementById('loadVideo').addEventListener('click', function() {
        var videoUrl = document.getElementById('videoUrl').value;
        if (videoUrl.trim() === '') {
            videoUrl = 'https://vod.fawadiqbal.me/asset/913fadd0be3c156283dd9611bedb0fff/play_video/index.m3u8';
            document.getElementById('videoUrl').value = videoUrl;
        }

        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            // hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
            //     var audioTracks = data.levels.map(level => level.audioCodec).filter(Boolean);
            //     appendLog(`Audio tracks available: ${audioTracks.length} - [${audioTracks.join(", ")}]`);
            //     video.play();
            // });

            hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
                var audioTracks = data.levels.map(level => level.audioCodec).filter(Boolean);
                if (audioTracks.length > 0) {
                    appendLog(`<strong>Audio tracks</strong>: ${audioTracks.length} - [${audioTracks.join(", ")}]`);
                } else {
                    appendLog("<strong>Audio Tracks</strong>: No audio tracks available");
                }
                video.play();
            });
            

            hls.on(Hls.Events.MANIFEST_LOADED, function(event, data) {
                qualitySelector.innerHTML = '';
                var table = '<table class="table table-hover"><thead><tr><th>Level</th><th>Resolution</th><th>Bitrate</th><th>Video Codec</th><th>Audio Codec</th><th>Playlist URL</th></tr></thead><tbody>';
                data.levels.forEach((level, index) => {
                    var option = document.createElement('option');
                    option.value = index;
                    option.text = 'Level ' + index + ': ' + level.width + 'x' + level.height + ', ' + (level.bitrate / 1024).toFixed(2) + ' kbps';
                    qualitySelector.appendChild(option);

                    table += '<tr><td>' + index + '</td><td>' + level.width + 'x' + level.height + '</td><td>' +
                            (level.bitrate / 1024).toFixed(2) + ' kbps</td><td>' + (level.videoCodec || 'N/A') +
                            '</td><td>' + (level.audioCodec || 'N/A') + '</td><td>' + level.url + '</td></tr>';
                });
                table += '</tbody></table>';
                profileInfo.innerHTML = table;

                var autoOption = document.createElement('option');
                autoOption.value = -1;
                autoOption.text = 'Auto';
                autoOption.selected = true;
                qualitySelector.appendChild(autoOption);
            });

            hls.on(Hls.Events.LEVEL_SWITCHED, function(event, data) {
                var level = hls.levels[data.level];
                watermark.textContent = (hls.currentLevel === -1 ? 'Auto: ' : 'Profile: ') + 'Level ' + data.level + ' - ' + level.width + 'x' + level.height + ', ' + (level.bitrate / 1024).toFixed(2) + ' kbps';
                var qualityDetails = 'Current Playback: Level ' + data.level +
                    ', Resolution: ' + level.width + 'x' + level.height +
                    ', Bitrate: ' + (level.bitrate / 1024).toFixed(2) + ' kbps';
                appendLog(qualityDetails);
            });

            qualitySelector.onchange = function() {
                if (this.value === '-1') {
                    hls.currentLevel = -1;
                    setTimeout(() => {
                        var level = hls.levels[hls.currentLevel];
                        watermark.textContent = 'Auto: Level ' + hls.currentLevel + ' - ' + level.width + 'x' + level.height + ', ' + (level.bitrate / 1024).toFixed(2) + ' kbps';
                        var currentQuality = 'Resolution: ' + level.width + 'x' + level.height + ', Bitrate: ' + (level.bitrate / 1024).toFixed(2) + ' kbps';
                        appendLog(currentQuality);
                    }, 1000); // Delay to allow HLS.js to switch to an initial auto level
                    appendLog('Switched to <strong>Automatic Quality Mode</strong>. Current quality details will update automatically.');
                } else {
                    hls.currentLevel = parseInt(this.value);
                    var level = hls.levels[hls.currentLevel];
                    watermark.textContent = 'Profile: Level ' + this.value + ' - ' + level.width + 'x' + level.height + ', ' + (level.bitrate / 1024).toFixed(2) + ' kbps';
                    appendLog('Manual switch to level: <strong>' + this.value + '</strong>, Resolution: <strong>' + level.width + 'x' + level.height + '</strong>, Bitrate: <strong>' + (level.bitrate / 1024).toFixed(2) + ' kbps</strong>');
                }
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoUrl;
            video.addEventListener('loadedmetadata', function() {
                video.play();
            });
        }
    });
});
