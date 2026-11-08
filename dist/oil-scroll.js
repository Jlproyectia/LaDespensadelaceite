// The original photograph is clipped into two layers, never redrawn.
const heading=document.querySelector('#galeria .section-heading');
if(heading){
  const scene=document.createElement('div');
  scene.className='oil-scene';
  scene.setAttribute('aria-hidden','true');
  scene.innerHTML=`<svg viewBox="0 0 1132 1800" focusable="false">
    <defs>
      <clipPath id="oil-body-clip"><rect x="0" y="520" width="1132" height="1100"/></clipPath>
      <clipPath id="oil-cap-clip"><rect x="0" y="300" width="1132" height="220"/></clipPath>
      <linearGradient id="oil-gold" x1="0" x2="1"><stop stop-color="#a87808"/><stop offset=".45" stop-color="#e9bf35"/><stop offset="1" stop-color="#c19413"/></linearGradient>
    </defs>
    <g class="oil-body"><image href="images/aceitera.png" x="50" y="330" width="850" height="1033" clip-path="url(#oil-body-clip)"/></g>
    <g class="oil-cap"><image href="images/aceitera.png" x="50" y="330" width="850" height="1033" clip-path="url(#oil-cap-clip)"/></g>
    <g class="oil-pour" opacity="0"><path class="oil-stream"/><path class="oil-stream-glint"/></g>
  </svg>`;
  heading.append(scene);
  const body=scene.querySelector('.oil-body'),cap=scene.querySelector('.oil-cap'),pour=scene.querySelector('.oil-pour');
  const paths=scene.querySelectorAll('.oil-pour path');
  const mobile=matchMedia('(max-width:600px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const clamp=n=>Math.min(1,Math.max(0,n));
  const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
  let pending=false;
  function draw(){
    pending=false;
    if(!mobile.matches)return;
    const rect=heading.getBoundingClientRect();
    // Finish while the heading is still visible, without pinning or trapping scroll.
    const start=innerHeight*.78,end=Math.max(160,innerHeight*.25);
    const p=reduced.matches||document.documentElement.hasAttribute('data-motion-off')?0:clamp((start-rect.top)/(start-end));
    const lift=ease(p/.32),tilt=ease((p-.25)/.6),flow=ease((p-.61)/.39);
    const angle=tilt*68;
    body.setAttribute('transform',`rotate(${angle} 475 1000)`);
    cap.setAttribute('transform',`translate(${-90*lift} ${-230*lift}) rotate(${-18*lift} 475 430)`);
    // Keep the stream connected to the transformed lip; gravity stays vertical.
    const radians=angle*Math.PI/180,dx=176,dy=-431;
    const x=475+dx*Math.cos(radians)-dy*Math.sin(radians);
    const y=1000+dx*Math.sin(radians)+dy*Math.cos(radians);
    const length=flow*560;
    const d=`M ${x} ${y} C ${x+28} ${y+length*.15}, ${x+38} ${y+length*.6}, ${x+38} ${y+length}`;
    paths.forEach(path=>path.setAttribute('d',d));
    pour.setAttribute('opacity',String(clamp(flow*5)));
    scene.dataset.progress=p.toFixed(3);
  }
  function schedule(){if(!pending){pending=true;requestAnimationFrame(draw)}}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  mobile.addEventListener('change',schedule);reduced.addEventListener('change',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-motion-off']});
  draw();
}
