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
    p.className="peek";
    p.setAttribute("aria-hidden","true");
    p.style.fontSize=getComputedStyle(h).fontSize;
    p.innerHTML='<div class="win"><img src="bird.png" alt=""></div>';
    h.parentNode.insertBefore(p,h);
    // 名前の最後の文字の上あたりから出す
    var fs=parseFloat(getComputedStyle(h).fontSize),r=document.createRange();
    r.selectNodeContents(h);
    var x=r.getBoundingClientRect().right-h.getBoundingClientRect().left-fs*0.45;
    p.firstChild.style.left=x+"px";
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
