# Chrome Web Store Listing — mySender Tools

> Last Updated: 2026-06-14

## Store Listing

**Extension Name** [REQUIRED]
mySender Tools

**Short Description** [REQUIRED]
SmartSender Tools Manager to improve your workflow and productivity on SmartSender platform.

**Detailed Description** [REQUIRED]
mySender Tools is an advanced assistant specifically designed for users of the SmartSender platform. 
It seamlessly integrates into the SmartSender interface to provide quick access to variables, tags, contacts, and API testing capabilities.

Key Features:
- Quick access to project variables and tags directly from the SmartSender interface.
- Inline contact tag management: attach, detach, or create tags on the fly.
- Project Variables Transfer: export and import custom variables between projects with automated diff checks.
- Action logs to monitor API requests and errors in real-time.
- Advanced search and filtering tools for contacts with a centered popup view.
- Quick project switching and authorization management.

How to use: Simply install the extension and navigate to smartsender.com. Click the extension icon to toggle the sidebar.

Your privacy is our priority: the extension communicates directly with SmartSender APIs and does not send any sensitive project data to third-party servers.

Feedback and support: Use the built-in feedback form in the About tab.

**Category** [REQUIRED]
Developer Tools

**Single Purpose** [REQUIRED]
An integrated assistant for managing variables, tags, and testing API requests directly within the SmartSender platform.

**Primary Language** [REQUIRED]
English


## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `src/icons/icon-128.png` |
| Screenshot 1 [REQUIRED] | 1280×800 or 640×400 | ⬜ Not created | |
| Small Promo Tile [RECOMMENDED] | 440×280 | ⬜ Not created | |


## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `storage` | permissions | Required to save user preferences, cached data (like API tokens, projects), and extension settings locally. |
| `activeTab` | permissions | Required to interact with the currently active SmartSender tab when the user clicks the extension icon to toggle the sidebar. |
| `scripting` | permissions | Required to dynamically execute and inject the sidebar interface into the SmartSender webpage. |
| `*://*.smartsender.com/*` | host_permissions | Required to access SmartSender's API endpoints and inject the assistant sidebar interface directly on the SmartSender platform. |


## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** Yes

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|-----------|-----------|------------------------|---------|---------------------------|
| Personally identifiable info | No | No | | No |
| Health info | No | No | | No |
| Financial info | No | No | | No |
| Authentication info | Yes | No | API tokens are cached locally for faster access. Not sent off-device. | No |
| Personal communications | No | No | | No |
| Location | No | No | | No |
| Web history | No | No | | No |
| User activity | Yes | No | Logs API requests and actions locally for the "Action Logs" feature. | No |
| Website content | Yes | No | Interacts with SmartSender page content to extract tokens and display data. | No |

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes


## Privacy Policy

**Privacy Policy URL** [RECOMMENDED]
*(To be created and hosted on GitHub Pages or a Notion doc)*


## Distribution

**Visibility**: Public
**Regions**: All regions
**Pricing**: Free


## Developer Info

**Publisher Name** [REQUIRED]
*(Fill in before publishing)*

**Contact Email** [REQUIRED]
*(Fill in before publishing)*


## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 0.3.0 | 2026-06-14 | Updated permissions for Web Store compliance, UI improvements | Draft |
| 0.2.3 | | Initial internal version | |
