//var fs = require('fs');
var prompt = require('prompt');
var program = require('commander');
var execFile = require('child_process').execFile;
var nconf = require('nconf');

nconf.file({file:"mxmlc.properties"});

program
	.command('init')
	.action( function(env){

	});

program
	.command('run')
	.action( function(env){

		var mxmlc = "/Applications/Adobe Flash Builder 4.5/sdks/flex_sdk_4.6.0.23201B/bin/mxmlc";
		var args = ["-compiler.include-libraries=libs",
					"-compiler.incremental=true",
					"-static-link-runtime-shared-libraries=true",
					"-debug=true",
					"-default-background-color=0xffffff",
					"-default-frame-rate=30",
					"-default-size=980,590",
					"-source-path=src",
					process.cwd()+"/src/Main.as",
					"-o=bin/Main.swf" ]
		
		execFile(mxmlc,args,function(err,stdout,stderr){
			if(err){console.log('error: '+err);}
			console.log('Done!');
			process.exit(0);
		})

	});

program.parse(process.argv);