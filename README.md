# mxmlc

This app aims to simplify the Flex sdk and to give developers/designers another tool when it comes to compiling your Actionscript.

**Note**: The current version is my first atempt at creating node package. 

## Installation

### Install Flex SDK first

You don't need Flex, just the SDK.  You can download the Flex SDK at <http://opensource.adobe.com/wiki/display/flexsdk/>

### Install mxmlc

It is recommended to install mxmlc as a global module, so that you can call it from any path on your computer.

    $ [sudo] npm install mxmlc -g

## Uage

Specify the input FLV file and the optional output directory.

    Usage: mxmlc [options]

    Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -f, --file <path>  FLV file path
    -o, --out [path]   Output directory

