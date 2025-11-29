import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Anthropic API proxy route
  app.post("/api/generate-session", async (req, res) => {
    const startTime = Date.now();

    try {
      const { prompt, maxTokens } = req.body;

      // Logging request details
      console.log('\n=== API Request Started ===');
      console.log(`Timestamp: ${new Date().toISOString()}`);
      console.log(`Prompt length: ${prompt?.length || 0} characters`);
      console.log(`Max tokens: ${maxTokens || 4000}`);

      // Validate request body
      if (!prompt) {
        console.error('❌ Error: No prompt provided');
        return res.status(400).json({
          error: 'Missing prompt in request body',
          userMessage: 'Please provide a coaching challenge to generate a session plan.'
        });
      }

      // Use environment variable for API key
      const apiKey = process.env.ANTHROPIC_API_KEY;

      if (!apiKey) {
        console.error('❌ Error: ANTHROPIC_API_KEY not configured in environment');
        return res.status(500).json({
          error: 'API key not configured',
          userMessage: 'The server is not configured with an Anthropic API key. Please contact your administrator.'
        });
      }

      console.log('✓ API key found in environment');
      console.log('→ Sending request to Anthropic API...');

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: maxTokens || 4000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ Anthropic API Error (${response.status}):`, errorData);
        console.log(`⏱️  Request failed after ${responseTime}ms`);

        // Provide user-friendly error messages based on status code
        let userMessage = 'An error occurred while generating your session plan.';
        if (response.status === 401) {
          userMessage = 'Invalid API key. Please check your Anthropic API configuration.';
        } else if (response.status === 429) {
          userMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (response.status === 500 || response.status === 502 || response.status === 503) {
          userMessage = 'The AI service is temporarily unavailable. Please try again in a few moments.';
        }

        return res.status(response.status).json({
          error: `API request failed: ${response.status}`,
          details: errorData,
          userMessage
        });
      }

      const data = await response.json();
      console.log(`✓ Success! Response received in ${responseTime}ms`);
      console.log(`Response tokens: ${data.usage?.output_tokens || 'unknown'}`);
      console.log('=== API Request Complete ===\n');

      res.json(data);
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      console.error(`❌ Server Error after ${responseTime}ms:`, error);
      console.log('=== API Request Failed ===\n');

      res.status(500).json({
        error: error.message,
        userMessage: 'An unexpected error occurred. Please try again or contact support if the problem persists.'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}