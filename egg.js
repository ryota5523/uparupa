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

  // 隠しキャラ：ジャーマンポテトくん（ヘッダーを5回タップ）
  function germanPotato(){
    showCharacter("egg-german-potato","ジャーマンポテトくん",
      '<svg viewBox="0 0 220 250" role="img" aria-label="麻雀牌を持ったじゃがいも"><path d="M49 88 C35 61 47 35 83 27 C118 13 166 35 175 75 C192 122 174 183 143 202 C111 225 57 204 43 171 C28 143 31 112 49 88Z" fill="#f2d2aa"/><path d="M49 113 Q18 105 12 83 M169 119 Q201 130 204 165" fill="none" stroke="#171717" stroke-width="7" stroke-linecap="round"/><path d="M89 91 Q101 76 111 93 M128 92 Q140 77 151 93" fill="none" stroke="#171717" stroke-width="7" stroke-linecap="round"/><path d="M105 115 Q123 137 143 115" fill="none" stroke="#171717" stroke-width="7" stroke-linecap="round"/><path d="M75 198 L65 231 M143 201 L151 233" stroke="#171717" stroke-width="8" stroke-linecap="round"/><rect x="7" y="26" width="45" height="61" rx="7" fill="#f7f7f7" stroke="#e9b900" stroke-width="7" transform="rotate(-12 29 56)"/><text x="29" y="69" text-anchor="middle" font-size="34" font-weight="bold" fill="#e44b4b">中</text><path d="M84 42 Q91 33 97 42 M143 44 Q151 35 157 44" stroke="#d8b77c" stroke-width="5" stroke-linecap="round"/></svg>');
  }
  // 隠しキャラ：ジャーマンアイリスくん（今日のまなみんカードを5回タップ）
  function germanIris(){
    showCharacter("egg-german-iris","ジャーマンアイリスくん",
      '<svg viewBox="0 0 220 250" role="img" aria-label="笑顔の紫色の花"><path d="M110 142 L110 215" stroke="#58b947" stroke-width="10" stroke-linecap="round"/><path d="M107 203 Q52 162 28 199 Q62 232 107 215Z M113 203 Q160 163 193 192 Q167 231 113 215Z" fill="#63bd43"/><path d="M109 130 C68 130 50 93 72 68 C83 54 99 67 110 84 C120 62 139 49 153 66 C174 93 149 128 109 130Z" fill="#7845b7"/><path d="M72 91 C38 83 38 52 63 48 C83 44 99 65 110 86 C118 61 140 42 160 52 C183 64 168 96 145 107" fill="#7845b7"/><path d="M85 93 Q94 82 101 94 M123 94 Q132 82 140 94" fill="none" stroke="#171717" stroke-width="6" stroke-linecap="round"/><path d="M99 108 Q112 120 127 108" fill="none" stroke="#171717" stroke-width="6" stroke-linecap="round"/><path d="M76 133 L66 155 M111 136 L111 157 M146 132 L159 153" stroke="#f5c400" stroke-width="9" stroke-linecap="round"/></svg>');
  }
  function showCharacter(id,name,art){
    if(document.getElementById(id))return;
    var d=document.createElement("div");
    d.id=id; d.className="egg bonus-egg";
    d.setAttribute("role","img"); d.setAttribute("aria-label",name);
    d.innerHTML='<span class="egg-b">'+name+'！</span><div class="bonus-art">'+art+'</div><small>タップでかくれる</small>';
    d.addEventListener("click",function(){d.remove()});
    document.body.appendChild(d);
    setTimeout(function(){hide(d)},5000);
  }
  (function(){
    if(document.getElementById("egg-bonus-style"))return;
    var s=document.createElement("style");s.id="egg-bonus-style";
    s.textContent='.bonus-egg{position:fixed;z-index:9998;right:14px;bottom:22px;width:min(210px,48vw);padding:12px;background:#fff;border:2px solid #f1d8dc;border-radius:20px;box-shadow:0 8px 30px #0002;text-align:center;animation:eggBonusIn .35s ease-out}.bonus-egg .bonus-art svg{width:100%;height:auto;display:block}.bonus-egg small{color:#88777a;font-size:11px}@keyframes eggBonusIn{from{transform:translateY(30px) scale(.8);opacity:0}to{transform:none;opacity:1}}';
    document.head.appendChild(s);
  })();

  watch(document.querySelector("footer"),pop);
  watch(document.querySelector("header"),germanPotato);
  watch(document.querySelector(".home-daily"),germanIris);
  watch(document.querySelector("h1"),peek);
})();
