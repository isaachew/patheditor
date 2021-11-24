let canv=document.getElementById("canvas")
let context=canv.getContext("2d")

let view={topleft:[-70000,-70000],scale:.005,width:600,height:600}
let fill=false
let fillrule=false//false = nonzero, true = evenodd
var dpr=window.devicePixelRatio

let grprec=1e-5



let grid=document.createElement("canvas")
grid.width=100
grid.height=100
let gctx=grid.getContext("2d")
gctx.strokeRect(0,0,100,100)
var gpatt=context.createPattern(grid,"repeat")
gpatt.setTransform(new DOMMatrix([100,0,0,100,0,0]))
function resizeCanvas(wid,hei){
    view.width=wid
    view.height=hei
    canv.width=wid*dpr
    canv.height=hei*dpr
    canv.style.width=wid+"px"
    canv.style.height=hei+"px"
    //document.getElementById("canvwrapper").style.width=wid+"px"
    context.setTransform(dpr,0,0,dpr,0,0)

    updatetext()
}

let curpath=toObject("M-250 0L-200 0")
curpath=toObject("M-44242.0195-238.2052C-44242.0195-24627.09975-24470.91405-44398.2052-82.0195-44398.2052V-44398.2052C11629.94069-44398.2052 22862.20948-39745.64713 31143.81596-31464.04066S44077.9805-11950.16539 44077.9805-238.2052V-238.2052C44077.9805 24150.68935 24306.87505 43921.7948-82.0195 43921.7948V43921.7948C-24470.91405 43921.7948-44242.0195 24150.68935-44242.0195-238.2052ZM11090.9918-43096 92122.68361-28652.75694 92011.29999 28176.75694 10922.9918 42620ZM89846.7253-20894.342C89846.7253-24294.20692 87090.59022-27050.342 83690.7253-27050.342 82058.05259-27050.342 80492.2499-26401.76529 79337.77596-25247.29134S77534.7253-22527.01471 77534.7253-20894.342C77534.7253-17494.47708 80290.86038-14738.342 83690.7253-14738.342S89846.7253-17494.47708 89846.7253-20894.342ZM89846.7253-238.8077C89846.7253-3638.67262 87090.59022-6394.8077 83690.7253-6394.8077 82058.05259-6394.8077 80492.2499-5746.23099 79337.77596-4591.75704S77534.7253-1871.48041 77534.7253-238.8077C77534.7253 3161.05722 80290.86038 5917.1923 83690.7253 5917.1923S89846.7253 3161.05722 89846.7253-238.8077ZM74115.871-10711.8363C74115.871-14111.70122 71359.73592-16867.8363 67959.871-16867.8363 66327.19829-16867.8363 64761.3956-16219.25959 63606.92166-15064.78564S61803.871-12344.50901 61803.871-10711.8363C61803.871-7311.97138 64560.00608-4555.8363 67959.871-4555.8363S74115.871-7311.97138 74115.871-10711.8363ZM74115.871 9943.698C74115.871 6543.83308 71359.73592 3787.698 67959.871 3787.698 66327.19829 3787.698 64761.3956 4436.27471 63606.92166 5590.74866S61803.871 8311.02529 61803.871 9943.698C61803.871 13343.56292 64560.00608 16099.698 67959.871 16099.698S74115.871 13343.56292 74115.871 9943.698ZM57216.8744-20894.342C57216.8744-24294.20692 54460.73932-27050.342 51060.8744-27050.342 49428.20169-27050.342 47862.399-26401.76529 46707.92506-25247.29134S44904.8744-22527.01471 44904.8744-20894.342C44904.8744-17494.47708 47661.00948-14738.342 51060.8744-14738.342S57216.8744-17494.47708 57216.8744-20894.342ZM89846.7253 20416.7266C89846.7253 17016.86168 87090.59022 14260.7266 83690.7253 14260.7266 82058.05259 14260.7266 80492.2499 14909.30331 79337.77596 16063.77726S77534.7253 18784.05389 77534.7253 20416.7266C77534.7253 23816.59152 80290.86038 26572.7266 83690.7253 26572.7266S89846.7253 23816.59152 89846.7253 20416.7266ZM57216.8744-238.8077C57216.8744-3638.67262 54460.73932-6394.8077 51060.8744-6394.8077 49428.20169-6394.8077 47862.399-5746.23099 46707.92506-4591.75704S44904.8744-1871.48041 44904.8744-238.8077C44904.8744 3161.05722 47661.00948 5917.1923 51060.8744 5917.1923S57216.8744 3161.05722 57216.8744-238.8077ZM57216.8744-238.8077C57216.8744 3161.05722 54460.73932 5917.1923 51060.8744 5917.1923 49428.20169 5917.1923 47862.399 5268.61559 46707.92506 4114.14164S44904.8744 1393.86501 44904.8744-238.8077C44904.8744-3638.67262 47661.00948-6394.8077 51060.8744-6394.8077S57216.8744-3638.67262 57216.8744-238.8077ZM44904.8744 20416.7266C44904.8744 23816.59152 47661.00948 26572.7266 51060.8744 26572.7266 52693.54711 26572.7266 54259.3498 25924.14989 55413.82374 24769.67594S57216.8744 22049.39931 57216.8744 20416.7266C57216.8744 17016.86168 54460.73932 14260.7266 51060.8744 14260.7266S44904.8744 17016.86168 44904.8744 20416.7266ZM-16024.3479 15702.5792C-7219.82442 24507.10268 7055.12862 24507.10268 15859.6521 15702.5792 22377.91078 9184.32052 30100.42814 3870.32052 39027.20418-239.4208 30100.42814-4349.16212 22377.91078-9663.16212 15859.6521-16181.4208 7055.12862-24985.94428-7219.82442-24985.94428-16024.3479-16181.4208S-24828.87138 6898.05572-16024.3479 15702.5792Z")
//Smooth Bezier curve has a control point opposite of the previous
//Paths are delimited by moveTo or closePath or both (moveTo starts a subpath)

function updatetext(){

    document.getElementById("pathtxt").value=toPath(curpath)
    document.getElementById("scale").textContent=view.width/view.scale
    let sel=getselection()
    if(sel){
        document.getElementById("px").value=sel[0]
        document.getElementById("py").value=sel[1]
    }


}
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
    context.strokeStyle="black"
    context.fillStyle="lime"
    pth=new Path2D(toPath(curpath))
    context.lineWidth=1.5/view.scale
    if(fill)context.fill(pth,fillrule?"evenodd":"nonzero")
    context.stroke(pth)

    context.fillStyle="red"
    context.strokeStyle="#bbb"
    context.lineWidth=3/view.scale
    function drawpoint(x,y){
        context.beginPath()
        context.arc(x,y,3/view.scale,0,7)
        context.fill()
    }
    for(let i of curpath){
        let lp=i.start
        drawpoint(...i.start)
        for(j of i){
            drawpoint(...j.to)
            if(j.type=="bezier"){
                context.beginPath()
                context.moveTo(...lp)
                context.lineTo(...j.c1)
                context.moveTo(...j.c2)
                context.lineTo(...j.to)
                context.stroke()
                drawpoint(...j.c1)

                drawpoint(...j.c2)
            }else if(j.type=="quadratic"){
                context.beginPath()
                context.moveTo(...lp)
                context.lineTo(...j.control)
                context.lineTo(...j.to)
                context.stroke()
                drawpoint(...j.control)



            }
            //context.fillRect(j.c1[0]-2.5,j.c1[1]-2.5,5,5)
            //context.fillRect(j.c2[0]-2.5,j.c2[1]-2.5,5,5)
            lp=j.to
        }


    }
    context.fillStyle="#0f0"
    if(!selected.selection){
        var p2d=new Path2D(toPath([curpath[selected.subpath]]))
        context.strokeStyle="#000"
        context.stroke(p2d)
    }
    context.fillStyle="#07f"
    if(curpath[selected.subpath].length)drawpoint(...curpath[selected.subpath][curpath[selected.subpath].length-1].to)


    context.fillStyle="#f70"
    drawpoint(...curpath[selected.subpath].start)

    context.restore()
    updatetext()

}
function subpaths(){
    document.getElementById("subpaths").innerHTML=""
    for(var i=0;i<curpath.length;i++){
        var dv=document.createElement("div")
        dv.className="subpathlist"
        dv.id="subp"+i
        dv.addEventListener("click",function(){
            selected={subpath:+this.id.slice(4)}
            cfsels()
            draw()
        })
        var spn=document.createElement("span")
        spn.append("Subpath "+-~i)
        dv.append(spn)
        document.getElementById("subpaths").append(dv)
    }
}
function cfsels(){
    //document.getElementById("commands").textContent=JSON.stringify(selected)

    subpaths()
    document.getElementById("subp"+selected.subpath).classList.add("selected")


}

let subpath,selected={subpath:0}
let mousestate=0
/*
0: None
1: Mouse down
2: Panning
3: Dragging selected point
*/
let ctool;
function getmxy(ev){return [ev.offsetX/view.scale+view.topleft[0],ev.offsetY/view.scale+view.topleft[1]]}
function getselection(){
    if(selected.selection=="start"){
        return curpath[selected.subpath].start
    }else if(selected.selection){
        return curpath[selected.subpath][selected.command][selected.selection]
    }else return null
}
canv.addEventListener("mousedown",e=>{
    //selected={subpath:selected.subpath};
    [mcx,mcy]=getmxy(e)
    mousestate=1

    let subpath=curpath[selected.subpath]
    var lcmd=subpath[subpath.length-1]
    var lc=subpath.length?lcmd.to:subpath.start
    var lastControl=subpath.length?lcmd.type=="bezier"?lcmd.c2:lcmd.type=="quadratic"?lcmd.control:lc:lc
    nearpoint=(a,b=[mcx,mcy])=>Math.hypot(a[0]-b[0],a[1]-b[1])<=7.5/view.scale
    //Determine selection
    for(i=0;i<curpath.length;i++){
        for(j=0;j<curpath[i].length;j++){
            let pcmd=curpath[i][j]
            var sels
            switch(pcmd.type){
                case "bezier":sels=["c1","c2"]
                break
                case "quadratic":sels=["control"]
                break
                case "line":
                case "arc":sels=[]
            }
            for(var sel of sels){
                if(nearpoint(pcmd[sel])){
                    selected={subpath:i,command:j,selection:sel}
                    mousestate=3
                }
            }
            if(nearpoint(pcmd.to)){
                selected={subpath:i,command:j,selection:"to"}
                mousestate=3
            }
        }
        if(nearpoint(curpath[i].start)){
            selected={subpath:i,selection:"start"}
            mousestate=3
        }
    }
    if(mousestate==3)ctool=null
    draw()
    cfsels()
})
canv.addEventListener("mousemove",e=>{
    [mcx,mcy]=getmxy(e)
    mcx=roundNum(mcx,grprec)
    mcy=roundNum(mcy,grprec)
    if(mousestate==1){
        mousestate=2
    }
    if(mousestate==2){
        view.topleft[0]-=e.movementX/view.scale
        view.topleft[1]-=e.movementY/view.scale
    }
    if(mousestate==3){
        let subpath=curpath[selected.subpath]
            if(selected.selection=="start")subpath.start=[mcx,mcy]
            else{
                var lcmd=subpath[selected.command]
                lcmd[selected.selection]=[mcx,mcy]
            }
    }
    document.getElementById("coords").textContent="Coordinates: ("+[mcx,mcy]+")"
    draw()
})

canv.addEventListener("click",e=>{
    [mcx,mcy]=getmxy(e)

    let subpath=curpath[selected.subpath]
    var lcmd=subpath[selected.command||0]
    var lastPoint=subpath.length?lcmd.to:subpath.start
    var lastControl=subpath.length?lcmd.type=="bezier"?lcmd.c2:lcmd.type=="quadratic"?lcmd.control:lastPoint:lastPoint
    console.log(mousestate)
    if(mousestate==1){
        var ncmd
        switch(ctool){
            case "line":ncmd={type:"line",to:[mcx,mcy]}
            break
            case "bezier":ncmd={type:"bezier",c1:[2*lastPoint[0]-lastControl[0],2*lastPoint[1]-lastControl[1]],c2:[mcx,mcy],to:[mcx,mcy]}
            break
            case "quadratic":ncmd={type:"quadratic",control:[2*lastPoint[0]-lastControl[0],2*lastPoint[1]-lastControl[1]],to:[mcx,mcy]}
        }
        if(ncmd){
            subpath.splice(selected.command+1||0,0,ncmd)
            selected.command=selected.command+1||0
        }
    }
    if(!selected.selection){
        for(let i=0;i<curpath.length;i++){
            var p2d=new Path2D(toPath([curpath[i]]))
            context.lineWidth=10/view.scale
            if(context.isPointInStroke(p2d,mcx,mcy)){
                selected={subpath:i}

            }

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
    let canvwidth=innerWidth*2/3
    let canvheight=innerHeight
    resizeCanvas(canvwidth,canvheight)
    draw()



})

document.getElementById("canvwrapper").addEventListener("keydown",e=>{
    if(e.key=="Backspace"){
        if(curpath[selected.subpath].length){
            if(selected.selection=="start"){
                curpath[selected.subpath].start=curpath[selected.subpath][0].to
            }
            curpath[selected.subpath].splice(selected.command??0,1)
            if(selected.command){
                selected.command--
                selected.selection="to"
            }else selected.command="start"
        }else{
            curpath.splice(selected.subpath,1)
            selected={subpath:0}
        }
    }
    draw()
},{passive:true})

document.getElementById("pathtxt").addEventListener("input",e=>{
    curpath=toObject(e.target.value)
    selected={subpath:0}
    draw()
    cfsels()



})

document.getElementById("nonzero").addEventListener("input",e=>{
    fillrule=false
    draw()
})

document.getElementById("evenodd").addEventListener("input",e=>{
    fillrule=true
    draw()
})


document.getElementById("pclosed").addEventListener("input",e=>{
    curpath[selected.subpath].closed=e.target.checked
    draw()
})

document.getElementById("px").addEventListener("input",e=>{
    getselection()[0]=e.target.value
    draw()
})

document.getElementById("py").addEventListener("input",e=>{
    getselection()[1]=e.target.value
    draw()
})

document.getElementById("roundall").addEventListener("click",e=>{

roundPath(curpath,grprec)

})

resizeCanvas(innerWidth*2/3,innerHeight)
cfsels()
draw()
