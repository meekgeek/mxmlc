//var fs = require('fs');
var prompt = require('prompt');
var program = require('commander');
var execFile = require('child_process').execFile;
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
	/*.option('-k, --sdk <path>', "Directory to FLEX SDKs")
	.option('-s, --source-path', "Source path")
	.option('-o, --output-path', "Output path")
	.option('-f, --source-file', "File to compilet")
	.option('-l, --lib-path', "Add lib path")*/
	.action( function(){
		if( ! nconf.get('sdkDir') )
			nconf.set('sdkDir', '');
		
		if( ! nconf.get('sourcePath') )
			nconf.set('sourcePath', '');

		if( ! nconf.get('sourceFile') )
			nconf.set('sourceFile', 'Main');

		if( ! nconf.get('libPath') )
			nconf.set('libPath', "");

		if( ! nconf.get('defaults:background-color') )
			nconf.set('defaults:background-color', '0xffffff' );

		if( ! nconf.get('defaults:frame-rate') )
			nconf.set('defaults:frame-rate', '30' );
		
		if( ! nconf.get('defaults:size') )
			nconf.set('defaults:size', '980,590' );
		
		nconf.save(function(err){
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


function build(file) {
	
	/*"-default-background-color=0xffffff",
	"-default-frame-rate=30",
	"-default-size=980,590",*/

	var mxmlc = "/Applications/Adobe Flash Builder 4.5/sdks/flex_sdk_4.6.0.23201B/bin/mxmlc";
	var output = Boolean(!program.releaseBuild) ? "bin/"+file+".swf" : "release/"+file+".swf"
	var mxmlc_args = [	"-compiler.incremental=true",
						"-compiler.include-libraries="+nconf.get('libPath'),
						"-static-link-runtime-shared-libraries=true",
						"-debug="+Boolean(!program.releaseBuild),
						"-source-path="+nconf.get('sourcePath'),
						process.cwd()+"/"+file+".as",
						"-o="+output ]

	var defaults = nconf.get('defaults');
	for ( var key in defaults ) {
		console.log( key, defaults[key] );
		mxmlc_args.push("-default-"+key+"="+defaults[key]);
	}
	
	execFile(mxmlc,mxmlc_args,function(err,stdout,stderr){
		if(err){console.log(err);}
		console.log('Done!'.green);
		process.exit(0);
	})
};

//console.log(process.env);
if( ! nconf.get('sdkDir') ) {
	console.log('No SDK detected. Run "init" first, then edit the generated mxmlc.properties file'.red);
	process.exit(0);
}

//console.log("name: ",program.name);
//console.log(program.args[0]);

if( ! program.args[0] ) {
	//console.log('build');
	build( nconf.get('sourceFile') );
}

//console.log('program.command', program );
//if(!src_file){
//	build(nconf.get('source-path'));
//}

