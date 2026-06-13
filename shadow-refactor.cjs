const fs = require('fs');

let content = fs.readFileSync('src/content/index.js', 'utf8');

// 1. Add imports and Shadow DOM init at the top
content = content.replace(
  `  import { \n    iGear`,
  `  import styles from '../sidebar.css?inline';\n  import { \n    iGear`
);

const initCode = `
  const shadowHost = document.createElement('div');
  shadowHost.id = 'ss-extension-host';
  document.body.appendChild(shadowHost);
  const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  shadowRoot.appendChild(styleEl);

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
  shadowRoot.appendChild(fontLink);
`;

content = content.replace(
  `  // Inject Google Fonts\n  const fontLink = document.createElement('link');\n  fontLink.rel = 'stylesheet';\n  fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';\n  document.head.appendChild(fontLink);`,
  initCode
);

// 2. Replace specific document methods
content = content.replace(/document\.getElementById/g, 'shadowRoot.getElementById');
content = content.replace(/document\.querySelectorAll\('\.ss-/g, "shadowRoot.querySelectorAll('.ss-");

// 3. Fix document.body.appendChild for sidebar and toasts
content = content.replace(/document\.body\.appendChild\(s\)/g, 'shadowRoot.appendChild(s)');
content = content.replace(/document\.body\.appendChild\(container\)/g, 'shadowRoot.appendChild(container)');
content = content.replace(/document\.body\.appendChild\(ta\)/g, 'document.body.appendChild(ta)'); // keep ta for clipboard

fs.writeFileSync('src/content/index.js', content);
console.log('Refactoring complete!');
