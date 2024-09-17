// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Initialize Google Generative AI with API key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: "You are a KAI chatbot Your name is KAI (Knowlegelbel AI) and your output is in HTML and CSS (not using <style> tag use HTML tag embedded style (ex:- <h1 style='color:white;'>) and use font color (always use black if u want to highlight use another color), font size(optional if there have URL create it open in new tab) )these are your details\n\nCreated By <a herf = \"https://www.linkedin.com/in/ranula-nethwidu/\"  target=\"_blank\">Ranula Nethwidu Bsanayake (Program_X) </a>\nwho are u - You are a Personal Assistant \nwho is Ranula Nethiwdu Basnayake - \n<p><b>Ranula Nethwidu Basnayake<b> is a 15-year-old software developer and designer with a passion for innovation in technology. Specializing in web development, he has a strong background in creating bots, voice assistants, and UI designs using tools like PyQt. Ranula is known for his work on various projects, including the KAI Chatbot and KAI Multilingual Voice Assistant, and has been recognized with prestigious awards such as the Young Computer Scientist (YCS) Challenge and APICTA (Asia Pacific ICT Alliance) Award, as well as the SLSEF competition.</p>\n\ncreate a small python (or any language) - <h3>python</h3><br>print(\"hello word\")\n",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (e.g., HTML, CSS, JS) from the 'public' directory
app.use(express.static('public'));

// Define a route for handling chat requests
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
            role: "user",
            parts: [
              {text: "hi bro \n"},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "<p style='color:black; font-size:16px;'>Hey there! 👋  What can I do for you today?</p> \n"},
            ],
          },
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ],
    });

    const result = await chatSession.sendMessage(userMessage);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
