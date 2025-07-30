# CMP Document Converter

A web-based tool for converting CMP-ready Word documents into individual HTML files optimized for Brightspace upload.

## 🎯 Purpose

This tool processes HTML files (converted from Word documents using Pandoc) and splits them into separate HTML files based on H1 sections. Each section becomes an individual file ready for upload to Brightspace.

## 🚀 Quick Start

1. **Convert your Word document to HTML** using Pandoc:
   ```bash
   pandoc input.docx -s -o output.html --extract-media=. --ascii
   ```

2. **Open `cmp-doc-converter.html`** in your web browser

3. **Upload the HTML file** and let the tool process it

4. **Download the generated files** as individual HTML files or as a TAR archive

## 📁 Project Structure

```
cmp-document-converter/
├── cmp-doc-converter.html          # Main application
├── css/
│   └── cmp-doc-converter.css       # Stylesheet
├── js/
│   └── cmp-doc-converter-config.js # Configuration & constants
└── docs/
    └── cmp-document-converter-instructions.html # Detailed instructions
```

## ✨ Features

- **Automatic H1 section detection** - Splits documents by Header 1 sections
- **File categorization** - Separates regular content from media requests
- **Individual file preview** - Preview each generated HTML file
- **Bulk download** - Download all files as TAR archive
- **Error detection** - Identifies problematic headers for easy fixing
- **Brightspace optimization** - Generated files are ready for LMS upload

## 🔧 Technical Details

- **Frontend only** - No server required, runs entirely in browser
- **n8n integration** - Processes files through n8n workflow
- **Modern web standards** - Uses ES6+ JavaScript and CSS Grid/Flexbox
- **Responsive design** - Works on desktop and mobile devices

## 📋 File Categories

The tool automatically categorizes generated files:

1. **Regular Files** - Standard learning outcomes, steps, and activities
2. **Media Requests** - Files containing media/graphics/interactive requests
3. **Problematic Files** - Files with header issues that need attention

## 🛠️ Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- n8n workflow endpoint (configured in the tool)

### Local Development
1. Clone this repository
2. Open `cmp-doc-converter.html` in your browser
3. Ensure CSS and JS files are in their respective folders

## 📖 Documentation

For detailed usage instructions, see [docs/cmp-document-converter-instructions.html](docs/cmp-document-converter-instructions.html)

## 🔄 Version History

- **Latest** - Optimized file structure, improved categorization, external CSS/JS
- **Previous versions** - Available in project archives

## 🤝 Contributing

This is an internal tool for Saskatchewan Polytechnic. For questions or improvements, contact the Learning Technologies team.

## 📄 License

Internal use only - Saskatchewan Polytechnic Learning Technologies
