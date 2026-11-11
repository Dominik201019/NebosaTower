// Hinged interior doors. Automatic approach opening is also used by the room navigation.
export function createInteriorDoor(THREE,api,edge,room,m){
 const {world,box,mesh}=api,width=edge.door.width-.07,height=2.28,normal=room.key===edge.b?1:-1,root=new THREE.Group();world.add(root);
 root.position.set(edge.axis==='x'?edge.door.center:edge.at,0,edge.axis==='x'?edge.at:edge.door.center);root.rotation.y=edge.axis==='x'?(normal===1?0:Math.PI):(normal===1?Math.PI/2:-Math.PI/2);
 const panelMaterial=api.material('#e3dfd4',{roughness:.5}),lining=api.material('#b7b2a5',{roughness:.55}),seal=api.material('#77786e',{roughness:.9}),metal=api.material('#6b6d63',{metalness:.8,roughness:.23});
 for(const material of [panelMaterial,lining,seal,metal])material.userData.noClay=true;
 const add=(parent,w,h,d,x,y,z,mat)=>{const o=box(w,h,d,x,y,z,mat);parent.add(o);return o};
 for(const side of [-1,1]){add(root,.06,2.34,.17,side*(width/2+.05),1.17,0,lining);add(root,.012,2.28,.05,side*(width/2+.012),1.14,0,seal)}
 add(root,width+.16,.055,.17,0,2.32,0,lining);add(root,width+.045,.008,.13,0,.005,0,metal);
 const hinge=new THREE.Group();root.add(hinge);let hand=-1;hinge.position.x=hand*width/2;
 add(hinge,width,2.27,.045,-hand*width/2,1.14,0,panelMaterial);
 for(const face of [-1,1]){
  add(hinge,width-.18,2.06,.007,-hand*width/2,1.15,face*.025,panelMaterial);
  add(hinge,.045,.15,.017,-hand*(width-.12),1.04,face*.038,metal);add(hinge,.14,.021,.025,-hand*(width-.17),1.075,face*.064,metal);
  if(room.kind==='bath')add(hinge,.024,.024,.02,-hand*(width-.12),.998,face*.055,metal);
 }
 for(const y of [.27,1.14,2.02]){const pin=mesh(new THREE.CylinderGeometry(.012,.012,.11,14),metal,hand*.01,y,0,hinge);pin.name='Door hinge'}
 const markerCanvas=document.createElement('canvas');markerCanvas.width=512;markerCanvas.height=128;const ctx=markerCanvas.getContext('2d');ctx.fillStyle='#dfdacc';ctx.fillRect(0,0,512,128);ctx.fillStyle='#485950';ctx.textAlign='center';ctx.font='500 38px Arial';ctx.fillText(room.name,256,78);const labelTexture=new THREE.CanvasTexture(markerCanvas);labelTexture.colorSpace=THREE.SRGBColorSpace;api.textures.push(labelTexture);const labelMaterial=new THREE.MeshBasicMaterial({map:labelTexture,side:THREE.DoubleSide});labelMaterial.userData.noClay=true;api.materials.push(labelMaterial);
 for(const face of [-1,1]){const label=mesh(new THREE.PlaneGeometry(.40,.10),labelMaterial,-hand*width/2,1.73,face*.031,hinge);label.userData.doorLabel=true;if(face===-1)label.rotation.y=Math.PI}
 const closed=new THREE.Vector3();root.getWorldPosition(closed);const rotationCos=Math.cos(root.rotation.y),rotationSin=Math.sin(root.rotation.y);let angle=0,desired=false,clickedUntil=0;
 // Choose the hinge and swing side after the furniture has been placed.
 function chooseSwing(colliders){let best=null;for(const side of [-1,1])for(const into of [1,-1]){
   const theta=side*into*Math.PI*.5;let score=into===1?0:2;
   for(let i=1;i<=8;i++){const t=theta*i/8;for(let j=1;j<=5;j++){const x=side*width/2-side*width*j/5*Math.cos(t),z=side*width*j/5*Math.sin(t);const worldPoint=new THREE.Vector3(x,0,z).applyMatrix4(root.matrixWorld);for(const b of colliders)if(worldPoint.x>b.minX-.025&&worldPoint.x<b.maxX+.025&&worldPoint.z>b.minZ-.025&&worldPoint.z<b.maxZ+.025)score++}}
   if(!best||score<best.score)best={side,theta,score};
  }
  // Mirroring all leaf geometry swaps the hinge without rebuilding labels or handles.
  if(best.side===1){hinge.scale.x=-1;hinge.position.x=width/2}else hinge.position.x=-width/2;
  hinge.traverse(o=>{if(o.userData.doorLabel)o.scale.x=best.side===1?-1:1});
  hand=best.side;door.openAngle=best.theta;
 }
 const door={root,hinge,roomKey:room.key,name:room.name,center:closed,width,openAngle:-Math.PI/2,chooseSwing,
  click(now){clickedUntil=now+8000},
  update(dt,now,position,path,reduced,overview){
   root.visible=!overview;if(overview)return;
   const distance=Math.hypot(position.x-closed.x,position.z-closed.z),routeNear=path.some(v=>Math.hypot(v.x-closed.x,v.z-closed.z)<1.5);
   desired=distance<(desired?2.35:1.9)||routeNear||now<clickedUntil;
   const target=desired?door.openAngle:0;angle+=(target-angle)*(reduced?1:1-Math.exp(-dt*7));if(Math.abs(angle-target)<.001)angle=target;hinge.rotation.y=angle;root.updateMatrixWorld(true);
  },
  blocks(x,z,r=.19,atAngle=angle){
   // Segment test against the actual rotating leaf, including its thickness.
   const hx=hand*width/2,hz=0,ex=hx-hand*width*Math.cos(atAngle),ez=hand*width*Math.sin(atAngle),dx=x-closed.x,dz=z-closed.z;
   const lx=rotationCos*dx-rotationSin*dz,lz=rotationSin*dx+rotationCos*dz,vx=ex-hx,vz=ez-hz,t=Math.max(0,Math.min(1,((lx-hx)*vx+(lz-hz)*vz)/(width*width)));
   return Math.hypot(lx-hx-vx*t,lz-hz-vz*t)<r+.025;
  }
 };
 root.userData.interiorDoor=door;root.updateMatrixWorld(true);return door;
}
