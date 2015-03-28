var drawglyph=function(ids,size) {

 var canvas = document.getElementById("canvas");
 var ctx = canvas.getContext("2d");
 
 var kage = new Kage();
 kage.kUseCurve = false;
 var polygons = new Polygons();
 
 var partframes=drawdgg(ids,size);

 var idsframe="";
 for (var i=0;i<partframes.length;i++) {
 	var P=partframes[i];
 	kage.kBuhin.push(P.part,glypheme[P.part]);
 	idsframe+="99:0:0:"+P.x+":"+P.y+":"+(P.w+P.x)+":"+(P.h+P.y)+":"+P.part;
 	if (i<partframes.length-1) idsframe+="$";
 }
 
 kage.kBuhin.push("ids", idsframe);

 kage.makeGlyph(polygons, "ids");
 
 //clear canvas
 ctx.fillStyle = "rgb(255, 255, 255)";
 ctx.fillRect(0,0,size,size);


 ctx.fillStyle = "rgb(0, 0, 0)";
 
 for(var i = 0; i < polygons.array.length; i++){
  ctx.beginPath();
  ctx.moveTo(polygons.array[i].array[0].x, polygons.array[i].array[0].y);
  for(var j = 1; j < polygons.array[i].array.length; j++){
   ctx.lineTo(polygons.array[i].array[j].x, polygons.array[i].array[j].y);
  }
  ctx.closePath();
  ctx.fill();
 }
}
window.drawglyph=drawglyph;