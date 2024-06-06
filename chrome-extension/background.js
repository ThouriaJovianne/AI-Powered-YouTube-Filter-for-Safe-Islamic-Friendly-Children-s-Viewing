chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchTranscripts") {
        fetch('http://127.0.0.1:5000/transcripts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ video_ids: message.video_ids })
        })
        .then(response => response.json())
        .then(transcripts => {
            sendResponse({ transcripts });
        })
        .catch(error => console.error('Error:', error));
        return true;  // Will respond asynchronously.
    }
});
