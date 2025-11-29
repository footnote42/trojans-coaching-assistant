import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GenerateSessionRequest {
  prompt: string;
  maxTokens?: number;
}

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Validate API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      res.status(500).json({
        error: 'API key not configured. Please set ANTHROPIC_API_KEY environment variable.'
      });
      return;
    }

    // Validate request body
    const { prompt, maxTokens }: GenerateSessionRequest = req.body;

    if (!prompt) {
      res.status(400).json({
        error: 'Missing required field: prompt'
      });
      return;
    }

    if (typeof prompt !== 'string') {
      res.status(400).json({
        error: 'Invalid field type: prompt must be a string'
      });
      return;
    }

    if (prompt.length === 0) {
      res.status(400).json({
        error: 'Invalid field: prompt cannot be empty'
      });
      return;
    }

    if (prompt.length > 50000) {
      res.status(400).json({
        error: 'Prompt too large: maximum 50,000 characters'
      });
      return;
    }

    if (maxTokens !== undefined && (typeof maxTokens !== 'number' || maxTokens < 1 || maxTokens > 8192)) {
      res.status(400).json({
        error: 'Invalid maxTokens: must be a number between 1 and 8192'
      });
      return;
    }

    // Prepare Anthropic API request
    const anthropicRequest = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens || 4096,
      messages: [
        {
          role: 'user' as const,
          content: prompt,
        },
      ],
    };

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(anthropicRequest),
    });

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'API request failed';

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch {
        // If parsing fails, use the raw text
        errorMessage = errorText.substring(0, 200);
      }

      console.error('Anthropic API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage,
      });

      res.status(response.status).json({
        error: `Anthropic API request failed: ${response.status}`,
        details: errorMessage,
      });
      return;
    }

    // Parse and return successful response
    const data: AnthropicResponse = await response.json();

    res.status(200).json(data);
  } catch (error: unknown) {
    console.error('Unexpected error in generate-session endpoint:', error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    res.status(500).json({
      error: 'Internal server error',
      details: errorMessage,
    });
  }
}
