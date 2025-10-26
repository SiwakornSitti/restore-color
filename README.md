# Force Remove CSS Filters — Chrome extension

This is a tiny Chrome extension that forces the CSS rule:

    * { filter: none !important }

How it works
- A content CSS file (`content/styles.css`) is injected at `document_start` into all frames.
- A small content script (`content/script.js`) also injects the same rule into open shadow roots and attempts to inject into same-origin iframes.

Limitations / notes
- Closed shadow roots cannot be modified by content scripts and therefore may still retain filters.
- Cross-origin iframes cannot be modified due to browser security restrictions.

Install (developer mode)
1. Open Chrome and go to chrome://extensions
2. Enable Developer mode (top-right)
3. Click "Load unpacked" and pick this folder: `/Users/ar677101/Desktop/colorful`

To test
1. Open any page that uses CSS filters (for example sites that blur or use filter effects).
2. With the extension enabled, filters should be removed on the page (note limitations above).

If you want an icon, add icon files and reference them in `manifest.json`.
# restore-color
