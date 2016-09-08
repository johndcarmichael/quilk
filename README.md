#quilk

<span style="font-size:small;font-weight:500;">This is just currently a little project of mine.. if you fancy helping out do give me a shout :) It is pretty much stable and I don't foresee the architecture changing too drastically now, but I have not tested this cross platform too much yet, tested on windows10 and Linux Mint 18 a.t.m., should work on macs but yet to try.</span>
---

### Coming next
1.  Integration of modules into the release commands, example use case clearly being the node_minify for release.
2.  Conversion of the quilk module keys to lowercase and underscored for normalisation over all modules, quilk packaged and project custom.

### Index
*  [Intro](#intro)
*  [Getting started](#getting-started)
*  [Example single run](#example-single-run)
*  [Example run then watch](#example-run-then-watch)
*  [Example run for live](#example-run-for-live)
*  [How it works](#how-it-works)
*  [Example kitchen sink quilk.json](#example-kitchen-sink-quilkjson)
*  [Example browserifyMain.js file](#example-browserifymainjs-file-which-requires-other-modules)
*  [Which notifier to use](#which-notifier-to-use)


# Intro
quilk. A builder and watcher with speed. No complex build configuration file required, just a simple JSON.

Why? Speed. We wanted a cleaner and faster way to do the routine tasks we frequently do at the start of each project. A way that is very opinionated while offering the freedom to those who want it. With quilk, a quick configuration of a std json file will get you building the app or site you want to build without first messing around with any complex gulp or grunt file. We wanted a simple package that housed all the essentials for SASS, LESS and JS. So now you don't need to include 10 dev dependencies, you only require a simple quilk.json file and have quilk globally installed.

Using quilk either for personal use or as a company or as an agency, the build file will always look and feel the same. To build the std sass and js files there is only one way to go, configure a simple JSON. If the output works then the JSON is configured correctly, if it does then it is not. No room for funky code to make new devs on the project scratch their head and wonder what the flip is going on. Spending 8 months at an agency I was left scratching my head as to why this didn't already exist. Instead every time a new project was started a different developer would create a new build file in a different way to another.. 10 projects later and there are 10 different styles of build file all pretty much doing the same thing, but some better or worse than others.. maddening.

With quilk all the essentials are there out of the box. Want more functionality, write a simple node js module and you're away.. don't know how to write a simple node js module, no bother.. just type `quilk init example_module` and it will init your quilk.json file and create a sample custom module for you to play around with. 

## Getting started
First up, I don't enjoy typing dashes before cli args, if you do that is fine they will still work but, the quilk cli command also work without, eg the following all map to the same thing.. help: `quilk help` `quilk -help` `quilk --help`

Create your base `quilk.json` file by running from the root of your project:
 ```
 quilk init
 ```
This will bootstrap the current directory with a quilk.json file configured to run the `just_for_fun` module. After the init has finished you can take quilk for a test drive  by typing `quilk`, this will take the developer in the quilk.json named default to run the modules the quilk.json is configured to run, which in this case is just the fun run module. If you add a new developer this is used by typing `quilk d=<dev name>`
 
For help on a specific module, find the module name (see lower down in the how it works section)
 ```
 quilk help module=<module>
 ```

## Example single run 
`quilk d=john`

## Example run then watch
`quilk d=john watch`

## Example run for live
`quilk release=live`

## How it works
Quilk works by taking the project relevant settings and data from a quilk.json file and feeding that said data into prebuilt modules. These said modules come packaged with quilk and do all the basic things you might expect, for example compiling .scss files or finding then concatenating javascript files etc.

When you start quilk, the runner simply loops and runs each module it finds in the modules array in the quilk.json one by one until exhaustion.

The base modules quilk comes with handle the majority of tasks required to compile and build modern day web applications and the quilk.json can be configured in a matter of minutes. However, should you require something that is outside the std modules then you can simply write your own.

1.  **The 9 modules** packaged with quilk and ready to go:
    1. **browserify_bundle**: This will build a bundle.js from other js modules. A must for when building nodeJs web applications, use select server side code at the client and the client code at the server, less code to write.
    1. **js_find**: This will create a single js file based on js files it finds within an array of paths you provide. You may also state which files must be included at the top of the generated file.
    1. **js_fixed**: A simplified version of js_find, provide a static list of files and the module will simply concat them all together in a single js file.
    1. **less_std**: A standard module to build css files. Provide the entry point and output point and the module will handle the rest.
    1. **css_fixed**: A simple concat module, supply it paths from the root of your project and output will be one big css file. Perfect for including css from 3rd parties eg via bower.
    1. **sass_std**: A standard module to build css from sass files. The same as the less_std, provide the in and out and the module handles the rest. It being sass of course results in a much much faster time to compile.
    1. **sass_find**: Slightly different from the sass_find, this module will find sass files in paths you provide and create a single sass file, ever so slightly slower than the sass_std, but which ever floats your boat :)
    1. **rsync**: Not everyone is a fan of overheating your local machine and burning it into the ground before it is due just so they can claim they can work on the bus. If this is you and you want ot ensure a dev env that is identical for everyone rsync is for you. Rsync only syncs the files that have changed since the last time it ran, opposed to all files every time. For a mid-weight project the build+sync time on a typical internet connection would be around 1-5 seconds, which, is far superior than the 5-10second load time of a vagrant machine, and far superior to have developers working on say nginx when the prod is apache etc etc. Now throw into the mix a remote or semi remote team, with the rsync module everybody can now see everybody else's dev environment from their own machine... bonus for everyone, the devs, the designers, the product owners and of course, the all important fillet steak holder. For windows users, a dependency for this to work is cygwin or cwrsync. Plenty of guides out there for installation, just ensure that rsync is available in your PATH var and ssh can connect to your dev machine via ssh keys without a pass-phrase. (http://www.beingyesterday.com/bitbucket-sourcetree-ide-rsync-dev-server/   Step 3).
    1. **node_minify**: This is a direct mapping to the popular node_minify npm packge.
2.  **Custom modules** Custom modules allow you to basically do anything you want with whatever you want. Custom modules must be placed inside a folder titled `quilk_modules` at the root of your project. Each module just needs to be a simple `module.export = function( next ){ //your code here; //then run the next module; next(); }`. Please take a look at the modules currently in use for an example on how to write your own. There are 4 things to play with in your modules:
    1.  **global.current_module**: This will be the current module object in the quilk.json. There is no required format, but see the example kitchen sink below for a starter.
    1.  **global.chokidarFileChangePath**: If you are running quilk with watch then the current file that was changed will be in this variable.
    1.  **global.cliArgs**: All the command line arguments are stored here, if you want your module to pivot by cli args then this is where to look.    
    1.  **next**: The one and only argument that will be passed to each module is a callback. This will be the next module to be run after the current has finished.
    To create an example custom module run from the cli at the root of your project:
       ``quilk init example_module`` 
    
    Example custom module in the quilk.json:
    ```
    {
      "modules" : [
        {
          "name": "My module running",
          "module" : "my_module",
          "path_input": "/private/path/",
          "path_output": "/public/path/"
        },
        ... rest of the modules array
    ```   
3.  **Config data** Each module requires its own set config data, and this data is set in the `quilk.json` file. See the full kitchen sink example below
4.  **Dont watch** When using the watch option ensure that you instruct which file to not watch, `dont_watch`. 
    The `dont_watch` option is quilk.json is passed to chokidar as directories and exact files to not trigger on. EG should you build a css file from sass you don't want to trigger chokidar to run all the modules again when it spots a change in the said css file ie ending up in an infinite loop.
5.  **Developers block** This can be as general or as granular as your like. As you can see from the example, this also contains developer specifics for the rsync module.

## Example kitchen sink quilk.json 
(Note this example uses every out of the box module)
```
{
  "modules" : [
    {
      "name": "Browserify files",
      "module" : "browserify_bundle",
      "browserify_main": "/public/browserify_modules/browserifyMain.js",
      "browserify_bundle_name": "bfyModules",
      "target" : "/public/js/bundle.js"
    },
    {
      "name" : "Vendor Files",
      "module": "js_fixed",
      "files": [
        "/public/bower_components/jquery/dist/jquery.js",
        "/public/bower_components/bootstrap/dist/js/bootstrap.min.js",
        "/public/bower_components/angular/angular.min.js",
        "/public/bower_components/angular-route/angular-route.min.js",
        "/public/bower_components/angular-sanitize/angular-sanitize.min.js",
        "/public/bower_components/angular-bootstrap/ui-bootstrap.min.js",
        "/public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
        "/public/bower_components/ngDialog/js/ngDialog.min.js"
      ],
      "target": "/public/js/vendor.js"
    },
    {
      "name": "App Files",
      "module": "js_find",
      "include_first": [
        "/public/js_to_compile/globalOverrideFunctions.js",
        "/public/js_to_compile/app.js",
        "/public/js_to_compile/app.config.js"
      ],
      "find_in_paths": [
        "/public/js_to_compile/"
      ],
      "target" : "/public/js/build.js"
    },
    {
      "name": "App CSS",
      "module": "sass_std",
      "outputStyle": "expanded",
      "sourceComments": true,
      "input_path": "/resources/assets/sass/app.scss",
      "target": "/public/css/all.css"
    },
    {
      "name": "App CSS (SASS find)",
      "module": "sass_find",
      "outputStyle": "expanded",
      "sourceComments": true,
      "include_first": [
        "/public/app/core/scss/global.scss"
      ],
      "ignorePaths" : [
        "core/scss"
      ],
      "find_in_path": "/public/app/",
      "target": "/public/css/index.css"
    },
    {
      "name"   : "Less compiler",
      "module" : "less_std",
      "resourcePaths" : ["/resources/assets/less/"],
      "input_path"  : "/resources/assets/less/xenon.less",
      "target" : "/public/css/app.css"
    },
    {
      "name" : "Vendor CSS Files",
      "module": "css_fixed",
      "files": [
        "/public/bower_components/bootstrap/dist/css/bootstrap.css",
        "/public/bower_components/ngDialog/css/ngDialog.css",
        "/public/bower_components/ngDialog/css/ngDialog-theme-plain.css"
      ],
      "target": "/public/css/vendor.css"
    },
    {
      "name": "Rsync it",
      "module": "rsync",
      "ignore": {
        "linux" :   [],
        "windows" : [],
        "mac"     : [],
        "global"  : [
          ".git*",
          ".idea*",
          "storage",
          "node_modules/*",
          "tests/*",
          "vendor/*"
        ]
      }
    }
  ],

  "dont_watch": [
    "public/js/",
    "public/css/all.css"
  ],

  "release_commands": {
    "live": [
      "bower install -s"
    ],
    "dev":[
      "bower install -s"
    ]
  },

  "developers" : {
    "john" : {
      "platform"      : "windows",
      "notifier"      : {
        "on"   : true,
        "style": "WindowsBalloon",
        "time" : 2500,
        "sound": true
      },
      "rsync"         : {
        "localPath"     : "/cygdrive/d/test_project/",
        "remote"        : "www-data@8.9.10.110",
        "serverPath"    : "/var/vhosts/service-test/"
      }
    }
  }
}
```


## Example browserifyMain.js file which requires other modules
```
"use strict";
module.exports = {
	formValidator	: require('./formValidator'),
	validators		: require( './validators')
};
```
The modules using the above kitchen sink json would be accessed in you application like this (the `browserify_bundle_name` you use is what you call in your application):
```
var passfail = bfyModules.validators.parse( 'is_max_length:50', 'some input string' );
```

## Which notifier to use
The desktop notifier is defined developer by developer. Most teams today do not insist that all devs work on the same OS, and most devs have their own preferences to their own machine.

With quilk you can turn on or off the notifications on a dev by dev basis, just set on to true or false.

There are also a few alternative desktop popups available and vary from OS to OS. As Windows potentially has two types (depending on the version XP, 7 or 10) this block in the json is granular down to the type of popup. And below is the list:
1.  **WindowsBalloon**: Typically for windows 7,8,10.
1.  **WindowsToaster**: Typically for windows 7,8 (10 seems to default to the balloon).
1.  **Growl**: Typically for mac users.
1.  **NotifySend**: Typically for Linux.

The notifier uses this module: https://www.npmjs.com/package/node-notifier#all-notification-options-with-their-defaults

The notifier object for the current quilk developer will, along with the title and message, be passed to the notifier. Please refer to their documentation for the options, if you see an option from their docs, just add it to your quilk.json as another key/value pair in the `notifier` object of your developer.
