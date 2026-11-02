(function(){
  function hide(d){
    d.classList.add("out");
    setTimeout(function(){d.remove()},500);
  }
  function show(id,src,msg,side){
    if(document.getElementById(id))return;
    var d=document.createElement("div");
    d.id=id;
    d.className="egg"+(side==="left"?" left":"");
    d.setAttribute("role","img");
    d.setAttribute("aria-label","隠しキャラ");
    d.innerHTML='<span class="egg-b">'+msg+'</span><img src="'+src+'" alt="">';
    d.addEventListener("click",function(){d.remove()});
    document.body.appendChild(d);
    setTimeout(function(){hide(d)},4000);
  }
  function watch(el,id,src,msg,side){
    if(!el)return;
    var n=0,t=0;
    el.addEventListener("click",function(){
      var now=Date.now();
      if(now-t>1500)n=0;
      t=now;n++;
      if(n>=5){n=0;show(id,src,msg,side);}
    });
  }
  watch(document.querySelector("footer"),"egg-axolotl","axolotl.png","わーい！！","right");
  watch(document.querySelector("h1"),"egg-bird","bird.png","わーい！","left");
})();
