# EUPL License Server

A dynamic license server that generates custom Equitable Use Public License (EUPL) texts with project-specific information, similar to how the Opinionated Queer License works.

## Features

- **Dynamic License Generation**: Generate licenses with custom project names, copyright holders, years, etc.
- **Multiple Formats**: Support for HTML, Markdown, Plain Text, and JSON formats
- **URL-based Parameters**: Generate licenses via URL parameters
- **Web UI**: User-friendly interface for generating license URLs
- **API Endpoint**: RESTful API for programmatic license generation

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the server:**

   ```bash
   npm start
   ```

3. **Visit the web interface:**
   Open `http://localhost:3000` in your browser

## Usage

### Web Interface

Visit `http://localhost:3000` to use the interactive form for generating license URLs.

### URL Parameters

Generate licenses directly via URL parameters:

```ascii
http://localhost:3000/?name=MyProject&holder=John%20Doe&year=2025&format=html
```

**Available Parameters:**

- `name` - Project name
- `holder` - Copyright holder
- `year` - Year or year range (e.g., "2023-2025")
- `owner` - Owner (defaults to holder if not specified)
- `contact` - Contact email for license questions
- `jurisdiction` - Legal jurisdiction
- `format` - Output format (html, markdown, text, json)

### Supported Formats

- **HTML** (`format=html`): Styled web page with the license
- **Markdown** (`format=markdown` or `format=md`): Markdown formatted text
- **Plain Text** (`format=text` or `format=txt`): Plain text without formatting
- **JSON** (`format=json`): JSON object with license metadata

### API Usage

#### POST /generate

Generate license URLs programmatically:

```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "holder": "John Doe",
    "year": "2025",
    "contact": "john@example.com",
    "format": "html"
  }'
```

Response:

```json
{
  "success": true,
  "url": "http://localhost:3000/?name=My%20Project&holder=John%20Doe&year=2025&contact=john%40example.com&format=html",
  "shortUrl": "/?name=My%20Project&holder=John%20Doe&year=2025&contact=john%40example.com&format=html",
  "formats": {
    "html": "http://localhost:3000/?name=My%20Project&holder=John%20Doe&year=2025&contact=john%40example.com&format=html",
    "markdown": "http://localhost:3000/?name=My%20Project&holder=John%20Doe&year=2025&contact=john%40example.com&format=markdown",
    "text": "http://localhost:3000/?name=My%20Project&holder=John%20Doe&year=2025&contact=john%40example.com&format=text",
    "json": "http://localhost:3000/?name=My%20Project&holder=John%20Doe&year=2025&contact=john%40example.com&format=json"
  }
}
```

## Userscript Usage

For userscripts, add the license to your script header:

```javascript
// ==UserScript==
// @name         My Awesome Userscript
// @namespace    your.namespace
// @version      1.0
// @description  Does something awesome
// @license      EUPL-1.0; https://eupl.itoj.dev/?name=My%20Awesome%20Userscript&holder=Your%20Name&year=2025&format=text
// @match        https://example.com/*
// ==/UserScript==
```

## Deployment

### Local Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Or start production server
npm start
```

### Production Deployment

#### Option 1: Traditional VPS/Server

1. Clone the repository on your server
2. Install Node.js and npm
3. Run `npm install --production`
4. Use PM2 or similar process manager:

   ```bash
   npm install -g pm2
   pm2 start server.js --name eupl-server
   ```

#### Option 2: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t eupl-server .
docker run -p 3000:3000 eupl-server
```

#### Option 3: Platform-as-a-Service

The server works on platforms like:

- Heroku
- Railway
- Render
- DigitalOcean App Platform
- Vercel (with minor modifications)

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Customization

### Adding New License Templates

To add support for multiple license types, modify the `LICENSE_TEMPLATE` constant or create a templates directory:

```javascript
const LICENSE_TEMPLATES = {
  'eupl': eupl_template,
  'another-license': another_template
};
```

### Custom Formats

Add new output formats by extending the `formatLicense` function:

```javascript
case 'xml':
    return {
        content: `<?xml version="1.0"?>\n<license>\n${xmlEscape(licenseText)}\n</license>`,
        contentType: 'application/xml'
    };
```

### Styling

The HTML format uses embedded CSS. You can customize the styling by modifying the CSS in the `formatLicense` function or by serving external stylesheets.

## API Reference

### GET /

**Description**: Main endpoint for license generation and web UI

**Parameters**: All parameters are optional

- `name` (string): Project name
- `holder` (string): Copyright holder
- `year` (string): Year or year range
- `owner` (string): Owner name
- `contact` (string): Contact information
- `jurisdiction` (string): Legal jurisdiction
- `format` (string): Output format (html, markdown, text, json)

**Response**: License text in requested format

### POST /generate

**Description**: Generate license URLs programmatically

**Body**: JSON object with license parameters

**Response**: JSON object with generated URLs

### GET /health

**Description**: Health check endpoint

**Response**:

```json
{
  "status": "healthy",
  "timestamp": "2025-07-10T12:00:00.000Z"
}
```

## License Restrictions

The EUPL license generated by this server includes the following restrictions:

1. **Pay Ratio Limit**: Organizations with >50:1 ratio between highest/lowest paid employees cannot use the software
2. **Company Size Limit**: Companies with >1,000 employees (including contractors) are prohibited
3. **Military Restriction**: Military organizations and defense contractors cannot use the software
4. **Strong Copyleft**: Any network use or service provision counts as distribution requiring source code availability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For questions about the license server itself, open an issue on the repository.

For questions about the EUPL license terms, contact the license author.

## License

This license server is itself licensed under the EUPL-1.0 license.
