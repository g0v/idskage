/*
A very naive implementation , calculate part frame from IDS 

yapcheahshen@gmail.com at MOEDICT 萌典松 2015/3/28

*/

  //返回組字符所需的部件
  var getOperandByIDC=function(c) {	
    if (c==0x2ff2||c==0x2ff3) return 3;  //三元組字符
    else if (c>=0x2ff0 && c<=0x2fff) return 2; //二元組字符
    else return 0;
  }
  //全字框, 以小數表示。
  var fullframe=function(){
    return {x1:0,y1:0,x2:1,y2:1} 
  };
  
 //根據組字符，產生字框，part 為第幾個部件。
 //sorry AU, 這是很naive 的implementation
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
  
  //可遞迴的算框
  var fitparts=function(parent,frame) {
	var idc=parent["ch"].charCodeAt(0);
	var operand=getOperandByIDC(idc);
	var i=1;
  	while (operand>0) {
  	  f=framebypart(idc,frame,i-1);
  	  var child=parent["p"+i];  //中間代號
  	  op=isIDC(child["ch"].charCodeAt(0));
  	  if (op>0) fitparts(child, f);//又踫到 IDC，遞迴
  	  else child.frame=f;
  	  i++;operand--;
  	}
  }
  var idstree={};//a tree to hold IDS

  var addchild=function (ids,parent,frame)   {
  	var idc=ids.charCodeAt(0);
  	var operand=getOperandByIDC(idc);

    if (!operand) {
      var childids=decompose[ids[0]];
      if (childids) {
        return addchild(childids,parent,frame);
      }
    }
  	parent.ch=ids[0];
    ids=ids.substring(1,ids.length);
    var i=1;
    while (operand>0) {
	op=getOperandByIDC(ids.charCodeAt(0));
	var f=framebypart(idc,frame,i-1);
	// 產生一個中間代號
        var child=parent["p"+i]={"ch":ids[0]}; 
	if (op>0) {//IDC
	  ids=addchild(ids,child,f);
	  fitparts(child, f);
      	} else { //normal characters
          if (glypheme[ids[0]]) { //it is a part
            //這裡有點問題
        } else { //try IDS
          childids=decompose[ids[0]]; //看看這個部件是否有 IDS
          ids=addchild(childids,child,f); //遞迴組字
        }

        ids=ids.substring(1,ids.length); // consume first char
        child.frame=f;
	}
		i++;operand--;
	  }
	  return ids;
  }

  var drawparts=function(output,parent, x,y,w,h) {
  	var idc=parent.ch.charCodeAt(0);
  	var operand=getOperandByIDC(idc);
  	var i=1;
  	while (operand>0) {
  		var child=parent["p"+i];
  		op=getOperandByIDC(child.ch.charCodeAt(0));
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
  var drawdgg=function(ids) {
  	addchild(ids,idstree,fullframe());
    var output=[];
    drawparts(output,idstree, 0,0,200,200); //glyphwiki max frame
    return output;
  }
  window.drawdgg=drawdgg;
