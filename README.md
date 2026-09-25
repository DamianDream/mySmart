# mySender Tools 🚀

A premium Chrome extension designed to supercharge your `console.smartsender.com` workflow. Manage variables, tags, and contacts from a powerful, resizable sidebar on any website.

---

## ⚡ Variables & Presets
*   **Rapid Management**: Search, edit, and copy variables by name or ID instantly.
*   **Edit History**: Track and restore the last 5 values for any variable.
*   **Custom Presets**: Group variables for frequent tasks. Add variables by ID and manage groups in dedicated side panels.
*   **Project Variables Transfer**: Export custom variables to JSON and import them into another project with automated diff preview and progress bar.

## 🏷 Tags Management
*   **Instant Discovery**: Find tag IDs quickly for use in automations and funnels.
*   **Inline Contact Tags**: Attach or detach tags directly inside the contact profile with real-time API sync.
*   **Create on the Fly**: Type a new tag name to create and attach it immediately to a contact.
*   **History & Favorites**: Access your most-used tags via persistent side panels.

## 👤 Contacts & CRM
*   **Universal Lookup**: Find contacts by ID, Email, or Name across the web.
*   **Smart Profiles**: Collapsible (accordion) view for Tags and Variables with unified search.
*   **Priority Filters**: Pin specific variables to the top of contact profiles (customizable per project).
*   **Inline Sync**: Update contact data directly with real-time API feedback.
*   **Centered Detached Window**: Open contact cards in an ergonomic, centered multi-tab popup window.

## 🌍 Global Features
*   **Universal Access**: Works on any website (CRMs, Google, etc.).
*   **Project Sync**: Automatic detection of project IDs (e.g., `slug-12345`) with Auto/Manual switching modes.
*   **External Links**: Instant deep-links to specific sections in the SmartSender console.
*   **Premium UI**: Resizable workspace, Dark/Light modes, and adjustable typography.

---

## 🛠 Quick Start
1.  Install dependencies and build: `npm install && npm run build`. This produces the loadable extension in the `dist/` folder.
2.  Open `chrome://extensions/` and enable **Developer mode**.
3.  Click **Load unpacked** and select the **`dist`** folder.
4.  Open the extension on any page and start managing your SmartSender projects.

> While developing, run `npm run dev` to rebuild `dist/` on every change, then hit **Reload** on the extension card.
