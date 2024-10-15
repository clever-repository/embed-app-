const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files like index.html

// Route to handle embedding content
app.post('/embed', (req, res) => {
  const { url } = req.body;
  
  try {
    // Determine the platform based on URL and return appropriate HTML
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const embedHTML = generateYouTubeEmbed(url);
      res.json({ embedHTML });
    } else if (url.includes('vimeo.com')) {
      const embedHTML = generateVimeoEmbed(url);
      res.json({ embedHTML });
    } else if (url.includes('notion.so')) {
      const embedHTML = generateNotionEmbed(url);
      res.json({ embedHTML });
    } else {
      res.status(400).json({ message: 'Unsupported platform' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing embed', error });
  }
});

// YouTube Embed Helper
function generateYouTubeEmbed(url) {
  const videoId = extractYouTubeVideoId(url);
  return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
}

function extractYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Vimeo Embed Helper
function generateVimeoEmbed(url) {
  const videoId = url.split('/').pop();
  return `<iframe src="https://player.vimeo.com/video/${videoId}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;
}

// Notion Embed Helper
function generateNotionEmbed(url) {
  return `<iframe src="${url.replace('notion.so', 'notion.site')}" width="100%" height="500" frameborder="0"></iframe>`;
}

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
