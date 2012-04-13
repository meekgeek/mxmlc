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
	.option('-k, --sdk <path>', "Directory to FLEX SDKs")
	.option('-s, --source-path', "Source path")
	.option('-o, --output-path', "Output path")
	.option('-f, --source-file', "File to compilet")
	.option('-l, --lib-path', "Add lib path")
	.action( function(){
		//set sdk
		if( program.sdkDir ) {
			nconf.set('sdkDir', program.sdkDir );
			console.log('sdkDir set to: '+program.sdkDir+''.blue);
		} else {
			if( ! nconf.get('sdkDir') ) {
				//prompt
				console.log('sdkDir default set'.blue);
			}
		}

		if( program.sourcePath ) {
			nconf.set('sourcePath', program.sourcePath );
			console.log('sourcePath set to: '+program.sourcePath+''.blue);
		} else {
			if( ! nconf.get('sourcePath') ) {
				nconf.set('sourcePath', '');
				console.log('sourcePath default set'.blue);
			}
		}

		if( program.sourceFile ) {
			nconf.set('sourceFile', program.sourceFile );
			console.log('sourceFile set to: '+program.sourceFile+''.blue);
		} else {
			if( ! nconf.get('sourceFile') ) {
				nconf.set('sourceFile', 'Main');
				console.log('sourceFile default set'.blue);

			}
		}

		if( program.libPath ) {
			nconf.set('libPath', program.libPath );
			console.log('libPath set to: '+program.libPath+''.blue);
		} else {
			if( ! nconf.get('libPath') ) {
				nconf.set('libPath', "");
				console.log('libPath default set'.blue);
			}
		}


		function tryExit() {
			nconf.save(function(err){
				process.exit(0);
			});
		}
	});

program
	.command('*')
	.description('File to build')
	.action( function(env){
		build(env);
	});

program.parse(process.argv);


function build(file) {
	
	var mxmlc = "/Applications/Adobe Flash Builder 4.5/sdks/flex_sdk_4.6.0.23201B/bin/mxmlc";
	var output = Boolean(!program.releaseBuild) ? "bin/"+file+".swf" : "release/"+file+".swf"
	var args = ["-compiler.incremental=true",
				//"-compiler.include-libraries=libs",
				"-static-link-runtime-shared-libraries=true",
				"-debug="+Boolean(!program.releaseBuild),
				"-default-background-color=0xffffff",
				"-default-frame-rate=30",
				"-default-size=980,590",
				"-source-path="+nconf.get('sourcePath'),
				process.cwd()+"/"+file+".as",
				"-o="+output ]
	
	execFile(mxmlc,args,function(err,stdout,stderr){
		if(err){console.log(err);}
		console.log('Done!'.green);
		process.exit(0);
	})
};

//console.log(process.env);
if( ! nconf.get('sourceFile') ) {
	console.log('Run "init" first!'.red);
	process.exit(0);
}

//console.log("name: ",program.name);
//console.log(program.args[0]);

if( ! program.args[0] ) {
	console.log('build');
	build( nconf.get('sourceFile') );
}

//console.log('program.command', program );
//if(!src_file){
//	build(nconf.get('source-path'));
//}

