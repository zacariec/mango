

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



<details open="open">
  <summary><h3>Table of Contents</h3></summary>
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

Mango is made to work in tandem with Shopify Theme Kit, Webpack and a little bit of NodeJS magic.

The goal of mango, was to provide developers with a quick and easy setup to start using modern day technologies when doing Shopify development and to solve the baseline issues Theme Kit was having.

Mango makes sure all needed Theme Kit & web pack commands are ran in conjunction with one another, while working out of one terminal.

Mango aims to provide a set ideology, with a direct and concise Project Scaffolding to allow for rapid and modern development on Shopify.



### 🥭 Built With

Mango is purely open source and built with NodeJS.




## 🥭 Getting Started



### 🥭 Installation

```sh
npm install @shopackify/mango -g
```



## 🥭 Usage



### 🥭 Initializing a Project

`mango init` will set up the base project, copy all of the configuration files from either `/bin/settings/recommended` or `/bin/settings/standard` and install all project depedencies. 



### 🥭 Files Mango rely on

Mango actively looks for:

1. `webpack.config.js`
2. `webpack.production.config.js`
3. `mango.config.yml`
4. `config.yml`

These files should be in your project root at all times.



### 🥭 Configuration Files

##### config.yml

Stores all of your Shopify environment data, mango will read and write from this when needing to make API calls.

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



##### mango.config.yml

Currently only stores a key/value pair of each store & password, these are used to make API requests to Shopify for dynamically getting `config/settings_data.json` and deploying to uncreated themes.

```yaml
store: example.myshopify.com
password: example_password
```



##### webpack.config.js and webpack.production.config.js

Mango uses both of these files as core files. The production config is only ever used on build, and the standard config is used while watching. To learn more about webpack configuration files see: https://webpack.js.org/



### 🥭 Caveats

Mango uses Chokidar under the hood and rely's on both `./shop/dist` & `./shop/src` folders to work.

Theme Kit watches the `./shop/dist` folder for changes, while Chokidar watches and moves anything from the src folders to their respective distrobution folder.



### 🥭 What to expect

Using the recommended config `mango init -r` or `mango init --recommended` will setup the project directory with all of the recommended configurations out of the box.

If you'd like to do something completely different or custom, you can run  `mango init -s` mango doesn't deny you this right, only as long as you fork the tooling and update the directory's privately or you follow the below directory structure.



### 🥭 Directory Structure

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



**Mango Build**
`mango build` - Builds the distrobution `/shop/dist` folder ready for deployment from the `/shop/src` directory.

*<u>Optional flags</u>*:  

1. `-u` `--update-config` - Used to specify whether you'd like to update the `config/settings_data.json` with either the current Live theme settings, or by passing an id `-u some-id` `--update-config=some-id` to fetch settings from.



**Mango Deploy**
`mango deploy` - Will deploy the `/shop/dist` folder to the current theme.

*<u>Optional flags</u>*:  

1. `-d` `--dir` - Which directory to deploy (default: `/shop/dist`)
2. `-l` `--allow-live` - Allow deployment to the live theme
3. `-e` `--env` - Which environment to use (default: `development`)
4. `-n` `--new` - Specify whether or not to generate a new theme to deploy to
5. `-v` `--verbose` - Specify if you want Verbose output
6. `-i` `--ignores` - The ignores file you want to use



**Mango Download**
`mango download` - Will download the currently defined theme in your `config.yml` file.



**Mango Config**
`mango config` - Configure/provision your environment with a config.yml file

*<u>Optional flags</u>*:  

1. `-t` `--themeid` - Theme ID
2. `-p` `--password` - Private App Password
3. `-s` `--store` - The .myshopify store URL
4. `-i` `--ignores` - The optional ignores file.
5. `-e` `--env` - Optional environment, default is development
6. `-d` `--dir` - Optional directory to watch, default is `shop/dist`



**Mango Convert**
`mango convert` - Convert the currently downloaded Shopify Theme to use Mango workflow



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

1. `-id` `--themeId` - Used to specify whether you'd like to update the `config/settings_data.json` with either the current Live theme settings, or by passing an id `-id some-id` `--themeId=some-id` to fetch settings from.



**Mango Watch**
`mango watch` - Will start watching for file changes.



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

