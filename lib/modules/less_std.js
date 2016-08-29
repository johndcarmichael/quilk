var less = require( 'less' );
var fs = require( 'fs' );
var path = require('path');
var fse = require('fs.extra');

var lessPath    = GLOBAL.pwd + GLOBAL.current_module.input_path,
    outputPath  = GLOBAL.pwd + GLOBAL.current_module.target;

//inject the folder base dir to the resource paths
if(GLOBAL.current_module.resourcePaths){
    for( var key in GLOBAL.current_module.resourcePaths ){
        GLOBAL.current_module.resourcePaths[key] = GLOBAL.pwd + GLOBAL.current_module.resourcePaths[key];
    }
}

//first ensure we have the js folder, and make if not
fse.mkdirp( outputPath.split('/')[0], function (err) {
    if (err) {
        console.log( 'ERROR COULD NOT MAKE THE BASE CSS DIRECTORY.' );
        console.log( err );
        throw "HALT!";    // throw a text
    }
});

module.exports = function( callback ){

    callback = callback || function(){};

    if( GLOBAL.chokidarFileChangePath ){
        if( GLOBAL.chokidarFileChangePath.indexOf('.less') == -1 ){
            console.log( 'Not a less file' );
            return callback();
        }
    }

    logTime( 'Building css file from: ' + lessPath );
    fs.readFile( lessPath ,function(error,data){
        data = data.toString();
        logTime( 'Base less file read, passing to less render' );
        less.render(data, {
            paths: GLOBAL.current_module.resourcePaths
        },function (e, css) {
            if( e ){
                logTime( e );
                return callback();
            }
            logTime( 'CSS compiled, starting write to disk' );
            fs.writeFile( outputPath, css.css, function(err){
                if( err ){
                    console.log( err );
                }
                logTime( 'File written to disk' );
                //now we have built the all.css, append the bower component specific stuff, eg ng-dialog
                return callback();
            });
        });
    });
};