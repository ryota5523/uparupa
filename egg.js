(function(){
  var f=document.querySelector("footer");
  if(!f)return;
  var n=0,t=0;
  function show(){
    if(document.getElementById("egg"))return;
    var d=document.createElement("div");
    d.id="egg";
    d.setAttribute("role","img");
    d.setAttribute("aria-label","隠しキャラのウーパールーパー");
    d.innerHTML='<span class="egg-b">わーい！！</span><img src="axolotl.png" alt="">';
    d.addEventListener("click",function(){d.remove()});
    document.body.appendChild(d);
    setTimeout(function(){
      d.classList.add("out");
      setTimeout(function(){d.remove()},500);
    },4000);
  }
  f.addEventListener("click",function(){
    var now=Date.now();
    if(now-t>1500)n=0;
    t=now;n++;
    if(n>=5){n=0;show();}
  });
})();
