let canv=document.getElementById("canvas")
let context=canv.getContext("2d")

let view={topleft:[-10,-10],scale:45,width:600,height:600}
var dpr=window.devicePixelRatio

let grprec=1e-5



let grid=document.createElement("canvas")
grid.width=100
grid.height=100
let gctx=grid.getContext("2d")
gctx.strokeRect(0,0,100,100)
var gpatt=context.createPattern(grid,"repeat")
function resizeCanvas(wid,hei){
    view.width=wid
    view.height=hei
    canv.width=view.width*dpr
    canv.height=view.height*dpr
    canv.style.width=view.width+"px"
    canv.style.height=view.height+"px"
    context.setTransform(dpr,0,0,dpr,0,0)
}
/*
function tocc(path){
    let cst=""
    for(i of path){
        cst+=`ctx.moveTo(${i.start})\n`
        for(j of i){
            switch(j.type){
                case "line":cst+=`ctx.lineTo(${j.to})\n`
                break
                case "bezier":cst+=`ctx.bezierCurveTo(${j.controls},${j.to})\n`
                break
                case "quadratic":cst+=`ctx.quadraticCurveTo(${j.control},${j.to})\n`
                break
            
            
            
            }    
        }
        if(cst.closed)cst+="ctx.closePath()\n"
    }
    return cst
}
console.log(0)
*/
let cpath=pto("M-250 0L-200 0")
cpath=pto("M3.472-.845V-3.149C3.2614-4.6612 1.9479-4.4994 1.5398-3.751S1.1061-1.8406 1.5695-1.0451 2.9828-.2265 3.472-.845M4.9692-.586C4.3047-.3092 4.304-.8216 4.291-1.0477L4.2769-6.9428H4.0571L2.7215-6.4 2.7861-6.228C3.5168-6.5171 3.4313-5.9436 3.4598-5.7443V-4.2301C2.3034-5.2621.6854-4.0487.4284-2.7996.2831-2.0346.186-.2199 1.8705.1145 2.6486.2517 3.1213-.1226 3.472-.4935L3.4711.1322H3.6974L5.0244-.4157Z")
let curpath
//Smooth Bezier curve has a controls point opposite of the previous
//Paths are delimited by moveTo or closePath or both (moveTo starts a subpath)
function draw(){
    context.save()
    context.clearRect(0,0,view.width,view.height)
    context.scale(view.scale,view.scale)
    context.translate(-view.topleft[0],-view.topleft[1])
    var spot=.2**Math.floor(Math.log(view.scale)/Math.log(5))
    
    context.fillStyle=gpatt
    context.fillRect(view.topleft[0],view.topleft[1],view.width/view.scale,view.height/view.scale)
    /*
    context.fillStyle="#ccc"
    context.font="10px Times New Roman"
    context.fillText("d",0,0)
    //*/
    context.fillStyle="red"
    context.strokeStyle="#bbb"
    context.lineWidth=3/view.scale
    function drawpoint(x,y){context.fillRect(x-2.5/view.scale,y-2.5/view.scale,5/view.scale,5/view.scale)}
    for(i of cpath){
        let lp=i.start
        drawpoint(...i.start)
        for(j of i){
            drawpoint(...j.to)
            if(j.type=="bezier"){
                context.beginPath()
                context.moveTo(...lp)
                context.lineTo(...j.controls[0])
                context.moveTo(...j.controls[1])
                context.lineTo(...j.to)
                context.stroke()
                drawpoint(...j.controls[0])
                
                drawpoint(...j.controls[1])
            }else if(j.type=="quadratic"){
                context.beginPath()
                context.moveTo(...lp)
                context.lineTo(...j.control)
                context.lineTo(...j.to)
                context.stroke()
                drawpoint(...j.control)
                
                
                
            }
            //context.fillRect(j.controls[0][0]-2.5,j.controls[0][1]-2.5,5,5)
            //context.fillRect(j.controls[1][0]-2.5,j.controls[1][1]-2.5,5,5)
            lp=j.to
        }
        
        
    }
    context.fillStyle="#0f0"
    if(selected)drawpoint(...cpath[selected.subpath].start)
    context.strokeStyle="black"
    pth=new Path2D(otp(cpath))
    context.lineWidth=1.5/view.scale
    context.stroke(pth)
    context.restore()
    document.getElementById("pathtxt").value=otp(cpath)
    document.getElementById("scale").textContent=view.width/view.scale
}
rtn=(n,r)=>r?Math.round(n/r)*r:n
let subpath,selected=null,mousestate=false
let ctool;
function getmxy(ev){return [ev.offsetX/view.scale+view.topleft[0],ev.offsetY/view.scale+view.topleft[1]]}
canv.addEventListener("mousedown",e=>{
    selected=null;
    [mcx,mcy]=getmxy(e)
    mousestate=1
    
    let subpath=cpath[0]
    var lcmd=subpath[subpath.length-1]
    var lc=subpath.length?lcmd.to:subpath.start
    var lastControl=subpath.length?lcmd.type=="bezier"?lcmd.controls[1]:lcmd.type=="quadratic"?lcmd.control:lc:lc
    nearpoint=(a,b=[mcx,mcy])=>Math.hypot(a[0]-b[0],a[1]-b[1])<20/view.scale
    for(i=0;i<cpath.length;i++){
        for(j=0;j<cpath[i].length;j++){
            let pcmd=cpath[i][j]
            var sels
            switch(pcmd.type){
                case "bezier":sels={c1:pcmd.controls[0],c2:pcmd.controls[1]}
                break
                case "quadratic":sels={control:pcmd.control}
                break
                case "line":sels={}
            }
            for(var sel in sels){
                if(nearpoint(sels[sel]))selected={subpath:i,command:j,selection:sel}
            }
            if(nearpoint(pcmd.to))selected={subpath:i,command:j,selection:"to"}
        }
        if(nearpoint(cpath[i].start))selected={subpath:i,command:"start"}
    }
    if(selected)ctool=null
    draw()
})
canv.addEventListener("mousemove",e=>{
    [mcx,mcy]=getmxy(e)
    mcx=rtn(mcx,grprec)
    mcy=rtn(mcy,grprec)
    if(mousestate==1){
        if(selected){
            
            let subpath=cpath[selected.subpath]
            if(selected.command=="start")subpath.start=[mcx,mcy]
            else{
                var lcmd=subpath[selected.command]
                switch(selected.selection){
                    case "c1":lcmd.controls[0]=[mcx,mcy]
                    break
                    case "c2":lcmd.controls[1]=[mcx,mcy]
                    break
                    case "control":lcmd.control=[mcx,mcy]
                    break
                    case "to":lcmd.to=[mcx,mcy]
                    break
                }
        }
        }else mousestate=2
    }
    if(mousestate==2){
        view.topleft[0]-=e.movementX/view.scale
        view.topleft[1]-=e.movementY/view.scale
    }
    document.getElementById("coords").textContent="Coordinates: ("+[mcx,mcy]+")"
    draw()
})

canv.addEventListener("mouseup",e=>{
    [mcx,mcy]=getmxy(e)
    
    let subpath=cpath[0]
    var lcmd=subpath[subpath.length-1]
    var lastPoint=subpath.length?lcmd.to:subpath.start
    var lastControl=subpath.length?lcmd.type=="bezier"?lcmd.controls[1]:lcmd.type=="quadratic"?lcmd.control:lastPoint:lastPoint
    
    if(!selected&&mousestate==1){
        switch(ctool){
            case "line":subpath.push({type:"line",to:[mcx,mcy]})
            break
            case "bezier":subpath.push({type:"bezier",controls:[[2*lastPoint[0]-lastControl[0],2*lastPoint[1]-lastControl[1]],[mcx,mcy]],to:[mcx,mcy]})
            break
            case "quadratic":
            subpath.push({type:"quadratic",control:[2*lastPoint[0]-lastControl[0],2*lastPoint[1]-lastControl[1]],to:[mcx,mcy]})
        }
    }
    mousestate=0
    draw()
})

canv.addEventListener("wheel",e=>{
    console.log("delta "+e.deltaY)
    let sf=1.001**e.deltaY
    let tldc=[e.offsetX/view.scale*(1-sf),e.offsetY/view.scale*(1-sf)]
    view.topleft[0]+=tldc[0]
    view.topleft[1]+=tldc[1]
    view.scale/=sf
    
    draw()
    
    

    
    
    
},{passive:true})

addEventListener("resize",e=>{
    console.log(innerWidth,innerHeight)
    resizeCanvas(innerHeight,innerHeight)
    draw()
    
    
    
})

document.getElementById("canvwrapper").addEventListener("keydown",e=>{
    if(e.key=="Delete")cpath[0].pop()
    draw()
},{passive:true})

document.getElementById("pathtxt").addEventListener("input",e=>{
    cpath=pto(e.target.value)
    selected=null
    draw()
    
    
    
    
})

resizeCanvas(900,900)
draw()

