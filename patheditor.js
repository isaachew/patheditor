let canv=document.getElementById("canvas")
let context=canv.getContext("2d")
var dpr=window.devicePixelRatio
canv.width=600*dpr
canv.height=600*dpr
canv.style.width="600px"
context.scale(dpr,dpr)

let view={topleft:[-300,-300],scale:1}
let grprec=.1



let grid=document.createElement("canvas")
grid.width=100
grid.height=100
let gctx=grid.getContext("2d")
gctx.strokeRect(0,0,100,100)
var gpatt=context.createPattern(grid,"repeat")


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
let cpath=pto("M-250 0L-200 0")
//cpath=pto("M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z")
let curpath
//Smooth Bezier curve has a controls point opposite of the previous
//Paths are delimited by moveTo or closePath or both (moveTo starts a subpath)
function draw(){
    context.save()
    context.clearRect(0,0,600,600)
    context.scale(view.scale,view.scale)
    context.translate(-view.topleft[0],-view.topleft[1])
    var spot=.2**Math.floor(Math.log(view.scale)/Math.log(5))
    
    context.fillStyle=gpatt
    context.fillRect(view.topleft[0],view.topleft[1],600/view.scale,600/view.scale)
    
    /*
    context.fillStyle="#ccc"
    context.font="10px serif"
    context.fillText("d",0,0)
    */
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
}
rtn=(n,r)=>r?Math.round(n/r)*r:n
let subpath,selected=null,mousestate=false
let ctool="line"
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

document.getElementById("canvwrapper").addEventListener("keydown",e=>{cpath[0].pop();draw()},{passive:true})

document.getElementById("pathtxt").addEventListener("input",e=>{
    cpath=pto(e.target.value)
    selected=null
    draw()
    
    
    
    
})

draw()


