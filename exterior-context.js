// Tower context with a licensed, real photographic backdrop of Wrocław.
export function buildExterior(THREE,api,layout,p,H){
 const {world,materials}=api,{W,D}=layout,group=new THREE.Group();group.name='Tower and city';world.add(group);
 const material=(color,extra={})=>{const m=new THREE.MeshStandardMaterial({color,roughness:.78,...extra});m.userData.noClay=true;materials.push(m);return m};
 const stone=material('#c4b295'),bronze=material('#705038',{metalness:.65,roughness:.32}),glass=material('#78989b',{transparent:true,opacity:.24,roughness:.15,metalness:.25,depthWrite:false}),leaves=[material('#65774f'),material('#65774f')];
 const cube=new THREE.BoxGeometry(1,1,1),batches=new Map(),dummy=new THREE.Object3D();
 const put=(mat,x,y,z,w,h,d,angle=0,geom=cube)=>{const key=mat.uuid+geom.uuid;if(!batches.has(key))batches.set(key,{mat,geom,items:[]});batches.get(key).items.push({x,y,z,w,h,d,angle})};
 const foliage=new THREE.IcosahedronGeometry(1,2);const balcony=layout.rooms.find(r=>r.kind==='balcony');
 // Warm stone floor bands, metal fins and glass parapets connect this unit to the whole tower.
 const slabShape=new THREE.Shape(),left=-4.2,right=W+4.2,back=-.4,front=D+balcony.d+.28,r=.8;
 slabShape.moveTo(left+r,back);slabShape.lineTo(right-r,back);slabShape.quadraticCurveTo(right,back,right,back+r);slabShape.lineTo(right,front-r);slabShape.quadraticCurveTo(right,front,right-r,front);slabShape.lineTo(left+r,front);slabShape.quadraticCurveTo(left,front,left,front-r);slabShape.lineTo(left,back+r);slabShape.quadraticCurveTo(left,back,left+r,back);
 const slab=new THREE.ExtrudeGeometry(slabShape,{depth:.24,bevelEnabled:true,bevelSize:.04,bevelThickness:.03,bevelSegments:2,curveSegments:10});slab.rotateX(Math.PI/2);
 for(let floor=1;floor<=29;floor++){
  const y=(floor-p.floor)*3.2;
  put(stone,0,y-.06,0,1,1,1,0,slab);
  if(floor===29)continue;
  const frontRail=D+balcony.d+.1;
  if(floor!==p.floor){put(glass,W/2,y+.6,frontRail,W+7.6,1.05,.018);put(bronze,W/2,y+1.14,frontRail,W+7.7,.045,.065);put(glass,W/2,y+H/2,D+.03,W+7.5,H-.18,.025);}
  else{for(const sx of [-1,1]){const cx=sx<0?-2.1:W+2.1;put(glass,cx,y+.6,frontRail,3.7,1.05,.018);put(bronze,cx,y+1.14,frontRail,3.8,.045,.065);put(glass,cx,y+H/2,D+.03,3.9,H-.18,.025)}}
  for(let x=left+.45;x<right-.3;x+=1.3){put(bronze,x,y+H/2,D+.08,.055,H,.12);if(floor!==p.floor||x<0||x>W)put(bronze,x,y+.58,frontRail,.035,1.12,.045)}
  for(const sx of [left+.2,right-.2]){put(bronze,sx,y+1.55,D+.14,.14,3.2,.32);put(glass,sx,y+H/2,D/2,.025,H-.2,D);}
 }
 // The selected balcony has real neighbouring bays and a soffit overhead.
 put(stone,-.12,H/2,D/2,.14,H,D);put(stone,W+.12,H/2,D/2,.14,H,D);
 // Photographic city replaces the complete procedural city, river and trees.
 // A 180-degree cylindrical projection preserves the photograph's proportions.
 // Rear projection is illustrative; this is not a georeferenced 360-degree capture.
 const photoMaterial=new THREE.MeshBasicMaterial({color:'#ffffff',side:THREE.DoubleSide,transparent:true,depthWrite:false,fog:false,toneMapped:false});photoMaterial.userData.noClay=true;materials.push(photoMaterial);
 const alphaCanvas=document.createElement('canvas');alphaCanvas.width=2;alphaCanvas.height=256;const ctx=alphaCanvas.getContext('2d'),fade=ctx.createLinearGradient(0,0,0,256);fade.addColorStop(0,'black');fade.addColorStop(.035,'white');fade.addColorStop(.97,'white');fade.addColorStop(1,'#eeeeee');ctx.fillStyle=fade;ctx.fillRect(0,0,2,256);const alpha=new THREE.CanvasTexture(alphaCanvas);api.textures.push(alpha);photoMaterial.alphaMap=alpha;
 const texture=new THREE.TextureLoader().load(new URL('./assets/wroclaw-real-panorama.jpg',import.meta.url).href,loaded=>{
  if(api.isDisposed()){loaded.dispose();return}
  const image=loaded.image,limit=Math.min(api.maxTextureSize,innerWidth<700?4096:8192);if(image.width>limit){const canvas=document.createElement('canvas');canvas.width=limit;canvas.height=Math.round(image.height*limit/image.width);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);loaded.image=canvas;loaded.needsUpdate=true}
  loaded.colorSpace=THREE.SRGBColorSpace;loaded.anisotropy=api.anisotropy;loaded.needsUpdate=true;photoMaterial.map=loaded;photoMaterial.needsUpdate=true;
 });api.textures.push(texture);
 for(let side=0;side<2;side++){
  const vertices=[],uvs=[],indices=[],count=128,radius=245;
  for(let i=0;i<=count;i++){const u=i/count,angle=-Math.PI/2+u*Math.PI+side*Math.PI;for(let row=0;row<2;row++){vertices.push(W/2+Math.sin(angle)*radius,row? -166:-2,D+Math.cos(angle)*radius);uvs.push(u,row?0:1)}}
  for(let i=0;i<count;i++){const k=i*2;indices.push(k,k+1,k+2,k+2,k+1,k+3)}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();const backdrop=new THREE.Mesh(geometry,photoMaterial);backdrop.name='Wrocław — Alexey Vazhnov / CC BY-SA 4.0';backdrop.renderOrder=-2;group.add(backdrop);
 }
 for(const {mat,geom,items} of batches.values()){const instance=new THREE.InstancedMesh(geom,mat,items.length);items.forEach((q,i)=>{dummy.position.set(q.x,q.y,q.z);dummy.rotation.set(0,q.angle,0);dummy.scale.set(q.w,q.h,q.d);dummy.updateMatrix();instance.setMatrixAt(i,dummy.matrix)});instance.instanceMatrix.needsUpdate=true;instance.castShadow=false;instance.receiveShadow=false;instance.computeBoundingSphere();group.add(instance)}
 return group;
}
