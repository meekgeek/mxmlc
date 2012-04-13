# mxmlc

This app aims to simplify the Flex sdk and to give developers/designers another tool when it comes to compiling your Actionscript.

**Note**: The current version is my first atempt at creating node package. 

## Installation

### Install Flex SDK first

You don't need Flex, just the SDK.  You can download the Flex SDK at <http://opensource.adobe.com/wiki/display/flexsdk/>

### Install mxmlc

It is recommended to install mxmlc as a global module, so that you can call it from any path on your computer.

    $ [sudo] npm install mxmlc -g

## Usage

Specify the input Actionscript file and the optional output directory.

	Usage: index.js [options] [command]
	
	Commands:

    	init 
    	Initializes and creates the mxmlc.properties file.
    	
    	run 

	Options:

    	-h, --help           output usage information
    	-V, --version        output the version number
    	-r, --release-build  Create a release build

