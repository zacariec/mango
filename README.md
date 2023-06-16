

<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://i.pinimg.com/originals/1b/8f/fa/1b8ffa8be742e08bacbf36b7f05463f4.gif" alt="Mango" width="400">
  </a>


  <h3 align="center">Mango</h3>

  <p align="center">
    A fully modular, open source build tool. Made to plug and play with Shopify theme development.
    <br />
    🥭 <a href="https://github.com/raylway/mango/issues">Report Bug</a>
    🥭
    <a href="https://github.com/raylway/mango/issues">Request Feature</a> 🥭
  </p>


<h3>Table of Contents</h3>
<details open="open">
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



## 🥭 About The Project
---
Mango is made to work in tandem with Shopify Theme Kit, Webpack and a little bit of NodeJS magic.

The goal of mango, was to provide developers with a quick and easy setup to start using modern day technologies when doing Shopify development and to solve the baseline issues Theme Kit was having.

Mango makes sure all needed Theme Kit & web pack commands are ran in conjunction with one another, while working out of one terminal.

Mango aims to provide a set ideology, with a direct and concise Project Scaffolding to allow for rapid and modern development on Shopify.



### 🥭 Built With
---
Mango is purely open source and built with NodeJS.




## 🥭 Getting Started
---


### 🥭 Installation
---
```sh
npm install @shopackify/mango -g
```



## 🥭 Usage
---


### 🥭 Initializing a Project
---
`mango init` will set up the base project, copy all of the configuration files.



### 🥭 Files Mango rely on
---
Mango actively looks for:

1. `webpack.config.js`
2. `webpack.production.config.js`
4. `config.yml`

These files should be in your project root at all times.



### 🥭 Configuration Files
---
##### config.yml
- Stores all of your Shopify environment data, mango will read and write from this when needing to make API calls.

```yaml
development:
  password: example_password
  theme_id: "1234567890123"
  store: example.myshopify.com
  directory: shop/dist
  ignores:
  - themekit_ignores
  
staging:
  password: example_password
  theme_id: "1234567890123"
  store: example.myshopify.com
  directory: shop/dist
  ignores:
  - themekit_ignores
  
production:
  password: example_password
  theme_id: "1234567890123"
  store: example.myshopify.com
  directory: shop/dist
  ignores:
  - themekit_ignores
```
##### webpack.config.js and webpack.production.config.js
- Mango uses both of these files as core files. The production config is only ever used on build, and the standard config is used while watching. To learn more about webpack configuration files see: https://webpack.js.org/



### 🥭 Opinionated
---
Mango is an opinionated build tool and expects you to follow the outlined structure to properly work, however you can edit the `webpack.production.config.js` & `webpack.config.js` files to suit your needs.



### 🥭 What to expect
---
Using the recommended config `mango init` or will setup the project directory with all of the recommended configurations out of the box.


### 🥭 Directory Structure
---
```
  |-- shop
      |-- dist
          |-- assets
          |-- config
          |-- layout
          |-- locales
          |-- sections
          |-- snippets
          |-- templates
              |-- customers
      |-- src
          |-- config
          |-- dev
              |-- fonts
              |-- images
              |-- js
                  |-- modules
                  		|-- *.js
              |-- static
                  |-- static-files
                  		|-- *.*
              |-- styles
                  |-- base
                  		|-- *.css
                  |-- components
                  		|-- *.css
                  |-- mixins
                  		|-- *.css
                  |-- sections
                  		|-- *.css
                  |-- templates
                  		|-- *.css
                  |-- typography
                  		|-- *.css
                  |-- variables
                  		|-- *.css
          |-- layout
          |-- locales
          |-- sections
          |-- snippets
          |-- templates
              |-- customers
```



### 🥭 Mango Commands
---

**Mango Audit**

- `mango audit` - Audits the `/shop/src` directory for unusued settings from `settings_schema.json`, unusued snippets from `/shop/src/snippets` and unusued locales from your `*.default.json` locale file.

- Will output a `mango-audit.md` file with the results from the audit.


**Mango Build**

- `mango build` - Builds the distribution `/shop/dist` folder ready for deployment from the `/shop/src` directory.

*<u>Optional flags</u>*:  

1. `-env` `--environment` - The environment from your config.yml that you would like to use to update your settings_schema.json with.

**Mango Config**

- `mango config` - Will setup the config.yml file required for Shopify themes to work.

*<u>Required flags</u>*:

1. `-t --themeid` - The theme id you'd like to work with
2. `-p --password` - The password of the admin app you use to communicate with Shopify.
3. `-s --store` - The .myshopify url of the store you want to work on.


*<u>Optional flags</u>*:

1. `-i --ignores` - The ignores file you want to use, defaults to `.shopifyignores`
2. `-e --env` - The environment you want to use, defaults to `development`
3. `-d --dir` - The directory for themekit to watch, defaults to `./shop/dist`

**Mango Convert**

- `mango convert` - Will take the theme structure you have in `shop/dist` and convert it to work with mango, sometimes there's manual steps required.

**Mango Deploy**

- `mango deploy` - Will deploy the `/shop/dist` folder to the current theme.

*<u>Optional flags</u>*:  

1. `-d` `--dir` - Which directory to deploy (default: `/shop/dist`)
2. `-l` `--allow-live` - Allow deployment to the live theme
3. `-e` `--env` - Which environment to use (default: `development`)
4. `-n` `--new` - Specify whether or not to generate a new theme to deploy to
5. `-v` `--verbose` - Specify if you want Verbose output
6. `-i` `--ignores` - The ignores file you want to use

**Mango Download**

`mango download` - Will download the currently defined theme in your `config.yml` file.

**Mango Style-Link**

`mango style-link` - A manual command to dynamically link any of your styles you have defined to be linked using `<!-- mango-link: mango.style.css -->`, this will find the file in the `shop/dist/assets` directory and inline it accordingly.

**NOTES**:
Mango style-link happens at build time and during development, you will hardly need to run this command manually if at all.

**Mango Init**

`mango init` - Will initialize the project directory for mango ready builds.


**Mango Install**

`mango install` - Runs on `npm i @shopackify/mango -g` to install the bin for theme kit, can manually run to update the theme kit bin.



**Mango Locales**

`mango locales` - Compiles your locales folder with the configured localization defined in `shop/src/dev/locales.config.json`
example:

```
{
  "locales": ["en.default", "ja"],
  "translations": {
    "404": {
      "general": {
        "title": "Page not found"
      }
    }
  }
}
```

**Mango Update-Data**

`mango updata-data` - Update `config/settings_data.json` with the published theme `settings_data.json`

*<u>Optional flags</u>*:  

1. `-env --environment` - Specify whether or not to update the settings_data.json file with a config from the live or specified theme id.


**Mango Watch**

`mango watch` - Will start watching for file changes.

*<u>Optional flags</u>*:  

1. `-env --environment` - Specify environment from the config.yml fil, wrap in quotes to pass multiple: -e "development1 development2"


## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Zacarie Carr - [LinkedIn](https://www.linkedin.com/in/zacariecarr) - zacariealancarr@gmail.com

Project Link: [Mango](https://github.com/raylway/shopackify)
NPM Link: [Mango](https://www.npmjs.com/package/@shopackify/mango)

## Acknowledgements

* [Shopify](https://www.shopify.com/)
* [Themekit](https://shopify.dev/tools/theme-kit)
* [Webpack](https://webpack.js.org/)
* [Webpack-Cli](https://github.com/webpack/webpack-cli/tree/master/packages/webpack-cli)
* [Fast-Glob](https://github.com/mrmlnc/fast-glob#readme)
* [Fs-Extra](https://github.com/jprichardson/node-fs-extra)
* [Ora](https://github.com/sindresorhus/ora#readme)
* [Chokidar](https://github.com/paulmillr/chokidar)
* [WS](https://github.com/websockets/ws)
* [Babel](https://babeljs.io/)
* [Sass](https://sass-lang.com/)
* [Postcss](https://postcss.org/)
* [Best README Template](https://github.com/othneildrew/Best-README-Template)

