# Airtable Variants Editor

An inline Handsontable editor that integrates with Airtable to edit VARIANTS data. Perfect for embedding in Softr pages.

## Features

- 📊 **Handsontable Integration**: Professional spreadsheet interface
- 🔄 **Real-time Airtable Sync**: Changes are saved instantly to Airtable
- 🎯 **Dynamic Filtering**: Filter variants by style numbers
- 📱 **Embed-Friendly**: Optimized for iframe embedding
- ⚡ **Fast & Responsive**: Built with modern web technologies

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
PORT=3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to test the application.

## Deployment to Render

1. **Connect Repository**: Connect your GitHub repository to Render
2. **Create Web Service**: Choose "Web Service" and select your repository
3. **Configure Settings**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Add your environment variables
4. **Deploy**: Click deploy and wait for the build to complete

### Environment Variables for Render

Add these environment variables in your Render dashboard:

- `AIRTABLE_API_KEY`: Your Airtable API key
- `AIRTABLE_BASE_ID`: Your Airtable base ID (starts with "app")

## Usage

### Basic Usage

1. Open the application
2. Enter style numbers (comma-separated for multiple)
3. Click "Load Data"
4. Edit WEIGHT and HS CODE fields directly in the grid
5. Changes are automatically saved to Airtable

### Embedding in Softr

Use this URL format for dynamic embedding:

```
https://your-render-app.onrender.com/?embed=true&styleNumbers={STYLE_NUMBERS_FIELD}
```

Replace `{STYLE_NUMBERS_FIELD}` with the actual field reference from your Softr linked records.

### Softr Dynamic Formula Example

In Softr, use this formula for the embed URL:

```
"https://your-render-app.onrender.com/?embed=true&styleNumbers=" + {Linked Record Field}
```

## API Endpoints

- `GET /api/variants?styleNumbers=ABC123,DEF456` - Fetch variants by style numbers
- `PUT /api/variants/:id` - Update a specific variant record
- `GET /health` - Health check endpoint

## Data Structure

The application expects these fields in your Airtable VARIANTS table:

- **VARIANT TITLE** (read-only in grid)
- **WEIGHT** (editable, numeric)
- **HS CODE** (editable, text)
- **STYLE NUMBER** (used for filtering)

## Troubleshooting

### Common Issues

1. **"AIRTABLE_BASE_ID environment variable is required"**
   - Make sure you've set the `AIRTABLE_BASE_ID` environment variable

2. **"No variants found"**
   - Check that your style numbers match exactly with the data in Airtable
   - Ensure the VARIANTS table exists with the correct field names

3. **Changes not saving**
   - Verify your Airtable API key has write permissions
   - Check the browser console for error messages

### Finding Your Airtable Base ID

1. Go to [Airtable API documentation](https://airtable.com/api)
2. Select your base
3. The base ID starts with "app" and can be found in the URL or documentation

## License

This project is for evaluation and non-commercial use with Handsontable's free license.
 