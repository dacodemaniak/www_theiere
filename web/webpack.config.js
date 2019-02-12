/**
 * 
 */
var path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

 module.exports = {
     entry: './app.ts',
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'bundle.js'
     },
     optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin(
                {uglifyOptions: {
                    compress: {
                      arrows: false,
                      booleans: false,
                      cascade: false,
                      collapse_vars: false,
                      comparisons: false,
                      computed_props: false,
                      hoist_funs: false,
                      hoist_props: false,
                      hoist_vars: false,
                      if_return: false,
                      inline: false,
                      join_vars: false,
                      keep_infinity: true,
                      loops: false,
                      negate_iife: false,
                      properties: false,
                      reduce_funcs: false,
                      reduce_vars: false,
                      sequences: false,
                      side_effects: false,
                      switches: false,
                      top_retain: false,
                      toplevel: false,
                      typeofs: false,
                      unused: false,
                
                      // Switch off all types of compression except those needed to convince
                      // react-devtools that we're using a production build
                      conditionals: true,
                      dead_code: true,
                      evaluate: true,
                    },
                    mangle: true,
                  },
                }
            )
        ]
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
     devtool: 'source-map'

 };