// Append the external stylesheet (content/styles.css) to the top-level document
// and also attempt to append it into open shadow roots (best-effort). Observe
// the DOM to handle newly-created shadow roots as well.
(function () {
  // URL to the packaged stylesheet
  const href = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL)
    ? chrome.runtime.getURL('content/styles.css')
    : 'content/styles.css';

  const createLink = () => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.setAttribute('data-injected-by', 'force-remove-filters');
    return l;
  };

  const safeAppend = (parent, node) => {
    try {
      parent.appendChild(node);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Append to the top-level document (use a fresh link)
  safeAppend(document.head || document.documentElement || document, createLink());

  // Prototype link to clone for insertion into shadow roots
  const proto = createLink();

  const appendToExistingShadowRoots = root => {
    try {
      root.querySelectorAll && root.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) safeAppend(el.shadowRoot, proto.cloneNode());
      });
    } catch (_) {}
  };

  // Append to any already-open shadow roots
  appendToExistingShadowRoots(document);

  // Observe for newly added nodes and append to any open shadow roots
  try {
    const mo = new MutationObserver(records => {
      for (const r of records) {
        for (const node of r.addedNodes) {
          if (!node || node.nodeType !== 1) continue;
          try {
            if (node.shadowRoot) safeAppend(node.shadowRoot, proto.cloneNode());
            node.querySelectorAll && node.querySelectorAll('*').forEach(desc => {
              if (desc.shadowRoot) safeAppend(desc.shadowRoot, proto.cloneNode());
            });
          } catch (_) {}
        }
      }
    });

    mo.observe(document, { childList: true, subtree: true });
    // clean up on pagehide
    window.addEventListener('pagehide', () => mo.disconnect(), { once: true });
  } catch (_) {}

})();

