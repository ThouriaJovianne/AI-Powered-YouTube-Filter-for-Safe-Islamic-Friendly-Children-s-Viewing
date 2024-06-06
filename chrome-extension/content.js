function fetchTranscripts(videoIDs) {
    return new Promise((resolve, reject) => {
        const apiKey = 'AIzaSyBTDtR3jbeuFi4c7WhTFvLg1NR0fluLEkg'; // Replace 'YOUR_YOUTUBE_API_KEY' with your actual YouTube Data API key

        const promises = videoIDs.map(videoID => {
            return fetch(`https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoID}&key=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    // Extract transcript from the caption data
                    const transcript = data.items[0]?.snippet?.title || "Transcript not available";
                    return transcript;
                })
                .catch(error => {
                    console.error('Error fetching transcript:', error);
                    return "Transcript not available";
                });
        });

        Promise.all(promises)
            .then(transcripts => resolve(transcripts))
            .catch(error => reject(error));
    });
}

function getVideoIDs() {
    let videoIDs = [];

    let videoElements = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer');
    videoElements.forEach(videoElement => {
        let videoLink = videoElement.querySelector('a#video-title');
        if (videoLink) {
            let url = new URL(videoLink.href);
            videoIDs.push(url.searchParams.get('v'));
        }
    });

    return videoIDs;
}

function filterVideos(predictions) {
    let videoElements = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer');

    predictions.forEach((prediction, index) => {
        if (prediction === 1) {
            let videoElement = videoElements[index];
            if (videoElement) {
                videoElement.style.display = 'none';
            }
        }
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzePage") {
        const videoIDs = getVideoIDs();
        fetchTranscripts(videoIDs)
            .then(transcripts => {
                chrome.runtime.sendMessage({ action: "fetchTranscripts", transcripts: transcripts }, response => {
                    const predictions = response.predictions;
                    filterVideos(predictions);
                });
            })
            .catch(error => console.error('Error fetching transcripts:', error));
    }
});
