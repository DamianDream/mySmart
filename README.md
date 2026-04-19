# mySender Tools 🚀

**mySender Tools** (v2.0) is a powerful, un-opinionated Chrome Extension designed exclusively for users of `console.smartsender.com`. It injects a highly responsive sidebar directly into the console, offering advanced tools to manage your project's tags, count contacts with precision, and bulk-manage user variables seamlessly.

## ✨ Key Features

### 🎨 Seamless UI & Design
*   **Intuitive Sidebar**: A draggable, resizable custom overlay living right alongside your workspace.
*   **Dark & Light Modes**: Beautiful CSS variables support smooth transitions between UI themes perfectly matching your eyes' needs.
*   **Adjustable Typography**: Quickly switch the sidebar font scale (Small, Regular, Large).

### 🏷 Tags & Contacts Manager
*   **Dynamic Tag Search**: Quickly lookup tags by exact or partial names across your SmartSender project.
*   **Contact Counter Engine**: Select multiple tags and apply logical date operators (e.g., `=`, `>`, `<=`) to instantly query the exact number of subscribers matching your criteria.

### ⚡ Variables Workspace
*   **Lightning Fast Search**: Find variables through single or comma-separated bulk searches.
*   **Edit History**: The extension automatically logs your last 5 value modifications for any variable, giving you a powerful, local "Undo" mechanism to revert mistakes safely.
*   **1-Click Copy**: Instantly copy variables or their values to your clipboard.

### 📁 Advanced Preset Configurations
*   **Variable Grouping**: Save clusters of variables together into a "Preset". Click the preset name to instantly load the whole cluster into your workspace.
*   **Gear Configuration Manager**: Every preset has a dedicated settings panel. Open it to list all variables inside, instantly remove them, or **forcibly add custom variables** by explicitly providing an `ID` and `NAME`. 
*   **Duplicate Presets**: Easily duplicate entire preset blocks to rapidly build derivative testing states.

### 🛡 Under The Hood
*   **Zero Authentication Friction**: The script automatically intercepts internal tokens (`X-CSRF` / `X-XSRF`) and the current internal `Project ID` by cleverly monkey-patching `fetch` and `XMLHttpRequest` on document load.
*   **Background API Proxy**: Operates a Manifest V3 Service Worker `background.js` to intelligently proxy external API requests directly to `api.smartsender.com`, bypassing classic CORS restrictions globally.

---

## 🛠 Installation

As this is a local extension, you can easily load it into Chrome:
1. Open Google Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** in the top-right corner.
3. Click on **Load unpacked**.
4. Select the `smartsender-extensio` directory.
5. Head over to `console.smartsender.com`, click the extension icon, and enjoy!

## ⚙️ Configuration
Make sure to open the **Settings** (⚙) menu within the sidebar to provide your official API Token for advanced configuration and variable editing permissions per project.

---

## 📖 Step-By-Step User Guide

### 1. Activating the Extension
1. Log in to your project dashboard at `console.smartsender.com`.
2. Click the **mySender Tools** icon in your Chrome extensions bar.
3. The sidebar will smoothly slide out from the right side of your screen. 
4. *(Required for Editing)* Click the **Settings (⚙)** gear icon in the top right to paste your SmartSender API token, granting the extension permission to save modifications.

### 2. Using the Variables Manager (⚡)
1. Ensure you are on the **Variables** tab (click the burger menu `☰` in the top left to switch tabs at any time).
2. **Search**: Enter a variable's exact Name or ID into the search bar and press **Find**. You can search effectively using single values or multiple comma-separated IDs (e.g. `123, 456, 789`).
3. **Modify Values**: Once a variable card appears, click the **Edit (✏️)** button. Type your new value into the text box and press **Save**.
4. **History Recovery**: Made a mistake? Click the clock icon on any variable card to reveal your local edit history. Click any previous value in the history dropdown to restore the variable instantly.

### 3. Building & Managing Presets
1. Execute a search for multiple variables so they populate your main results view.
2. Click the **Saved Presets** (folder) icon next to the search bar.
3. Under the `Add New Preset` panel, give your group a custom name and click **Save**. 
4. **Instant Loading**: From the presets menu, **click the name** of any saved preset to instantly populate the main workspace with those grouped variables.
5. **Configuring a Preset**: Click the **Gear (⚙)** icon next to a preset to open the inline configurator. Here, you can click the **Trash** icon to remove specific variables, or use the bottom fields (typing an explicit `ID` and `Name`) to forcibly inject unlisted variables straight into the preset pool.
6. **Duplication**: Click the copy icon (`iCopy`) to safely clone an entire preset to experiment with variations.

### 4. Using the Tags Manager (🏷)
1. Click the top-left burger menu `☰` and switch to the **🏷 Tags** workspace.
2. Search for tags by partial or exact names.
3. Check the boxes next to the target tags you want to analyze.
4. Select a logical operator from the dropdown (for example, `=` means 'subscribed exactly on this date'). 
5. Click **Count** to instruct the extension to calculate the precise subscriber count matching your custom tag criteria.
