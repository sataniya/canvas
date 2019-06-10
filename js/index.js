import '../scss/index.scss';
import $ from 'jquery';
import { createTopbar } from "./topbar";

const data=createTopbar();

const canvas=$("#mycanvas");
var canvasWidth=window.innerWidth;
var canvasHeight=window.innerHeight;
canvas.attr("width",canvasWidth);
canvas.attr("height",canvasHeight);

var ctx=canvas[0].getContext("2d");

function canvasInit(){
	ctx.fillStyle="#fff";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	pushImgData();
}

function clearCanvas(){
	$(".clear .iconfont").click(canvasInit);
}


var draw=false;

function setStyles(){
	switch(data.tool){
		case "pencil":
			ctx.strokeStyle=data.mainColor;
			ctx.lineWidth=data.pencilSize;
			ctx.lineJoin="round";
			ctx.lineCap="round";
			break;
		case "eraser":
			ctx.strokeStyle="#fff";
			ctx.lineWidth=data.eraserSize;
			ctx.lineJoin="round";
			ctx.lineCap="round";
			break;
		default:
			let bold="",
				italic="";
			if(data.bold) bold="bold";
			if(data.italic) italic="italic";
			ctx.fillStyle=data.mainColor;
			ctx.font=italic+" "+bold+" "+data.textSize+"px "+data.textFamily;
			if(data.underline)
				ctx.strokeStyle=data.mainColor;
				ctx.lineWidth=data.textSize/16;
	}
}

function drawWays(data,x,y){
	switch(data.tool){
		case "pencil":  	
			ctx.lineTo(x,y);
			ctx.stroke();	
			break;
		case "eraser": 
			ctx.lineTo(x,y);
			ctx.stroke();	
			break;
	}
}
function drawText(x,y){
	const input=$("<input type='text' />");
	input.css({
		"position":"absolute",
		"left":x+"px",
		"top":y+"px",
		"border":"1px dashed #666"
	})
	$("body").append(input);
	setTimeout(function(){
		input.focus();
	},50);
	input.keydown(function(event){
		if(event.which===13)
			completeDraw($(this));
	})
	input.blur(function(){
			completeDraw($(this))
	});
	function completeDraw(input){
		setStyles();
		if(data.underline){
			ctx.moveTo(x,y+data.textSize/4*5);
			let len=0;
			let reg=/[\u4e00-\u9fa5]/;
			for( let item of input.val())
				if(reg.test(item))
					len+=2;
				else len++;
			ctx.lineTo(x+len*data.textSize/2,y+data.textSize/4*5);
		}
		ctx.fillText(input.val(),x,y+data.textSize);
		ctx.stroke();
		if(input.val()!="")
			pushImgData();
		input.remove();
	}
}
const history={
	img:[],
	step:-1
};
function startDraw(e){
	draw=true;		//绘画
	let x=e.offsetX, //鼠标位置
		y=e.offsetY;
	ctx.beginPath();
	ctx.save();
	setStyles(); //设置样式
	if(data.tool==="text"&&$("input").length===0)
		drawText(x,y); //绘画文字
	else{
			drawWays(data,x,y); //绘画线条和橡皮
			canvas.mousemove(moveDraw); //鼠标移动
		}
}
function moveDraw(e){
	if(draw===true){
		let x=e.offsetX,
			y=e.offsetY;
		drawWays(data,x,y); //绘画线条或橡皮
	}
}
function endDraw(e){
	draw=false; //不画
	ctx.restore();
	ctx.closePath();
	if(data.tool!=="text"){
		pushImgData();
	}
}
function pushImgData(){
	if(history.step<history.img.length-1)
		history.img.splice(history.step+1,history.img.length-history.step+1);
		let imgData=ctx.getImageData(0,0,canvasWidth,canvasHeight);
		history.img.push(imgData);
		if(history.img.length>10)
			history.img.splice(0,1);
		else
			history.step++;
}

function head(){
	$(".history .iconfont:eq(1)").click(function(){
		if(history.step<history.img.length-1){
		history.step++;
		ctx.putImageData(history.img[history.step],0,0);
		}
	});
}
function back(){
	$(".history .iconfont:eq(0)").click(function(){
		if(history.step>-1){
			history.step--;
			if(history.step!==-1)
				ctx.putImageData(history.img[history.step],0,0);
			else
				canvasInit();
		}
	});
}

function saveAsPic(){
	$(".saveAsPic .iconfont").click(function(){
		let img=canvas[0].toDataURL("image/png");
		let a=document.createElement("a");
		a.href=img;
		a.download='未命名.png';
		a.click();
	}) 
}

function run(){
	canvasInit();
	canvas.mousedown(startDraw);//绘画开始
	canvas.mouseup(endDraw);//绘画结束
	clearCanvas();//监听清除canvas事件
	head();//历史纪录 前进
	back();//历史纪录 后退
	saveAsPic();//保存图片
}
run();
