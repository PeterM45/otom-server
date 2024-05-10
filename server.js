// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize dotenv to use environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Initialize the OpenAI API client with your API key
const openai = new OpenAI();
app.use(cors());

// Define __dirname in ES Module scope
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set up static files directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve public/index.html on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Define a POST route for OpenAI API requests
app.post('/api/openai', async (req, res) => {
  console.log('GETTING /api/openai request');

  try {
    const { messages } = req.body; // Extract messages from the incoming request
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    // Send the response back to the frontend
    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error connecting to OpenAI:', error);
    res.status(500).send('Error processing the OpenAI request');
  }
});

// Define the port to listen on
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
