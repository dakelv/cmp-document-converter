# Changelog

All notable changes to the CMP Document Converter will be documented in this file.

## [2.0.0] - 2025-07-30

### Added
- External CSS file for better organization and caching
- External JavaScript configuration file with constants
- Improved file categorization logic
- Media request files now properly separated from problematic files
- TAR archive information in processing results
- Dynamic toggle hints for collapsible sections

### Changed
- Moved from inline styles to external CSS file (`css/cmp-doc-converter.css`)
- Moved configuration and constants to external JS file (`js/cmp-doc-converter-config.js`)
- Updated file categorization to handle media requests separately
- Improved Processing Results section with TAR archive details
- Enhanced user interface with better visual feedback

### Removed
- Inline CSS styles (moved to external file)
- Hardcoded strings (moved to configuration file)
- Folder Organization Instructions section (streamlined interface)

### Fixed
- Media request files no longer appear in "problematic files" section
- Proper identification of `media_graphics_interactive_requests` files
- Improved file organization and structure

## [1.0.0] - 2025-07-29

### Added
- Initial release of CMP Document Converter
- HTML file processing and splitting by H1 sections
- File preview and download functionality
- n8n workflow integration
- Debug logging and error handling
- Responsive design for mobile and desktop

### Features
- Automatic H1 section detection
- Individual file generation
- TAR archive creation
- File categorization (recognized vs problematic)
- Preview functionality for generated files
- Bulk download options