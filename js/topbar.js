import $ from 'jquery';
import 'jquery-ui/ui/widgets/slider';
import 'jquery-ui/themes/base/slider.css';
import 'jquery-ui/themes/base/theme.css';
import './iconfont';

const data={
  tool: "pencil",
  mainColor: "#000",
  pencilSize: 1,
  eraserSize: 2,
  textFamily: "SimSun",
  textSize: 16,
  bold: false,
  italic: false,
  underline: false
};

function createSlider(slider,val){
  let size=0;
  $(slider).slider({
      orientation: "horizontal",
      range: "min",
      min: 1,
      max: 20,
      value: 1,
      slide:writeVal,
      change:writeVal
  });
  function writeVal(event,ui){
    $(val).html(ui.value);
    if(val==="#px")
      data.pencilSize=$(slider).slider("value");
    else 
      data.eraserSize=$(slider).slider("value");
  }
}

function createColorSilder(slider){
  $(slider).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 255,
      value: 0,
      slide:writeVal,
      change:writeVal
  });
  function writeVal(){
    let red=$("#red").slider("value"),
        green=$("#green").slider("value"),
        blue=$("#blue").slider("value");
    data.mainColor="rgb("+red+","+green+","+blue+")";
    $(".main-one .one-color").css("background-color", data.mainColor);
    $("#red-val").html(color(red));
    $("#green-val").html(color(green));
    $("#blue-val").html(color(blue));
    $("#red span").css("background-color","rgb("+red+",0,0)");
    $("#green span").css("background-color","rgb(0,"+green+",0)");
    $("#blue span").css("background-color","rgb(0,0,"+blue+")");
  }
  function color(c){
    let s="00"+c;
    return s.slice(s.length-3);
  }
}

function switchColorTool(){
  $(".switch-one:eq(0)").click(()=>{
    $(".color-list").removeClass("hide");
    $(".color-rgb").addClass("hide");
  });
  $(".switch-one:eq(1)").click(()=>{
   $(".color-list").addClass("hide");
    $(".color-rgb").removeClass("hide");
  });
  //tool
  const tools=["pencil","eraser","text"];
  $(".tool-list .list-one").click(function(){
    let index=$(this).data("index");
    data.tool=tools[parseInt(index)];
    $(".tool-attr .attr-one").each(function(){
      $(this).addClass("hide");
    })
    $(".tool-attr .attr-one:eq("+index+")").removeClass("hide");
    $(".tool-list .list-one").each(function(){
      $(this).removeClass("active");
    })
    $(this).addClass("active");

  })
}

function listColor(){
  let colors=[
  "#000000","#969696","#FF0000",
  "#FF7D00","#00E100","#7DFF7D",
  "#0000FF","#7D7DFF","#9932CC",

  "#646464","#C8C8C8","#FF007D",
  "#FF7D7D","#7DE100","#FFFF00",
  "#007DFF","#4682B4","#AFEEEE",

  "#7D7D7D","#FFFFFF","#FF00FF",
  "#FFB6C1","#00FF7D","#FFFF7D",
  "#1E90FF","#7D00FF","#00FFFF",
  ]
  $(".color-list .list-one .one-color").each(function(i,em){
    $(this).css("background-color",colors[i]);
  });
  $(".color-list .list-one").click(function(){
    data.mainColor=$(this).children(".one-color").css("background-color");
    $(".main-one .one-color").css("background-color",data.mainColor);
  });
}

function getFontfamily(){
  $("#fontfamily").change(function(){
    data.textFamily= $(this).val();
  })
}

function getFontsize(){
  $("#fontsize").change(function(){
    data.textSize= parseInt($(this).val());
  })
}

function getBIU(){
  $(".BIU").click(function(){
    $(this).toggleClass("active2");
    let index=$(this).data("index");
    if(index=="0")
      data.bold=!data.bold;
    if(index=="1")
      data.italic=!data.italic;
    if(index=="2")
      data.underline=!data.underline;
  })
}

const createTopbar=()=>{
  //颜色列表
  listColor();
  //pencil滑块
  createSlider("#pencilpx","#px");
  //text
  createSlider("#textsize","#size");
  //color
  createColorSilder("#red,#green,#blue");
  //切换工具
  switchColorTool();

  getFontfamily();

  getFontsize();

  getBIU();

  return data;
}
export {createTopbar};