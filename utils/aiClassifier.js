const Logger = require('./logger');

const logger = new Logger('AIClassifier');

// AI-powered dream classifier that supports multiple backends
// Priority order: OpenAI API -> Hugging Face API -> Heuristic fallback
// This ensures we can classify dreams even if APIs are unavailable
class AIClassifier {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.hfApiUrl =
      'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
    this.hfToken = process.env.HF_API_TOKEN || '';
    this.maxRetries = 1;
    this.retryDelay = 1500; // milliseconds
    this.apiUnavailable = false;
  }

  // Classify a dream as "Good" or "Bad" using the best available method
  async classifyDream(dreamName) {
    if (this.apiUnavailable) {
      return this._classifyWithHeuristic(dreamName);
    }

    // Try OpenAI first if we have an API key
    if (this.openaiApiKey) {
      try {
        return await this._classifyWithOpenAI(dreamName);
      } catch (error) {
        logger.warn(
          `OpenAI classification failed for "${dreamName}": ${error.message}`
        );
        this.apiUnavailable = true;
        logger.info('Falling back to heuristic classifier');
        return this._classifyWithHeuristic(dreamName);
      }
    }

    // Try Hugging Face API next
    try {
      return await this._classifyWithHF(dreamName);
    } catch (error) {
      logger.warn(
        `HF API classification failed for "${dreamName}": ${error.message}`
      );
      this.apiUnavailable = true;
      logger.info(
        'Marking API as unavailable for remaining queries, falling back to heuristic classifier'
      );
      return this._classifyWithHeuristic(dreamName);
    }
  }

  // Use the OpenAI Chat Completion API to classify the dream
  async _classifyWithOpenAI(dreamName) {
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI dream classifier. Respond with strictly either "Good" or "Bad" and nothing else.',
        },
        {
          role: 'user',
          content: `Classify the sentiment and nature of this dream: "${dreamName}"`,
        },
      ],
      temperature: 0,
      max_tokens: 5,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content?.trim() || '';
    const classification = reply.toLowerCase().includes('good') ? 'Good' : 'Bad';

    logger.info(
      `OpenAI classified "${dreamName}" as "${classification}"`
    );

    return {
      classification,
      confidence: 0.95,
      method: 'openai-gpt',
    };
  }

  // Use Hugging Face zero-shot classification to classify the dream
  async _classifyWithHF(dreamName) {
    const payload = {
      inputs: dreamName,
      parameters: {
        candidate_labels: ['good dream', 'bad dream'],
      },
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.hfToken) {
      headers['Authorization'] = `Bearer ${this.hfToken}`;
    }

    let lastError;

    // Retry up to maxRetries times if the model is loading
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(this.hfApiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(4000),
        });

        // Model might be loading, so retry with a delay
        if (response.status === 503) {
          logger.info(
            `Model is loading, retrying in ${this.retryDelay / 1000}s... (attempt ${attempt + 1})`
          );
          await this._sleep(this.retryDelay);
          continue;
        }

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();
        const topLabel = data.labels[0];
        const topScore = data.scores[0];
        const classification = topLabel.includes('good') ? 'Good' : 'Bad';

        logger.info(
          `AI classified "${dreamName}" as "${classification}" (confidence: ${(topScore * 100).toFixed(1)}%)`
        );

        return {
          classification,
          confidence: topScore,
          method: 'huggingface-api',
        };
      } catch (error) {
        lastError = error;
        if (attempt < this.maxRetries) {
          await this._sleep(this.retryDelay);
        }
      }
    }

    throw lastError;
  }

  // Fallback method: Use keyword matching to classify the dream
  // This works offline and instantly if all APIs are unavailable
  _classifyWithHeuristic(dreamName) {
    const lowerName = dreamName.toLowerCase();

    // Keywords that indicate a negative/bad dream
    const badKeywords = [
      'lost',
      'chase',
      'monster',
      'late',
      'fall',
      'fail',
      'dark',
      'scary',
      'nightmare',
      'death',
      'trapped',
      'drown',
      'attack',
      'fear',
      'maze',
      'exam',
      'panic',
      'scream',
    ];

    // Keywords that indicate a positive/good dream
    const goodKeywords = [
      'flying',
      'win',
      'swim',
      'dolphin',
      'mountain',
      'adventure',
      'travel',
      'lottery',
      'sunshine',
      'happy',
      'love',
      'ocean',
      'magic',
      'garden',
      'freedom',
      'star',
      'music',
      'dance',
    ];

    let badScore = 0;
    let goodScore = 0;

    // Count how many negative keywords appear in the dream name
    badKeywords.forEach((keyword) => {
      if (lowerName.includes(keyword)) badScore++;
    });

    // Count how many positive keywords appear in the dream name
    goodKeywords.forEach((keyword) => {
      if (lowerName.includes(keyword)) goodScore++;
    });

    // Classify based on which score is higher
    const classification = badScore > goodScore ? 'Bad' : 'Good';
    const totalMatches = badScore + goodScore;
    const confidence =
      totalMatches > 0
        ? Math.max(badScore, goodScore) / totalMatches
        : 0.5;

    logger.info(
      `Heuristic classified "${dreamName}" as "${classification}" (confidence: ${(confidence * 100).toFixed(1)}%, good: ${goodScore}, bad: ${badScore})`
    );

    return {
      classification,
      confidence,
      method: 'heuristic-fallback',
    };
  }

  // Simple sleep/delay utility for retry logic
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = AIClassifier;
