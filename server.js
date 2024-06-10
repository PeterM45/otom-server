// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Initialize dotenv to use environment variables
dotenv.config();

const app = express();

app.use(express.json());

// Initialize the OpenAI API client with your API key
const openai = new OpenAI();
app.use(cors());
// Define a POST route for OpenAI API requests
app.post('/api/openai', async (req, res) => {
  console.log('GETTING /api/openai request');

  try {
    const { messages } = req.body; // Extract messages from the incoming request

    // Format messages for the OpenAI API
    const formattedMessages = messages.map((message) => {
      const formattedContent = [{ type: 'text', text: message.content }];

      if (message.image) {
        formattedContent.push({
          type: 'image_url',
          image_url: { url: message.image },
        });
      }

      return {
        role: message.role, // Assuming message has a role field
        content: formattedContent,
      };
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: formattedMessages,
    });

    // Send the response back to the frontend
    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error connecting to OpenAI:', error);
    res.status(500).send('Error processing the OpenAI request');
  }
  // end('Error processing the OpenAI request');
});

app.post('/api/prompt-builder', async (req, res) => {
  console.log('GETTING /api/prompt-builder request');

  try {
    const { prompt } = req.body; // Extract prompt from the incoming request
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `${prompt} can you write a prompt for me to ask otomAI with this text?`,
        },
      ],
    });

    // Send the response back to the frontend
    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error connecting to OpenAI:', error);
    res.status(500).send('Error processing the OpenAI request');
  }
});

// Define the port to listen on
const PORT = 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
