const path=require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports={
	mode:"development",
	entry: {
		index:'./js/index.js'
	},
	output:{
		path: path.resolve(__dirname, "./dist") ,
		filename: '[name].js'
	},
	 optimization: {
	    splitChunks: {
	       	cacheGroups: {
	       		vendors:{
	        		name: 'vendors-index',
			        test: /\.js$/,
			        chunks: 'all',
			        enforce: true,
	        	},
	        	styles: {
		          	name: 'styles',
			        test: /\.(scss|css)$/,
			        chunks: 'all',
			        enforce: true,
	        	}
	    
      		},
	    },
	 },
	devServer:{
		contentBase: './dist'
	},
	plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css' ,
    }),
 	 ],
	module:{
		rules:[
	
			{
	            test: /\.(scss|css)$/,
	            use: [
					{
	            		 loader: MiniCssExtractPlugin.loader,
			 
		            	
		            },{
			          loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
			      	}, {
			          loader: "sass-loader" // 将 Sass 编译成 CSS
			      	}
	            ]
        	},
		
			{
		      	test: /\.js$/,
		     	exclude: /(node_modules|bower_components)/,
		      	use: {
		        loader: 'babel-loader',
		        options: {
		          presets: ['@babel/preset-env']
		        }
		      }
		    },
		    {
		         test: /\.(png|jpg|gif)$/,
		        use: [{
		          loader:'file-loader',
		          options:{
		          	name: '[name].[ext]',
		          	outputPath:'img/'
		          }
		          	}
		         ]
		    },
		     {
		         test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
		        use: [{
		          loader:'file-loader',
		          options:{
		          	name: '[name].[ext]',
		          	outputPath:'font/'
		          }
		          	}
		         ]
		    }
		]
	}
}