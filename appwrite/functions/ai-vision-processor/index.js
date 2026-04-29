const { Client, Databases, Query } = require('node-appwrite');
const { GoogleGenAI } = require('@google/genai');

module.exports = async ({ req, res, log, error }) => {
  try {
    const payload = JSON.parse(req.body || '{}');
    const incident = payload.$id ? payload : (payload.document || payload);

    if (!incident || !incident.$id) {
      log('No valid document in payload. Skipping.');
      return res.empty();
    }

    // Only process if it has media and hasn't been processed by AI yet
    if (!incident.mediaUrls || incident.mediaUrls.length === 0) {
      log('No media URLs found. Skipping AI analysis.');
      return res.empty();
    }

    if (incident.internalNotes && incident.internalNotes.includes('[AI VISION ANALYSIS]')) {
      log('Already processed by AI. Skipping.');
      return res.empty();
    }

    const imageUrl = incident.mediaUrls[0];
    log(`Downloading image from: ${imageUrl}`);
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    
    const arrayBuffer = await imageResponse.arrayBuffer();
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    log('Initializing Gemini API...');
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) throw new Error('GEMINI_API_KEY is not set');

    const ai = new GoogleGenAI({ apiKey: geminiKey });
    
    log('Calling Gemini 1.5 Flash...');
    const prompt = `Analyze this image (likely related to RSS activity).
    Extract the following details if present:
    1. Names of individuals (specifically looking for key Karyakarta profiles or leaders).
    2. Names of organizations, branches, or shakhas mentioned.
    3. Type of activity (e.g. meeting, rally, surveillance, propaganda).
    4. Provide a brief summary of what is happening.
    
    Respond STRICTLY in JSON format with this structure:
    {
      "names": ["string"],
      "organizations": ["string"],
      "activity": "string",
      "summary": "string"
    }`;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const resultText = aiResponse.text();
    log(`Gemini response: ${resultText}`);
    
    const aiData = JSON.parse(resultText);

    // Initialize Appwrite to search DB
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const dbId = process.env.DATABASE_ID;
    const profilesColId = process.env.COLLECTION_PROFILES;
    const incidentsColId = process.env.COLLECTION_INCIDENTS;

    let matchedProfiles = [];
    
    // Cross-reference names with Profiles DB
    if (aiData.names && aiData.names.length > 0) {
      log(`Checking database for names: ${aiData.names.join(', ')}`);
      for (const name of aiData.names) {
        try {
          const searchRes = await databases.listDocuments(dbId, profilesColId, [
            Query.search('fullName', name),
            Query.limit(3)
          ]);
          
          if (searchRes.documents.length > 0) {
            matchedProfiles.push(...searchRes.documents.map(d => `${d.fullName} (ID: ${d.$id})`));
          }
        } catch (e) {
          log(`Warning: Failed to search for name ${name} - ${e.message}`);
        }
      }
    }

    // Construct internal note
    let internalNotes = incident.internalNotes ? `${incident.internalNotes}\n\n` : '';
    internalNotes += `[AI VISION ANALYSIS]\n`;
    internalNotes += `Summary: ${aiData.summary}\n`;
    internalNotes += `Detected Activity: ${aiData.activity}\n`;
    internalNotes += `Detected Names: ${aiData.names.join(', ') || 'None'}\n`;
    internalNotes += `Detected Orgs: ${aiData.organizations.join(', ') || 'None'}\n`;
    
    if (matchedProfiles.length > 0) {
      internalNotes += `\n⚠️ DATABASE MATCHES FOUND:\n- ${matchedProfiles.join('\n- ')}\n`;
    } else {
      internalNotes += `\nNo existing profile matches found in the database.\n`;
    }

    log('Updating incident with AI notes...');
    await databases.updateDocument(dbId, incidentsColId, incident.$id, {
      internalNotes: internalNotes
    });

    log('AI processing complete.');
    return res.json({ success: true, aiNotesAppended: true });

  } catch (err) {
    error(`Function error: ${err.message || err}`);
    return res.json({ success: false, error: err.message || 'Unknown error' });
  }
};
