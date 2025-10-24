import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Anthropic API proxy route
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, maxTokens } = req.body;

      // Use environment variable for API key
      const apiKey = process.env.ANTHROPIC_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
      }

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

      if (!response.ok) {
        const errorData = await response.text();
        return res.status(response.status).json({ 
          error: `API request failed: ${response.status}`,
          details: errorData 
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}