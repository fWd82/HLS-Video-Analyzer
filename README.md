# HLS-Video-Analyzer

# Interactive HLS Player - HLS Video Analyzer

## Overview
The Interactive HLS Player is a web-based video stream analyzer designed to work with HLS (HTTP Live Streaming) format. This tool is particularly useful for analyzing video streams on Huawei Cloud but can be adapted for other sources. It allows users to load a video stream, select specific stream qualities, and view technical details about the stream such as bitrate, resolution, and codecs.

## Features
- **Video URL Input**: Enter the URL of an HLS stream to analyze.
- **Quality Selection**: Manually select the resolution and bitrate.
- **Real-time Playback Details**: View details such as the current level of video quality and specific codec information.
- **Adaptive Stream Quality**: Supports automatic switching between stream qualities based on network conditions.
- **Responsive Design**: The application is fully responsive, making it suitable for both desktop and mobile devices.

## Prerequisites
To run this analyzer, you will need a modern web browser that supports HTML5 video playback and JavaScript.

## Setup and Installation
1. **Clone the Repository or Download Files**
   - Clone this repository to your local machine or download the HTML file.
   - No additional installation is required since all dependencies are loaded from CDN.

2. **Open the HTML File**
   - Open the `index.html` file in a web browser to start using the HLS Video Analyzer.

## Usage
1. **Load a Video Stream**
   - Enter the URL of an HLS (.m3u8) stream in the input field and click the "Load Video" button. If no URL is entered, a default stream URL will be loaded automatically.

2. **Select Stream Quality**
   - Use the dropdown menu to select a specific video quality. The default setting is 'Auto', which adapts the quality based on network conditions.

3. **View Stream Information**
   - The right panel displays detailed information about the available stream profiles and the current playback details such as resolution, bitrate, and codecs.

## Technologies Used
- HTML/CSS
- JavaScript
- Bootstrap 4.3.1
- Video.js CDN
- HLS.js Library

## Author
- Fawad Iqbal

## License
This project is licensed under the MIT License - see the LICENSE file for details. 
