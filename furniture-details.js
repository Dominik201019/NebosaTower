export function detailedChair(THREE,api,x,z,rotation,m){
 const g=new THREE.Group();api.world.add(g);
 const add=o=>{g.add(o);return o};
 add(api.rounded(.49,.065,.47,0,.46,0,m.chair,.08));
 const vertices=[],indices=[],steps=32,levels=10;
 for(let j=0;j<=levels;j++)for(let i=0;i<=steps;i++){const a=Math.PI*.48+i/steps*Math.PI*1.04,v=j/levels,edge=Math.sin(i/steps*Math.PI),radius=.275+.035*v;vertices.push(Math.sin(a)*radius,.46+v*(.12+.32*edge),Math.cos(a)*radius-.015)}
 for(let j=0;j<levels;j++)for(let i=0;i<steps;i++){const a=j*(steps+1)+i,b=a+steps+1;indices.push(a,b,a+1,a+1,b,b+1)}
 const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geom.setIndex(indices);geom.computeVertexNormals();api.mesh(geom,m.chair,0,0,0,g);
 for(const sx of [-1,1])for(const sz of [-1,1]){const p0=new THREE.Vector3(sx*.15,.445,sz*.14),p1=new THREE.Vector3(sx*.24,.02,sz*.23);api.mesh(new THREE.TubeGeometry(new THREE.LineCurve3(p0,p1),1,.015,10,false),m.chrome,0,0,0,g)}
 for(const z0 of [-.14,.14])api.mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(-.17,.3,z0),new THREE.Vector3(.17,.3,z0)),1,.008,8,false),m.chrome,0,0,0,g);
 g.position.set(x,0,z);g.rotation.y=rotation;api.shadow(x,z,.65,.65,.18);return g;
}

export function detailedBed(THREE,api,r,m){
 const {x,z,w,d}=r,sideways=d<2.6,bw=Math.min(sideways?1.5:1.65,sideways?d-.18:w-.65),len=2.02,g=new THREE.Group();api.world.add(g);
 const add=o=>{g.add(o);return o};
 add(api.rounded(bw+.08,.20,len+.05,0,.23,0,m.oak,.055));
 for(const sx of [-1,1])for(const sz of [-1,1])add(api.cylinder(.035,.16,sx*bw*.4,.08,sz*len*.4,m.chrome));
 add(api.rounded(bw,.24,len,0,.45,0,m.cushion,.10));
 add(api.rounded(bw+.15,.95,.10,0,.64,-len/2-.03,m.fabric,.045));
 for(let i=0;i<5;i++)add(api.box(.012,.72,.006,-bw/2+i*bw/4,.66,-len/2+.025,m.seam));
 add(api.rounded(bw+.04,.085,len*.64,0,.605,.29,m.duvet,.06));
 // Soft creases and two rounded pillows, rather than rigid cuboid bedding.
 for(let i=0;i<6;i++){const fold=api.mesh(new THREE.SphereGeometry(1,24,12),m.duvet,-bw*.4+i*bw*.16,.65,.3+Math.sin(i)*.22,g);fold.scale.set(.065,.025,.47);fold.rotation.y=i*.14}
 for(const sx of [-1,1]){const pillow=api.mesh(new THREE.SphereGeometry(1,32,18),m.cushion,sx*bw*.245,.66,-.63,g);pillow.scale.set(bw*.225,.105,.225);pillow.rotation.y=sx*.07;const seam=add(api.rounded(bw*.445,.008,.435,sx*bw*.245,.665,-.63,m.cushion,.035));seam.rotation.y=sx*.07}
 const bx=sideways?x+.25+len/2:x+w/2,bz=sideways?z+d/2:z+.32+len/2;g.position.set(bx,0,bz);g.rotation.y=sideways?Math.PI/2:0;
 api.shadow(bx,bz,sideways?len+.4:bw+.4,sideways?bw+.4:len+.4,.25);
 const solids=[{x:bx,z:bz,w:sideways?len:bw,d:sideways?bw:len}];
 const hasWardrobe=!sideways&&w>=4.1&&d>=3.4;
 if(!sideways&&w>2.8){for(const sx of (hasWardrobe?[-1]:[-1,1])){const tx=bx+sx*(bw/2+.26),tz=z+.62;api.rounded(.39,.38,.37,tx,.24,tz,m.oak,.022);api.box(.33,.004,.007,tx,.24,tz+.19,m.seam);api.cylinder(.075,.018,tx,.447,tz,m.chrome);api.cylinder(.009,.20,tx,.55,tz,m.chrome);api.mesh(new THREE.ConeGeometry(.115,.15,32,1,true),m.lamp,tx,.69,tz);api.shadow(tx,tz,.5,.5,.14)}}
 if(hasWardrobe){ const wd=Math.min(1.35,d-.5),wx=x+w-.33,wz=z+.25+wd/2;api.box(.42,2.30,wd,wx,1.15,wz,m.oak);api.box(.025,2.22,wd-.04,wx-.225,1.18,wz,m.white);api.box(.03,2.2,.012,wx-.245,1.18,wz,m.seam);for(const sz of [-1,1])api.box(.025,.23,.015,wx-.26,1.13,wz+sz*.055,m.chrome);solids.push({x:wx,z:wz,w:.42,d:wd});}

 return solids;
}

export function kitchenDetails(THREE,api,r,m,H){
 const {x,z,w,d}=r,dining=window.NEBOSA_DINING(r);
 // One pendant centred over the actual table, not over the former layout.
 const tx=dining.x,tz=dining.z;api.cylinder(.005,H-1.95,tx,(H+1.95)/2,tz,m.chrome);api.mesh(new THREE.ConeGeometry(.25,.22,40,1,true),m.white,tx,1.95,tz);const diffuser=api.cylinder(.22,.012,tx,1.85,tz,m.led);diffuser.castShadow=false;
 const tvZ=window.NEBOSA_SEATING(r).tv.z;api.rounded(.30,.38,1.65,x+.22,.25,tvZ,m.white,.025);api.box(.015,.005,1.55,x+.38,.28,tvZ,m.seam);api.rounded(.045,.72,1.22,x+.09,1.22,tvZ,m.white,.025);api.box(.025,.65,1.14,x+.12,1.22,tvZ,m.screen);
}
