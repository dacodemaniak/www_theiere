/**
 * 
 */
var path = require('path');
var webpack = require('webpack');

 module.exports = {
     entry: './app.ts',
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'bundle.js'
     },
     module: {
         rules: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             },
             {
                 test: /\.tsx?$/,
                 use: 'ts-loader',
                 exclude: /node_modules/
             }            
         ]
     },
     resolve: {
    	 extensions: [
    		 '.ts',
    		 '.js',
    		 '.tsx'
    	 ]
     },
     devtool: 'source-map',

 };