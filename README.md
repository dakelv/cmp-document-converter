# CMP Document Converter

A web-based tool with Azure AD SSO authentication for converting CMP-ready Word documents into individual HTML files optimized for Brightspace upload.

## 🎯 Purpose

This tool processes HTML files (converted from Word documents using Pandoc) and splits them into separate HTML files based on H1 sections. Each section becomes an individual file ready for upload to Brightspace.

## 🚀 Quick Start

1. **Access the application** at: `https://ltxr.saskpolytech.ca/apps/cmp/cmp-doc-converter.html`

2. **Sign in** with your Saskatchewan Polytechnic Microsoft account

3. **Convert your Word document to HTML** using Pandoc:
   ```bash
   pandoc input.docx -s -o output.html --extract-media=. --ascii
   ```

4. **Upload the HTML file** and let the tool process it

5. **Download the generated files** as individual HTML files or as a TAR archive

## 📁 Project Structure

```
cmp-document-converter/
├── cmp-doc-converter.html          # Main application
├── css/
│   └── cmp-doc-converter.css       # Stylesheet
├── js/
│   ├── cmp-doc-converter-config.js # Configuration & constants
│   ├── cmp-doc-converter-main.js   # Main application logic
│   ├── sso-auth.js                 # Azure AD SSO authentication
│   └── sso-config.js               # SSO configuration
├── api/
│   └── sso-token-exchange.aspx     # Server-side token exchange (optional)
├── docs/
│   └── cmp-document-converter-instructions.html # Detailed instructions
├── SSO-SETUP-GUIDE.md              # Azure AD setup documentation
└── README.md                       # This file
```

## ✨ Features

### 🔐 Authentication & Security
- **Azure AD SSO** - Single Sign-On with Saskatchewan Polytechnic accounts
- **Domain validation** - Restricted to saskpolytech.ca email addresses
- **Persistent sessions** - Stay logged in across browser sessions
- **Professional UI** - Clean login/logout interface with user info

### 📄 Document Processing
- **Automatic H1 section detection** - Splits documents by Header 1 sections
- **File categorization** - Separates regular content from media requests
- **Individual file preview** - Preview each generated HTML file
- **Bulk download** - Download all files as TAR archive
- **Error detection** - Identifies problematic headers for easy fixing
- **Brightspace optimization** - Generated files are ready for LMS upload

## 🔧 Technical Details

### 🏗️ Architecture
- **Frontend-focused** - Runs primarily in browser with minimal server dependencies
- **Azure AD integration** - Enterprise-grade authentication via Microsoft
- **n8n workflow** - Document processing through automated workflow
- **Modern web standards** - ES6+ JavaScript, CSS Grid/Flexbox, HTML5

### 🔐 Authentication Flow
- **Implicit flow** - Secure token-based authentication
- **Nonce validation** - Enhanced security for token requests
- **Session management** - Automatic token refresh and cleanup
- **Error handling** - Comprehensive fallbacks and user feedback

## 📋 File Categories

The tool automatically categorizes generated files:

1. **Regular Files** - Standard learning outcomes, steps, and activities
2. **Media Requests** - Files containing media/graphics/interactive requests
3. **Problematic Files** - Files with header issues that need attention

## 🛠️ Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Azure AD app registration (for SSO)
- n8n workflow endpoint (configured in the tool)

### Local Development
1. Clone this repository
2. Configure Azure AD settings in `js/sso-config.js`
3. Open `cmp-doc-converter.html` in your browser
4. Ensure all CSS and JS files are in their respective folders

### Azure AD Setup
For detailed SSO configuration instructions, see [SSO-SETUP-GUIDE.md](SSO-SETUP-GUIDE.md)

## 📖 Documentation

For detailed usage instructions, see [docs/cmp-document-converter-instructions.html](docs/cmp-document-converter-instructions.html)

## 🔄 Version History

- **v2.5.0** (August 8, 2025) - Azure AD SSO authentication, enterprise security, production deployment
- **v2.4.3** - Optimized file structure, improved categorization, external CSS/JS
- **Previous versions** - Available in project archives and GitHub releases

## 🤝 Contributing

This is an internal tool for Saskatchewan Polytechnic. For questions or improvements, contact the Learning Technologies team.

## 📄 License

Internal use only - Saskatchewan Polytechnic Learning Technologies
