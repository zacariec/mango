# Change Log
## **v3.0.0**
---
🚀 **Enhancement**
- Added Dynamic stylelinking at build and run time
  - You can now dynamically link style sheets to liquid files through the use of `<!-- mango-link: mango.style.css -->`
  - When creating dynamic style sheets you can use sass or postcss as long as you append the stylesheet name with `mango.`
  - This will inline the stylesheet respectively depenedant on the file type. 🙌
- Added the audit command to audit unused theme settings, locales & snippets.
- Removed `mango.config.yml` in favor of using targeted environments.
  - This allows us to pass multiple environments through the use of `config.yml`

🏠 **Internal**
- converted the project to TypeScript
- Added build commands to build the tool locally
- Added dev commands to build and watch the tool locally for easier development.
  
🐛 **Bug Fix**
- Added some minor bugfixes across the project in general.