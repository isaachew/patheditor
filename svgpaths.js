function pto(path){
    let numregex=/[+-]?(([1-9]\d*|0)(\.\d*)?|\.\d+)(e[+-]?\d+)?/g
    let letters="zmlhvcsqta"
    path=path.match(new RegExp(`(${numregex.source})|[${letters}]`,"gi"))
    console.log(path)
    let curpath=[]
    let subpath=[]
    subpath.closed=false
    let opcode=""
    let cnt=0
    let params=[]
    let plen={m:2,l:2,h:1,v:1,c:6,s:4,q:4,t:2,a:7,z:0}
    for(let i of path){
        if(/^[mlhvcsqtaz]/i.test(i)){
            opcode=i[0]
            i=i.slice(1)
            cnt=plen[opcode.toLowerCase()]
        }
        var pint=parseFloat(i)
        if(pint==pint){//if not NaN
            params.push(pint)
            cnt--
        }
        if(cnt==0){
            let lc=subpath.length?subpath[subpath.length-1].to:subpath.start??[0,0]
             console.log("lc:",lc)
            let rel=opcode==opcode.toLowerCase()
            let relx=rel?lc[0]:0,rely=rel?lc[1]:0
            var relative=a=>[a[0]+relx,a[1]+rely]
            console.log((rel?opcode.toLowerCase():opcode)+params)
            switch(opcode.toLowerCase()){
                case "z":
                subpath.closed=true
                if(subpath.length)curpath.push(subpath)
                subpath=Object.assign([],{start:subpath.start})
                break
                case "m":
                if(subpath.length)curpath.push(subpath)
                subpath=[]
                subpath.start=relative(params)
                opcode="Ll"[+rel]
                break
                case "l":
                subpath.push({type:"line",to:relative(params)})
                break
                case "h":
                subpath.push({type:"line",to:[params[0]+relx,lc[1]]})
                break
                case "v":
                subpath.push({type:"line",to:[lc[0],params[0]+rely]})
                break
                case "c":
                subpath.push({type:"bezier",c1:relative([params[0],params[1]]),c2:relative([params[2],params[3]]),to:relative([params[4],params[5]])})
                break
                case "s":
                var lcmd=subpath[subpath.length-1]
                var lbcc=lcmd.type=="bezier"?lcmd.c2:lc
                subpath.push({type:"bezier",c1:[2*lc[0]-lbcc[0],2*lc[1]-lbcc[1]],c2:relative([params[0],params[1]]),to:relative([params[2],params[3]])})
                break
                case "q":
                subpath.push({type:"quadratic",control:relative([params[0],params[1]]),to:relative([params[2],params[3]])})
                break
                case "t":
                var lcmd=subpath[subpath.length-1]
                var lbcc=lcmd.type=="quadratic"?lcmd.control:lc
                subpath.push({type:"quadratic",control:[2*lc[0]-lbcc[0],2*lc[1]-lbcc[1]],to:relative([params[0],params[1]])})
                break
                case "a":
                subpath.push({type:"arc",rx:params[0],ry:params[1],angle:params[2],large:!!params[3],sweep:!!params[4],to:relative([params[5],params[6]])})
            }
            params=[]
            cnt=plen[opcode.toLowerCase()]
            
            
            
            
        }
    }
    if(subpath.length)curpath.push(subpath)
    return curpath
}
function revsp(subpath){
    let newsp=[]
    newsp.start=subpath[subpath.length-1].to
    for(i=subpath.length-1;i>=0;i--){
        let from=i?subpath[i-1].to:subpath.start
        let cmd=subpath[i]
        switch(cmd.type){
        case "line":
        newsp.push({type:"line",to:from})
        
        
        break
        case "bezier":
        newsp.push({type:"bezier",to:from,c1:cmd.c2,c2:cmd.c1})
        break
        case "quadratic":
        newsp.push({type:"quadratic",to:from,control:cmd.control})
        break
        case "arc":
        newsp.push({type:"arc",to:from,what:what})
        
        
        }
        lc=i.to
    }
    
    return newsp
}
function gsr(num){
    if(num==0)return "0"
    if(num%1000==0){
        let tz=0
        while(num%10==0){tz++,num/=10}        
        return num+"e"+tz
    }
    if(num<.001){
        let exp=0
        while((num*10**exp)%1)exp++
        return ""+(num*10**exp)+"e-"+exp
        
        
        
    }
    if(num<1)return (""+num).slice(1)
    return ""+num
}
function otp(path){
    var st="",lcu=""
    function anc(a,...p){
        st+=(lcu==a?"":a)
        
        for(var i of p){
            if(i<0){st+="-"+gsr(-i);continue}
            let srep=gsr(i)
            if((srep[0]=="."&&/(\.\d+|e[+-]?\d+)$/i.test(st))||/[zmlhvcsqta]$/i.test(st))st+=srep
            //else if(st[st.length-1]==0&&srep[0]==0)st+="0"
            else st+=" "+srep
        }
        lcu=a=="M"?"L":a
    }
    let aeq=(a,b)=>Math.abs(a-b)<0.001
    var lx,ly,lp={}
    for(var i of path){
        anc("M",...i.start)
        lx=i.start[0]
        ly=i.start[1]
        for(var j of i){
            
            switch(j.type){
                case "line":
                if(j.to[0]==lx)anc("V",j.to[1])
                else if(j.to[1]==ly)anc("H",j.to[0])
                else anc("L",...j.to)
                break
                case "bezier":
                var ref=lp.type=="bezier"?[2*lx-lp.c2[0],2*ly-lp.c2[1]]:[lx,ly]
                if(aeq(j.c1[0],ref[0])&&aeq(j.c1[1],ref[1]))anc("S",...j.c2,...j.to)
                else anc("C",...j.c1,...j.c2,...j.to)
                break
                case "quadratic":
                var ref=lp.type=="quadratic"?[2*lx-lp.control[0],2*ly-lp.control[1]]:[lx,ly]
                if(aeq(j.control[0],ref[0])&&aeq(j.control[1],ref[1]))anc("T",...j.to)
                else anc("Q",...j.control,...j.to)
                break
                case "arc":
                anc("A",j.rx,j.ry,j.angle,+j.large,+j.sweep,...j.to)
            }
            lx=j.to[0]
            ly=j.to[1]
            lp=j
        }
        if(i.closed)anc("Z")
    }
    return st
}
function tocc(path){
    let cst="ctx.beginPath()\n"
    for(i of path){
        cst+=`ctx.moveTo(${i.start})\n`
        for(j of i){
            switch(j.type){
                case "line":cst+=`ctx.lineTo(${j.to})\n`
                break
                case "bezier":cst+=`ctx.bezierCurveTo(${j.c1},${j.c2},${j.to})\n`
                break
                case "quadratic":cst+=`ctx.quadraticCurveTo(${j.control},${j.to})\n`
                break
            
            
            
            }    
        }
        if(cst.closed)cst+="ctx.closePath()\n"
    }
    return cst
}
function ptp(path){
    return new Path2D(pto(path))
}