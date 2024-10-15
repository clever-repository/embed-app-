import Cors from 'cors';

// Initialize CORS
const cors = Cors({
    methods: ['POST', 'GET', 'HEAD'],
});

// Helper function to run middleware
const runMiddleware = (req, res, fn) =>
    new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });

export default async function handler(req, res) {
    await runMiddleware(req, res, cors);

    if (req.method === 'POST') {
        const { url } = req.body;

        // Log the received URL for debugging
        console.log("Received URL:", url);

        try {
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const embedHTML = generateYouTubeEmbed(url);
                res.status(200).json({ embedHTML });
            } else if (url.includes('vimeo.com')) {
                const embedHTML = generateVimeoEmbed(url);
                res.status(200).json({ embedHTML });
            } else if (url.includes('notion.so')) {
                const embedHTML = generateNotionEmbed(url);
                res.status(200).json({ embedHTML });
            } else {
                res.status(400).json({ message: 'Unsupported platform' });
            }
        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        // Handle other HTTP methods
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Embed generation functions
function generateYouTubeEmbed(url) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
}

function generateVimeoEmbed(url) {
    const videoId = url.split('/').pop();
    return `<iframe src="https://player.vimeo.com/video/${videoId}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;
}

function generateNotionEmbed(url) {
    return `<iframe src="${url}" width="800" height="600" frameborder="0"></iframe>`;
}
