require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Airtable = require('airtable');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// API Key authentication middleware
const apiKeyAuth = (req, res, next) => {
  const requiredApiKey = process.env.APP_API_KEY;
  
  if (!requiredApiKey) {
    return next(); // Skip auth if no API key set
  }
  
  const providedApiKey = req.query.apiKey || req.headers['x-api-key'];
  
  if (!providedApiKey || providedApiKey !== requiredApiKey) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  
  next();
};

// Apply auth to all routes except health check
app.use((req, res, next) => {
  if (req.path === '/health') {
    return next();
  }
  apiKeyAuth(req, res, next);
});

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Airtable configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

let base = null;

if (!AIRTABLE_API_KEY) {
  console.error('AIRTABLE_API_KEY environment variable is required');
  process.exit(1);
}

if (!AIRTABLE_BASE_ID) {
  console.error('AIRTABLE_BASE_ID environment variable is required');
  process.exit(1);
}

base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get variants data
app.get('/api/variants', async (req, res) => {
  try {
    const { styleNumbers } = req.query;
    
    if (!styleNumbers) {
      return res.status(400).json({ error: 'styleNumbers parameter is required' });
    }
    
    // Parse style numbers (can be comma-separated)
    const styleNumbersArray = styleNumbers.split(',').map(s => s.trim());
    
    // Build filter formula for Airtable
    const filterFormulas = styleNumbersArray.map(styleNumber => 
      `{STYLE NUMBER} = '${styleNumber.replace(/'/g, "\\'")}'`
    );
    const filterFormula = styleNumbersArray.length === 1 
      ? filterFormulas[0] 
      : `OR(${filterFormulas.join(', ')})`;
    
    const records = [];
    
    await base('VARIANTS').select({
      filterByFormula: filterFormula,
      fields: ['VARIANT TITLE', 'WEIGHT', 'HS CODE', 'STYLE NUMBER']
    }).eachPage((pageRecords, fetchNextPage) => {
      records.push(...pageRecords.map(record => ({
        id: record.id,
        variantTitle: record.get('VARIANT TITLE') || '',
        weight: record.get('WEIGHT') || '',
        hsCode: record.get('HS CODE') || '',
        styleNumber: record.get('STYLE NUMBER') || ''
      })));
      fetchNextPage();
    });
    
    res.json(records);
  } catch (error) {
    console.error('Error fetching variants:', error);
    res.status(500).json({ error: 'Failed to fetch variants data' });
  }
});

// API endpoint to update a variant record
app.put('/api/variants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { weight, hsCode } = req.body;
    
    const updateFields = {};
    if (weight !== undefined) updateFields['WEIGHT'] = weight;
    if (hsCode !== undefined) updateFields['HS CODE'] = hsCode;
    
    const updatedRecord = await base('VARIANTS').update(id, updateFields);
    
    res.json({
      id: updatedRecord.id,
      variantTitle: updatedRecord.get('VARIANT TITLE') || '',
      weight: updatedRecord.get('WEIGHT') || '',
      hsCode: updatedRecord.get('HS CODE') || '',
      styleNumber: updatedRecord.get('STYLE NUMBER') || ''
    });
  } catch (error) {
    console.error('Error updating variant:', error);
    res.status(500).json({ error: 'Failed to update variant' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 