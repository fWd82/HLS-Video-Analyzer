document.addEventListener('DOMContentLoaded', function() {
    var video = document.getElementById('videoPlayer');
    var statsList = document.getElementById('stats');
    var qualitySelector = document.getElementById('qualitySelector');
    var profileInfo = document.getElementById('profileInfo');
    var watermark = document.querySelector('.watermark');


    // See if something is passed in HTTP URL request
    var urlFragment = window.location.hash.substring(1); // Remove the '#' and get the rest
    var textbox = document.getElementById('videoUrl');
    textbox.value = urlFragment; // Set the extracted URL fragment as the value of the textbox


    if (urlFragment) {
        if (urlFragment.trim() === '') {
            console.log('urlFragment is empty');
            // Perform action for empty textbox, such as displaying an error message
        } else {
            console.log('urlFragment has value:', urlFragment);
            // Perform action for non-empty textbox, such as processing the URL
            loadVideo();
        }
    } else {
        console.log('urlFragment with id "videoUrl" not found.');
    }

    // Load Video function
    function loadVideo() {

        console.log("textbox");
        var videoUrl = document.getElementById('videoUrl');
        console.log(videoUrl.value);

        // Your code here
        console.log('Video loading or other logic here');

        var videoUrl = document.getElementById('videoUrl').value;
        if (videoUrl.trim() === '') {
            videoUrl = 'https://vod.fawadiqbal.me/asset/913fadd0be3c156283dd9611bedb0fff/play_video/index.m3u8';
            document.getElementById('videoUrl').value = videoUrl;
        }

        fetchHeaders();

        fetchHeaders2();
        simulateBufferTime();
        fetchTSFiles();

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
    }
    
    // Check if Button is clicked to play the video
    document.getElementById('loadVideo').addEventListener('click', function() {
        loadVideo();
    });

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

    // Set up an interval to fetch headers every minute
    setInterval(fetchHeaders, 60000); // 60000 milliseconds = 1 minute
});


// Check if there is any changes in the URL.
window.addEventListener('hashchange', function() {
    var urlFragment = window.location.hash.substring(1);
    console.log('URL fragment:', urlFragment);


    loadVideo();

  });
  
  // Also check at initial page load
  var initialUrlFragment = window.location.hash.substring(1);
  console.log('Initial URL fragment:', initialUrlFragment);
  
  // Define a function to fetch headers
  function fetchHeaders() {
    var textbox = document.getElementById('videoUrl');

    fetch(textbox.value, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/vnd.apple.mpegurl'
        }
    }).then(response => {
        const headers = response.headers;
        const headerDetails = document.getElementById('headerDetails');
        headerDetails.innerHTML = '';

        headers.forEach((val, key) => {
            headerDetails.innerHTML += `<strong>${key}</strong>: ${val}\n`;
        });
    }).catch(error => {
        console.error('Error fetching headers:', error);
    });
}



/////////// NEW Methods PHP:

function simulateBufferTime() {
    const bufferTime = Math.random() * 1000; // Simulate buffer time in milliseconds
    const bufferDisplay = document.getElementById('bufferTime');
    bufferDisplay.textContent = `Buffer Time: ${bufferTime.toFixed(2)} ms`;
}

function fetchHeaders2() {
    // const inputValue = document.getElementById('inputField').value;
    // const inputValue = "https://vod.fawadiqbal.me/asset/913fadd0be3c156283dd9611bedb0fff/play_video/index.m3u8";
    
    console.log("fetchHeaders2() called");
    var inputValue = document.getElementById('videoUrl').value;
    console.log(inputValue);
    
    const url = `index2.php?inputValue=${inputValue}`;
    console.log("url2");
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('headersTable');
            tbody.innerHTML = ''; // Clear previous entries
            Object.entries(data).forEach(([key, value]) => {
                const row = `<tr><td>${key}</td><td>${value}</td></tr>`;
                tbody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error fetching headers:', error);
            document.getElementById('headersTable').innerHTML = '<tr><td colspan="2">Failed to load headers.</td></tr>';
        });
}

function fetchTSFiles() {
    console.log("fetchTSFiles() called: ");
    // const inputValue = document.getElementById('inputField').value;
     
    // const inputValue = encodeURIComponent("https://vod.fawadiqbal.me/asset/913fadd0be3c156283dd9611bedb0fff/play_video/index.m3u8");

    var inputValue = document.getElementById('videoUrl').value;
    console.log(inputValue);
    

    const url = `index1.php?inputValue=${inputValue}`;
    fetch(url)
    // fetch(`index.php`)
        .then(response => response.json())
        .then(tsFiles => {
            const tsList = document.getElementById('tsFilesList');
            tsList.innerHTML = ''; // Clear previous entries
            tsFiles.forEach(file => {
                const item = `<li>${file}</li>`;
                tsList.innerHTML += item;
            });
        })
        .catch(error => {
            console.error('Error fetching TS files:', error);
            document.getElementById('tsFilesList').innerHTML = '<li>Failed to load TS files.</li>';
        });
}