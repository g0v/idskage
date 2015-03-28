/*
A very naive implementation , calculate part frame from IDS 

yapcheahshen@gmail.com at MOEDICT 萌典松 2015/3/28

*/


  var isIDC=function(c) {	
    if (c==0x2ff2||c==0x2ff3) return 3;
    else if (c>=0x2ff0 && c<=0x2fff) return 2;
    else return 0;
  }
  
  var fullframe=function(){
    return {x1:0,y1:0,x2:1,y2:1} 
  };
  
  //TODO others IDC, read matrix from 
  var framebypart=function (idc,frame,part) {
      var f={};
  	  switch (idc) {
  	  	  case 0x2ff0: //⿰
  	  	    if (0==part) {
  	  	    	f.x1=frame.x1;f.y1=frame.y1;
  	  	    	f.x2=(frame.x2-frame.x1)/2;f.y2=frame.y2;
  	  	    } else {
  	  	    	f.x1=(frame.x2-frame.x1)/2.5;f.y1=frame.y1;
  	  	    	f.x2=frame.x2;f.y2=frame.y2;
  	  	    }
  	  	  break;
  	  	  case 0x2ff1: //⿱
  	  	    if (0==part) {
  	  	    	f.x1=frame.x1;f.y1=frame.y1;
  	  	    	f.x2=frame.x2;f.y2=(frame.y2-frame.y1)/2;
  	  	    } else {
  	  	    	f.x1=frame.x1;f.y1=(frame.y2-frame.y1)/2.5;
  	  	    	f.x2=frame.x2;f.y2=frame.y2;
  	  	    }
  	  	  break;
  	  }
  	  return f;
  }
  function fitparts(parent,frame) {
	var idc=parent["ch"].charCodeAt(0);
	var operand=isIDC(idc);
	var i=1;
  	while (operand>0) {
  		f=framebypart(idc,frame,i-1);
  		var child=parent["p"+i];
  		op=isIDC(child["ch"].charCodeAt(0));
  		if (op>0) fitparts(child, f);
          else child.frame=f;
  		i++;operand--;
  	}
  }

  var idstree={};//a tree to hold IDS
//⿱⿰日月空 ==> {ch:"⿱" , 
//                 p1: { ch:"⿰", 
//                      p1:{ch:"日",frame:{0.0,0.5,0.0,0.5}},
//                      p2:{ch:"月",frame:{0.5,1.0,0.0,0.5}}},
//                 p2:{ch:"空",     frame:{0.0,1.0,0.5,1.0}}};
  
  function addchild(ids,parent,frame)   {
  	var idc=ids.charCodeAt(0);
  	var operand=isIDC(idc);
  	parent.ch=ids[0];
    ids=ids.substring(1,ids.length);
    var i=1;
    while (operand>0) {
		  op=isIDC(ids.charCodeAt(0));
		  var f=framebypart(idc,frame,i-1);
      var child=parent["p"+i]={"ch":ids[0]}; // create a new child
		  if (op>0) {//IDC
		    ids=addchild(ids,child,f);
		    fitparts(child, f);
      } else { //normal characters
        ids=ids.substring(1,ids.length); // consume first char
        child.frame=f;
      }
		  i++;operand--;
	 }
	 return ids;
  }

  var drawparts=function(output,parent, x,y,w,h) {
  	var idc=parent.ch.charCodeAt(0);
  	var operand=isIDC(idc);
  	var i=1;
  	while (operand>0) {
  		var child=parent["p"+i];
  		op=isIDC(child.ch.charCodeAt(0));
  		if (op>0) drawparts(output,child, x,y,w,h);
          else {
            var f=child.frame;
    	  	  var xr=f.x2-f.x1;
  		      var yr=f.y2-f.y1;
            //console.log(f)
            output.push({part:child.ch,x:f.x1*w,y:f.y1*h,w:w*xr,h:h*yr});
          }
  		i++;operand--;
  	}  	  

  }
  drawdgg=function(ids) {
  	addchild(ids,idstree,fullframe());
    var output=[];
    drawparts(output,idstree, 0,0,200,200); //glyphwiki max frame
    //console.log(output);
    return output;
  }
  window.drawdgg=drawdgg;
