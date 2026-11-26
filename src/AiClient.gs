/**
 * AiClient.gs
 * Bring-your-own-key client for OpenAI and Google Gemini.
 *
 * Your API key is read from the Settings tab of YOUR copy of the sheet and is
 * sent only to the provider you pick (api.openai.com or
 * generativelanguage.googleapis.com). Nothing is sent to Cypress Forge.
 *
 * @OnlyCurrentDoc
 */

var AI_MODELS = {
  OpenAI: 'gpt-4o-mini',
  Gemini: 'gemini-2.5-flash'
};

var AI_MAX_RETRIES = 3;

/**
 * Sends one prompt to the selected provider and returns the parsed JSON reply.
 *
 * @param {string} provider     "OpenAI" or "Gemini".
 * @param {string} apiKey       The user's own API key.
 * @param {string} systemPrompt Instructions for the model.
 * @param {string} userPrompt   The data to work on.
 * @return {Object} Parsed JSON object returned by the model.
 */
function callAiJson_(provider, apiKey, systemPrompt, userPrompt) {
  var request = provider === 'Gemini'
    ? buildGeminiRequest_(apiKey, systemPrompt, userPrompt)
    : buildOpenAiRequest_(apiKey, systemPrompt, userPrompt);

  var lastError = '';
  for (var attempt = 0; attempt <= AI_MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      // Exponential backoff with a little jitter: ~2s, 4s, 8s.
      Utilities.sleep(Math.pow(2, attempt) * 1000 + Math.floor(Math.random() * 500));
    }
    var response = UrlFetchApp.fetch(request.url, request.options);
    var code = response.getResponseCode();
    var body = response.getContentText();

    if (code === 200) {
      var text = provider === 'Gemini' ? extractGeminiText_(body) : extractOpenAiText_(body);
      return parseModelJson_(text);
    }

    lastError = describeHttpError_(provider, code, body);
    // Retry only rate limits and temporary server errors.
    if (code !== 429 && code < 500) break;
  }
  throw new Error(lastError);
}

function buildOpenAiRequest_(apiKey, systemPrompt, userPrompt) {
  return {
    url: 'https://api.openai.com/v1/chat/completions',
    options: {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + apiKey },
      muteHttpExceptions: true,
      payload: JSON.stringify({
        model: AI_MODELS.OpenAI,
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    }
  };
}

function buildGeminiRequest_(apiKey, systemPrompt, userPrompt) {
  return {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/' +
      AI_MODELS.Gemini + ':generateContent',
    options: {
      method: 'post',
      contentType: 'application/json',
      // The key goes in a header, not the URL, so it never shows up in logs.
      headers: { 'x-goog-api-key': apiKey },
      muteHttpExceptions: true,
      payload: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          // Classification does not need "thinking" tokens; turning them off
          // keeps Gemini 2.5 Flash fast and cheap.
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    }
  };
}

function extractOpenAiText_(body) {
  var data = JSON.parse(body);
  if (!data.choices || !data.choices.length) {
    throw new Error('OpenAI returned no answer. Try again in a minute.');
  }
  return data.choices[0].message.content || '';
}

function extractGeminiText_(body) {
  var data = JSON.parse(body);
  var candidate = data.candidates && data.candidates[0];
  if (!candidate || !candidate.content || !candidate.content.parts) {
    var reason = (data.promptFeedback && data.promptFeedback.blockReason) ||
      (candidate && candidate.finishReason) || 'unknown';
    throw new Error('Gemini returned no answer (reason: ' + reason + ').');
  }
  return candidate.content.parts.map(function (p) { return p.text || ''; }).join('');
}

/**
 * Parses JSON from a model reply, tolerating ```json fences or stray text.
 */
function parseModelJson_(text) {
  var cleaned = String(text || '').trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    var start = cleaned.indexOf('{');
    var end = cleaned.lastIndexOf('}');
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error('The AI reply was not valid JSON. Run the menu again; ' +
      'rows that already have results are skipped.');
  }
}

function describeHttpError_(provider, code, body) {
  var detail = '';
  try {
    var data = JSON.parse(body);
    detail = (data.error && (data.error.message || data.error.status)) || '';
  } catch (e) {
    detail = String(body || '').slice(0, 200);
  }
  if (code === 401 || code === 403) {
    return provider + ' rejected the API key (HTTP ' + code + '). Check Settings!B2 ' +
      'and that the key belongs to ' + provider + '. ' + detail;
  }
  if (code === 429) {
    return provider + ' rate limit or quota reached (HTTP 429). Wait a minute, ' +
      'or check billing on your ' + provider + ' account. ' + detail;
  }
  return provider + ' error (HTTP ' + code + '): ' + detail;
}
