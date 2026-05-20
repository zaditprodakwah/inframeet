(function (window, document) {
  const SELECTOR = '.inframeet-widget';
  const BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost:3000'
    : 'https://inframeet.vercel.app';

  function init() {
    const containers = document.querySelectorAll(SELECTOR);
    containers.forEach((container) => {
      // Avoid duplicate initialization
      if (container.getAttribute('data-inframeet-initialized')) return;
      container.setAttribute('data-inframeet-initialized', 'true');

      const widgetId = container.getAttribute('data-widget-id');
      if (!widgetId) {
        console.warn('INFRAMEET Widget: Missing data-widget-id attribute.');
        return;
      }

      // 1. Create a sandboxed iframe
      const iframe = document.createElement('iframe');
      const queryParams = new URLSearchParams({
        id: widgetId,
        ref: window.location.hostname
      });
      
      iframe.src = `${BASE_URL}/widgets/badge?${queryParams.toString()}`;
      iframe.style.width = '100%';
      iframe.style.height = '120px'; // Initial standard height fallback
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.style.transition = 'height 0.25s ease';
      iframe.scrolling = 'no';
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');

      // Clear container and append iframe
      container.innerHTML = '';
      container.appendChild(iframe);

      // 2. Setup PostMessage Communication for Auto-Resizing & Navigation
      window.addEventListener('message', (event) => {
        // Validate origin
        if (event.origin !== BASE_URL) return;

        const data = event.data;
        if (!data || typeof data !== 'object') return;

        // Check if this message belongs to the current iframe
        if (data.widgetId !== widgetId) return;

        if (data.type === 'resize' && typeof data.height === 'number') {
          iframe.style.height = `${data.height}px`;
        }

        if (data.type === 'open_overlay' && typeof data.url === 'string') {
          // Check if overlay already exists
          let overlay = document.getElementById('inframeet-modal-overlay');
          if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'inframeet-modal-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100vw';
            overlay.style.height = '100vh';
            overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.4)';
            overlay.style.backdropFilter = 'blur(6px)';
            overlay.style.webkitBackdropFilter = 'blur(6px)';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '999999';
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.25s ease';

            const modalContainer = document.createElement('div');
            modalContainer.style.position = 'relative';
            modalContainer.style.width = '90%';
            modalContainer.style.maxWidth = '680px';
            modalContainer.style.height = '80vh';
            modalContainer.style.backgroundColor = '#ffffff';
            modalContainer.style.borderRadius = '24px';
            modalContainer.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            modalContainer.style.overflow = 'hidden';
            modalContainer.style.display = 'flex';
            modalContainer.style.flexDirection = 'column';
            modalContainer.style.transform = 'scale(0.95)';
            modalContainer.style.transition = 'transform 0.25s ease';

            // Close button
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '&times;';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '16px';
            closeButton.style.right = '16px';
            closeButton.style.width = '36px';
            closeButton.style.height = '36px';
            closeButton.style.borderRadius = '50%';
            closeButton.style.border = 'none';
            closeButton.style.backgroundColor = '#f1f5f9';
            closeButton.style.color = '#334155';
            closeButton.style.fontSize = '22px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.display = 'flex';
            closeButton.style.alignItems = 'center';
            closeButton.style.justifyContent = 'center';
            closeButton.style.zIndex = '10';
            closeButton.style.transition = 'background-color 0.2s';
            closeButton.onmouseover = () => { closeButton.style.backgroundColor = '#e2e8f0'; };
            closeButton.onmouseout = () => { closeButton.style.backgroundColor = '#f1f5f9'; };

            closeButton.onclick = () => {
              overlay.style.opacity = '0';
              modalContainer.style.transform = 'scale(0.95)';
              setTimeout(() => { overlay.remove(); }, 250);
            };

            const overlayIframe = document.createElement('iframe');
            overlayIframe.src = data.url;
            overlayIframe.style.width = '100%';
            overlayIframe.style.height = '100%';
            overlayIframe.style.border = 'none';

            modalContainer.appendChild(closeButton);
            modalContainer.appendChild(overlayIframe);
            overlay.appendChild(modalContainer);
            document.body.appendChild(overlay);

            requestAnimationFrame(() => {
              overlay.style.opacity = '1';
              modalContainer.style.transform = 'scale(1)';
            });
          }
        }
      });
    });
  }

  // Support both DOMContentLoaded and immediate load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global controller
  window.INFRAMEET_WIDGET = {
    reinit: init
  };
})(window, document);
