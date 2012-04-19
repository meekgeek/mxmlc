#!/usr/bin/env node

var prompt = require('prompt');
var program = require('commander');
var execFile = require('child_process').execFile;
var exec = require('child_process').exec;
var nconf = require('nconf');
var src_file;

nconf.file({file:"mxmlc.properties"});

program
	.version('0.0.3')
	.option('-r, --release-build', "Create a release build")
	.option('-o, --output <path>', "Output for file")

program
	.command('init')
	.description('Initializes and creates the mxmlc.properties file.')
	.action( function(){

		if( ! nconf.get('sdkDir') )
			nconf.set('sdkDir', '');
		
		if( ! nconf.get('sourcePath') )
			nconf.set('sourcePath', '');

		if( ! nconf.get('sourceFile') )
			nconf.set('sourceFile', 'Main.as');

		if( ! nconf.get('libPath') )
			nconf.set('libPath', "");

		if( ! nconf.get('defaults:background-color') )
			nconf.set('defaults:background-color', '0x000000' );

		if( ! nconf.get('defaults:frame-rate') )
			nconf.set('defaults:frame-rate', '30' );
		
		if( ! nconf.get('defaults:size') )
			nconf.set('defaults:size', '980,590' );
		
		nconf.save(function(err){
			process.exit(0);
		});
	});

program
	.command('compc')
	.description('Compile swc')
	.action( function(env) {
		var file = nconf.get('sourceFile');
		var compc = "'"+nconf.get('sdkDir')+"/bin/compc'";
		var output = Boolean(!program.releaseBuild) ? "bin/"+file+".swc" : "release/"+file+".swc"
		var compc_args = ["-output "+output];

		if( nconf.get('sourcePath') ) {
			compc_args.push("-include-sources "+nconf.get('sourcePath') );
		}

		if( nconf.get('libPath') ) {
			compc_args.push("-compiler.library-path "+nconf.get('libPath') );
		}

		console.log( compc+" "+compc_args.toString().replace(/,/gi, ' ') );
		exec(compc+" "+compc_args.toString().replace(/,/gi, ' '),function(err,stdout,stderr){
			if(err){console.log(err);}
			console.log('Done!'.green);
			process.exit(0);
		});
	});

program
	.command('launch')
	.description('launches swf file.')
	.option('-b, --browser', "Launches in browser.")
	.action( function(options) {
		console.log(Boolean(options.browser));
		var command = Boolean(options.browser) ? "open -a 'Google Chrome' " : "open -a 'Flash Player' ";
		var file = nconf.get('sourceFile');
		var swf = Boolean(!program.releaseBuild) ? "bin/"+file+".swf" : "release/"+file+".swf";
			swf = process.cwd()+"/"+swf;

		exec(command+swf,function(err,stdout,stderr) {
			if(err){console.log(err);}
			process.exit(0);
		});
	});

program
	.command('*')
	.description('File to build')
	.action( function(env){
		build(env);
	});

program.parse(process.argv);


if( ! nconf.get('sdkDir') ) {
	console.log('No SDK detected. Run "init" first, then edit the generated mxmlc.properties file'.red);
	process.exit(0);
}

if( ! program.args[0] ) {
	//console.log('build');
	build( nconf.get('sourceFile') );
}

function build(file) {

	var mxmlc = nconf.get('sdkDir')+"/bin/mxmlc";
	var output_file = file.replace(/.as$/gi, "")+".swf";
	var output = Boolean(!program.releaseBuild) ? "bin/"+output_file : "release/"+output_file
	var mxmlc_args = [	"-compiler.incremental=true",
						"-compiler.include-libraries="+nconf.get('libPath'),
						"-static-link-runtime-shared-libraries=true",
						"-debug="+Boolean(!program.releaseBuild),
						"-source-path="+nconf.get('sourcePath'),
						process.cwd()+"/"+file,
						"-o="+output ]

	var defaults = nconf.get('defaults');
	for ( var key in defaults ) {
		mxmlc_args.push("-default-"+key+"="+defaults[key]);
	}
	
	execFile(mxmlc,mxmlc_args,function(err,stdout,stderr){
		if(err){console.log(err);}
		console.log('Done!'.green);
		process.exit(0);
	})
};