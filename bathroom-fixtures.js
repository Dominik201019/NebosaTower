// Procedural ceramic and plumbing fixtures. Dimensions are in metres.
export function buildBathroom(THREE,api,room,m,Reflector){
 const {world,mesh,box,rounded,cylinder}=api,{x,z,w,d}=room;
 const solids=[],mirrors=[];
 const addGroup=()=>{const g=new THREE.Group();world.add(g);return g};
 const b=(g,...args)=>{const o=box(...args);g.add(o);return o};
 const r=(g,...args)=>{const o=rounded(...args);g.add(o);return o};
 const c=(g,...args)=>{const o=cylinder(...args);g.add(o);return o};
 const sphere=(g,sx,sy,sz,px,py,pz,material)=>{const o=mesh(new THREE.SphereGeometry(1,40,24),material,px,py,pz,g);o.scale.set(sx,sy,sz);return o};
 const tube=(g,points,radius,material)=>mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),32,radius,10,false),material,0,0,0,g);
 const lathe=(g,points,px,py,pz,material)=>mesh(new THREE.LatheGeometry(points.map(p=>new THREE.Vector2(...p)),64),material,px,py,pz,g);
 function toilet(px,pz,rotation){
  const g=addGroup();
  // Outer ceramic shell folds into the inner bowl; the opening remains visible.
  const bowl=lathe(g,[[.04,.04],[.11,.04],[.12,.13],[.16,.23],[.195,.31],[.205,.365],[.20,.40],[.177,.414],[.151,.39],[.13,.35],[.09,.30],[.055,.28]],0,0,.045,m.ceramic);bowl.scale.z=1.32;
  const water=mesh(new THREE.CircleGeometry(.085,40),m.water,0,.287,.06,g);water.rotation.x=-Math.PI/2;water.scale.y=1.25;
  const seat=mesh(new THREE.TorusGeometry(.177,.021,12,64),m.ceramic,0,.432,.055,g);seat.rotation.x=Math.PI/2;seat.scale.y=1.37;
  const lid=sphere(g,.183,.018,.245,0,.66,-.13,m.ceramic);lid.rotation.x=-1.24;
  r(g,.36,.46,.15,0,.62,-.205,m.ceramic,.045);r(g,.38,.035,.17,0,.864,-.205,m.ceramic,.015);
  const flush=c(g,.031,.008,.062,.887,-.205,m.chrome);c(g,.021,.009,.005,.887,-.205,m.chrome);
  c(g,.028,.10,-.13,.445,-.145,m.chrome).rotation.z=Math.PI/2;c(g,.028,.10,.13,.445,-.145,m.chrome).rotation.z=Math.PI/2;
  const roll=c(g,.055,.10,-.32,.64,-.1,m.paper);roll.rotation.z=Math.PI/2;b(g,.025,.025,.15,-.32,.64,-.2,m.chrome);b(g,.13,.1,.008,-.32,.59,-.08,m.paper);
  g.position.set(px,0,pz);g.rotation.y=rotation;
  solids.push({x:px,z:pz,w:Math.abs(Math.cos(rotation))*.46+Math.abs(Math.sin(rotation))*.76,d:Math.abs(Math.cos(rotation))*.76+Math.abs(Math.sin(rotation))*.46});
  g.userData.fixture='toilet';return g;
 }
 function vanity(px,pz,rotation,compact=false){
  const g=addGroup(),vw=compact?.5:.78;
  r(g,vw,.43,.43,0,.55,0,m.oak,.025);b(g,vw+.025,.035,.46,0,.785,0,m.quartz);b(g,vw-.04,.002,.002,0,.56,.219,m.dark);
  const basin=lathe(g,[[.035,0],[.15,0],[.245,.035],[.26,.10],[.265,.14],[.25,.15],[.23,.13],[.19,.065],[.045,.038]],0,.80,.025,m.ceramic);basin.scale.set(compact?.8:1,1,.72);
  c(g,.018,.005,0,.842,.025,m.chrome);
  tube(g,[[0,.8,-.145],[0,1.08,-.145],[0,1.12,.025],[0,1.02,.08]],.014,m.chrome);c(g,.022,.045,.1,.81,-.14,m.chrome);
  const frame=mesh(new THREE.TorusGeometry(.355,.017,12,64),m.chrome,0,1.6,-.242,g);frame.scale.y=1.18;
  const mirror=new Reflector(new THREE.CircleGeometry(.34,64),{textureWidth:window.innerWidth<700?256:512,textureHeight:window.innerWidth<700?256:512,color:0xc7caca,clipBias:.002});mirror.scale.y=1.18;mirror.position.set(0,1.6,-.236);g.add(mirror);mirror.userData.room=room.key;mirrors.push(mirror);
  const led=mesh(new THREE.TorusGeometry(.368,.009,8,64),m.led,0,1.6,-.251,g);led.scale.y=1.18;
  r(g,.07,.12,.07,-vw*.31,.86,.12,m.bottle,.012);c(g,.012,.045,-vw*.31,.94,.12,m.chrome);b(g,.05,.006,.018,-vw*.29,.962,.12,m.chrome);
  r(g,.12,.065,.09,vw*.3,.85,.12,m.ceramic,.012);r(g,.09,.018,.055,vw*.3,.90,.12,m.soap,.008);
  g.position.set(px,0,pz);g.rotation.y=rotation;
  solids.push({x:px,z:pz,w:Math.abs(Math.cos(rotation))*vw+Math.abs(Math.sin(rotation))*.5,d:Math.abs(Math.cos(rotation))*.5+Math.abs(Math.sin(rotation))*vw});
  return g;
 }
 function shower(){
  const g=addGroup(),sw=Math.min(w-.20,1.25),sd=Math.min(1.0,d*.36),sx=x+.1+sw/2,sz=z+d-sd/2-.08;
  r(g,sw,.055,sd,sx,.032,sz,m.quartz,.025);b(g,sw-.18,.004,.025,sx,.063,sz+sd*.32,m.chrome);
  // Clear screen and a fine metal profile; the entrance is left open.
  const glass=b(g,.012,2.12,sd,sx+sw/2,1.12,sz,m.clearGlass);glass.castShadow=false;b(g,.02,2.13,.022,sx+sw/2,1.12,sz-sd/2,m.chrome);b(g,.02,.02,sd,sx+sw/2,2.18,sz,m.chrome);
  const wallX=x+.16;const railX=wallX+.04;
  c(g,.015,1.0,railX,1.45,sz,m.chrome);b(g,.04,.04,.15,railX,1.95,sz,m.chrome);
  tube(g,[[wallX,.95,sz],[wallX+.06,.55,sz+.15],[wallX+.1,1.2,sz+.1]],.008,m.chrome);
  tube(g,[[wallX,1.25,sz],[wallX,2.2,sz],[wallX+.35,2.2,sz]],.015,m.chrome);
  const head=c(g,.115,.018,wallX+.35,2.19,sz,m.chrome);for(let i=0;i<14;i++){const a=i*2.4,rr=.02+(i%3)*.025;c(g,.003,.004,wallX+.35+Math.cos(a)*rr,2.178,sz+Math.sin(a)*rr,m.dark)}
  b(g,.024,.12,.23,wallX,1.12,sz,m.chrome);c(g,.023,.025,wallX+.03,1.14,sz,m.chrome).rotation.z=Math.PI/2;
  b(g,.17,.018,.10,wallX+.07,1.44,sz-.3,m.chrome);r(g,.045,.14,.045,wallX+.07,1.52,sz-.3,m.bottle,.009);r(g,.045,.11,.045,wallX+.07,1.505,sz-.23,m.soap,.008);
  return {g,sw,sd,sx,sz};
 }
 // Pale large-format tiles with low-contrast grout and natural microtexture.
 b(world,w-.04,.018,d-.04,x+w/2,.017,z+d/2,m.tile);
 b(world,.015,2.8,d,x+.075,1.4,z+d/2,m.tile);b(world,.015,2.8,d,x+w-.075,1.4,z+d/2,m.tile);b(world,w,.015,.015,x+w/2,2.76,z+d-.08,m.led);b(world,w,2.8,.015,x+w/2,1.4,z+d-.075,m.tile);
 if(room.name==='WC'){
  toilet(x+Math.min(.58,w*.3),z+d-.41,Math.PI);
  vanity(x+w-.37,z+Math.min(.70,d*.48),-Math.PI/2,true);
 }else{
  shower();
  toilet(x+w-.41,z+(w<1.85?Math.min(d-.9,1.95):Math.min(d*.46,1.55)),-Math.PI/2);
  vanity(x+.37,z+(w<1.85?.65:Math.min(1.05,d*.4)),Math.PI/2,w<1.85);
  // Towel rail opposite the doorway and two folded towels.
  const railZ=z+d*.58;b(world,.09,.018,.60,x+w-.12,1.18,railZ,m.chrome);b(world,.035,.34,.32,x+w-.135,1.01,railZ,m.towel);
  c(world,.11,.25,x+w-.28,.125,z+.25,m.chrome);c(world,.115,.02,x+w-.28,.26,z+.25,m.chrome);
 }
 return {solids,mirrors};
}
