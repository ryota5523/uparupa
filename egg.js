(function(){
  function hide(d){
    d.classList.add("out");
    setTimeout(function(){d.remove()},600);
  }
  // 右下にぴょんと出る(ウーパールーパー)
  function pop(){
    if(document.getElementById("egg-axolotl"))return;
    var d=document.createElement("div");
    d.id="egg-axolotl";
    d.className="egg";
    d.setAttribute("role","img");
    d.setAttribute("aria-label","隠しキャラ");
    d.innerHTML='<span class="egg-b">わーい！！</span><img src="axolotl.png" alt="">';
    d.addEventListener("click",function(){d.remove()});
    document.body.appendChild(d);
    setTimeout(function(){hide(d)},4000);
  }
  // 名前の後ろから上にひょっこり(青い鳥)
  function peek(){
    var h=document.querySelector("h1");
    if(!h||document.getElementById("egg-bird"))return;
    var p=document.createElement("div");
    p.id="egg-bird";
    p.className="peek side";
    p.setAttribute("aria-hidden","true");
    p.style.fontSize=getComputedStyle(h).fontSize;
    p.innerHTML='<span class="say">わーい！！</span><div class="win"><img src="bird.png" alt=""></div>';
    h.parentNode.insertBefore(p,h);
    // 名前の左端の、すぐ左隣から横にひょっこり出す
    var fs=parseFloat(getComputedStyle(h).fontSize),r=document.createRange();
    r.selectNodeContents(h);
    var x=r.getBoundingClientRect().left-h.getBoundingClientRect().left;
    var lx=Math.max(0,x-fs*1.05)+"px";
    p.querySelector(".win").style.left=lx;
    p.querySelector(".say").style.left=lx;
    setTimeout(function(){hide(p)},3000);
  }
  function watch(el,fn){
    if(!el)return;
    var n=0,t=0;
    el.addEventListener("click",function(){
      var now=Date.now();
      if(now-t>1500)n=0;
      t=now;n++;
      if(n>=5){n=0;fn();}
    });
  }

  watch(document.querySelector("footer"),pop);
  watch(document.querySelector("h1"),peek);
})();
