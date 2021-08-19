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
    canv.width=view.width*dpr
    canv.height=view.height*dpr
    canv.style.width=view.width+"px"
    canv.style.height=view.height+"px"
    document.getElementById("canvwrapper").style.width=wid+"px"
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
let curpath=pto("M-250 0L-200 0")
curpath=pto("M-44242.0195-238.2051999999967C-44242.0195-24627.099752527833-24470.91405252785-44398.2052-82.0195000000167-44398.205200000004L-82.01950000000215-44398.2052C11629.940691314267-44398.2052 22862.209484932733-39745.64712946315 31143.81595719794-31464.040657197944S44077.98050000001-11950.165391314262 44077.98050000001-238.2051999999967H44077.9805C44077.9805 24150.689352527843 24306.875052527837 43921.7948-82.01949999999488 43921.7948H-82.01950000000215C-24470.914052527838 43921.7948-44242.0195 24150.689352527843-44242.01950000001-238.20519999998942ZM11090.991800000003-43096 92122.68360976904-28652.756941444954 92011.29999023097 28176.756941444968 10922.991800000003 42620ZM89846.7253-20894.342C89846.7253-24294.206919958364 87090.59021995837-27050.342 83690.7253-27050.342 82058.05258854777-27050.342 80492.24990074172-26401.76529071049 79337.77595501562-25247.29134498439S77534.7253-22527.014711452233 77534.7253-20894.342C77534.7253-17494.477080041637 80290.86038004165-14738.342 83690.7253-14738.342S89846.7253-17494.477080041637 89846.7253-20894.342ZM89846.7253-238.8077000000003C89846.7253-3638.672619958364 87090.59021995837-6394.8077 83690.7253-6394.807700000001 82058.05258854777-6394.807700000001 80492.24990074172-5746.230990710489 79337.77595501562-4591.757044984389S77534.7253-1871.480411452234 77534.7253-238.8077000000012C77534.7253 3161.057219958361 80290.86038004165 5917.1923 83690.7253 5917.1923S89846.7253 3161.057219958365 89846.7253-238.8076999999994ZM74115.871-10711.836299999999C74115.871-14111.701219958362 71359.73591995836-16867.8363 67959.871-16867.8363 66327.19828854776-16867.8363 64761.395600741715-16219.259590710488 63606.92165501561-15064.785644984388S61803.871-12344.509011452232 61803.871-10711.836299999999C61803.871-7311.9713800416375 64560.00608004163-4555.836299999999 67959.871-4555.836299999999S74115.871-7311.971380041634 74115.871-10711.836299999999ZM74115.871 9943.698C74115.871 6543.833080041636 71359.73591995836 3787.698 67959.871 3787.697999999999 66327.19828854776 3787.697999999999 64761.395600741715 4436.274709289511 63606.92165501561 5590.748655015612S61803.871 8311.025288547766 61803.871 9943.697999999999C61803.871 13343.562919958362 64560.00608004163 16099.698 67959.871 16099.698S74115.871 13343.562919958365 74115.871 9943.698ZM57216.8744-20894.342C57216.8744-24294.206919958364 54460.73931995837-27050.342 51060.8744-27050.342 49428.20168854777-27050.342 47862.399000741716-26401.76529071049 46707.925055015614-25247.29134498439S44904.8744-22527.014711452233 44904.8744-20894.342C44904.8744-17494.477080041637 47661.009480041634-14738.342 51060.8744-14738.342S57216.8744-17494.477080041637 57216.8744-20894.342ZM89846.7253 20416.7266C89846.7253 17016.861680041635 87090.59021995837 14260.7266 83690.7253 14260.7266 82058.05258854777 14260.7266 80492.24990074172 14909.303309289511 79337.77595501562 16063.777255015611S77534.7253 18784.053888547765 77534.7253 20416.726599999998C77534.7253 23816.59151995836 80290.86038004165 26572.7266 83690.7253 26572.7266S89846.7253 23816.591519958365 89846.7253 20416.7266ZM57216.8744-238.8077000000003C57216.8744-3638.672619958364 54460.73931995837-6394.8077 51060.8744-6394.807700000001 49428.20168854777-6394.807700000001 47862.399000741716-5746.230990710489 46707.925055015614-4591.757044984389S44904.8744-1871.480411452234 44904.8744-238.8077000000012C44904.8744 3161.057219958361 47661.009480041634 5917.1923 51060.8744 5917.1923S57216.8744 3161.057219958365 57216.8744-238.8076999999994ZM57216.8744-238.8077000000003C57216.8744 3161.0572199583635 54460.73931995837 5917.1923 51060.8744 5917.192300000001 49428.20168854777 5917.192300000001 47862.399000741716 5268.6155907104885 46707.925055015614 4114.141644984388S44904.8744 1393.8650114522334 44904.8744-238.8076999999994C44904.8744-3638.672619958362 47661.009480041634-6394.8077 51060.8744-6394.8077S57216.8744-3638.6726199583654 57216.8744-238.8077000000012ZM44904.8744 20416.7266C44904.8744 23816.591519958365 47661.009480041634 26572.7266 51060.8744 26572.7266 52693.54711145223 26572.7266 54259.349799258285 25924.14989071049 55413.82374498439 24769.67594498439S57216.8744 22049.399311452235 57216.8744 20416.7266C57216.8744 17016.861680041642 54460.73931995837 14260.726600000002 51060.8744 14260.726600000002S44904.8744 17016.861680041635 44904.8744 20416.7266ZM-16024.3479 15702.5792C-7219.824418197492 24507.102681802506 7055.128618197488 24507.102681802513 15859.652099999998 15702.579200000006 22377.91078 9184.320520000001 30100.42814 3870.3205199999975 39027.20418-239.4208000000035 30100.428139999996-4349.162120000001 22377.91078-9663.16212 15859.6521-16181.4208 7055.128618197495-24985.944281802505-7219.824418197491-24985.944281802505-16024.347899999999-16181.4208S-24828.871381802506 6898.055718197487-16024.347900000002 15702.579199999998Z")
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
    context.strokeStyle="black"
    context.fillStyle="lime"
    pth=new Path2D(otp(curpath))
    context.lineWidth=1.5/view.scale
    if(fill)context.fill(pth,fillrule?"evenodd":"nonzero")
    context.stroke(pth)
    
    context.fillStyle="red"
    context.strokeStyle="#bbb"
    context.lineWidth=3/view.scale
    function drawpoint(x,y){context.fillRect(x-2.5/view.scale,y-2.5/view.scale,5/view.scale,5/view.scale)}
    for(let i of curpath){
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
    if(!selected.selection){
        var p2d=new Path2D(otp([curpath[selected.subpath]]))
        context.strokeStyle="#000"
        context.stroke(p2d)
    }
    context.fillStyle="#07f"
    drawpoint(...curpath[selected.subpath][curpath[selected.subpath].length-1].to)
    
    
    context.fillStyle="#f70"
    drawpoint(...curpath[selected.subpath].start)
    
    context.restore()
    document.getElementById("pathtxt").value=otp(curpath)
    document.getElementById("scale").textContent=view.width/view.scale
    
    
    
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
rtn=(n,r)=>+(r?Math.round(n/r)*r:n).toFixed(10)
let subpath,selected={subpath:0},mousestate=false
let ctool;
function getmxy(ev){return [ev.offsetX/view.scale+view.topleft[0],ev.offsetY/view.scale+view.topleft[1]]}
canv.addEventListener("mousedown",e=>{
    //selected={subpath:selected.subpath};
    [mcx,mcy]=getmxy(e)
    mousestate=1
    
    let subpath=curpath[selected.subpath]
    var lcmd=subpath[subpath.length-1]
    var lc=subpath.length?lcmd.to:subpath.start
    var lastControl=subpath.length?lcmd.type=="bezier"?lcmd.controls[1]:lcmd.type=="quadratic"?lcmd.control:lc:lc
    nearpoint=(a,b=[mcx,mcy])=>Math.hypot(a[0]-b[0],a[1]-b[1])<=7.5/view.scale
    for(i=0;i<curpath.length;i++){
        for(j=0;j<curpath[i].length;j++){
            let pcmd=curpath[i][j]
            var sels
            switch(pcmd.type){
                case "bezier":sels={c1:pcmd.controls[0],c2:pcmd.controls[1]}
                break
                case "quadratic":sels={control:pcmd.control}
                break
                case "line":sels={}
            }
            for(var sel in sels){
                if(nearpoint(sels[sel])){
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
    mcx=rtn(mcx,grprec)
    mcy=rtn(mcy,grprec)
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
    }
    document.getElementById("coords").textContent="Coordinates: ("+[mcx,mcy]+")"
    draw()
})

canv.addEventListener("click",e=>{
    [mcx,mcy]=getmxy(e)
    
    let subpath=curpath[selected.subpath]
    var lcmd=subpath[subpath.length-1]
    var lastPoint=subpath.length?lcmd.to:subpath.start
    var lastControl=subpath.length?lcmd.type=="bezier"?lcmd.controls[1]:lcmd.type=="quadratic"?lcmd.control:lastPoint:lastPoint
    console.log(mousestate)
    if(mousestate==1){
        var ncmd
        switch(ctool){
            case "line":ncmd={type:"line",to:[mcx,mcy]}
            break
            case "bezier":ncmd={type:"bezier",controls:[[2*lastPoint[0]-lastControl[0],2*lastPoint[1]-lastControl[1]],[mcx,mcy]],to:[mcx,mcy]}
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
			var p2d=new Path2D(otp([curpath[i]]))
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
    console.log(innerWidth,innerHeight)
    resizeCanvas(innerWidth*2/3,innerHeight)
    draw()
    
    
    
})

document.getElementById("canvwrapper").addEventListener("keydown",e=>{
    if(e.key=="Delete")curpath[selected.subpath].splice(selected.command??-1,1)
    draw()
},{passive:true})

document.getElementById("pathtxt").addEventListener("input",e=>{
    curpath=pto(e.target.value)
    selected={subpath:0}
    draw()
    cfsels()
    
    
    
})

document.getElementById("pclosed").addEventListener("input",e=>{
	curpath[selected.subpath].closed=e.target.checked
	draw()
})

resizeCanvas(900,900)
cfsels()
draw()

