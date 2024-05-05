document.addEventListener('DOMContentLoaded', function () {
    
    const url = "https://vod.fawadiqbal.me/asset/913fadd0be3c156283dd9611bedb0fff/play_video/index.m3u8";
    
    simulateBufferTime(); 
    fetchHeaders(); 
    fetchTSFiles();

    console.log("getInputData"); 

    function simulateBufferTime(getInputData) {
        const bufferTime = Math.random() * 1000; // Simulate buffer time in milliseconds
        const bufferDisplay = document.getElementById('bufferTime');
        bufferDisplay.textContent = `Buffer Time: ${bufferTime.toFixed(2)} ms`;
    }

    function fetchHeaders() {
        // const inputValue = document.getElementById('inputField').value;
        const inputValue = "https://vod.fawadiqbal.me/asset/913fadd0be3c156283dd9611bedb0fff/play_video/index.m3u8";
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
        console.log("fetchTSFiles called Fetching from index.php: ");
        // const inputValue = document.getElementById('inputField').value;
         
        const inputValue = encodeURIComponent("https://vod.fawadiqbal.me/asset/913fadd0be3c156283dd9611bedb0fff/play_video/index.m3u8");
        const url = `index.php?inputValue=${inputValue}`;
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
 
});
