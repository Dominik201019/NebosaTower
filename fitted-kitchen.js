// A single fitted run on a real exterior wall. Every module shares the same grid.
export function buildFittedKitchen(THREE,api,room,m){
 const k=room.kitchen,{x,first,count,module,wallX}=k,{box,rounded,cylinder,mesh}=api,solids=[];
 const countertopY=.91;
 for(let i=0;i<count;i++){
  const z=first+i*module;
  if(i===0){
   rounded(.62,2.22,.586,x,1.13,z,m.white,.015);
   box(.023,1.39,.55,x-.323,1.51,z,m.white);box(.023,.63,.55,x-.323,.47,z,m.white);box(.026,.009,.55,x-.338,.8,z,m.seam);
   box(.025,.40,.018,x-.355,1.40,z+.19,m.chrome);box(.025,.22,.018,x-.355,.48,z+.19,m.chrome);
  }else{
   box(.60,.79,.588,x,.465,z,m.wood);box(.50,.09,.56,x+.03,.085,z,m.seam);
   box(.023,.72,.55,x-.313,.47,z,m.white);box(.028,.014,.30,x-.337,.78,z,m.chrome);
   if(i!==2)box(.66,.045,.60,x,countertopY-.0225,z,m.quartz);
   else{
    // Four pieces create a real opening around the basin, rather than a bowl through a solid slab.
    for(const side of [-1,1]){box(.135,.045,.60,x+side*.2625,countertopY-.0225,z,m.quartz);box(.39,.045,.105,x,countertopY-.0225,z+side*.2475,m.quartz)}
   }
   // Upper cabinets are attached to the wall, above the counter, never over the refrigerator.
   box(.31,.66,.575,wallX-.245,2.03,z,m.white);box(.022,.61,.54,wallX-.412,2.03,z,m.white);box(.023,.015,.25,wallX-.427,1.75,z,m.chrome);
   box(.015,.54,.59,wallX-.084,1.19,z,m.tile);
  }
  solids.push({x,z,w:.72,d:.60,name:i?'Kitchen cabinet':'Refrigerator'});
 }
 const hobZ=first+module;
 box(.49,.009,.50,x,countertopY+.006,hobZ,m.oven);for(const dx of [-.13,.13])for(const dz of [-.13,.13]){const ring=mesh(new THREE.TorusGeometry(.068,.0025,6,28),m.chrome,x+dx,countertopY+.013,hobZ+dz);ring.rotation.x=-Math.PI/2}
 rounded(.025,.44,.51,x-.333,.45,hobZ,m.oven,.012);box(.012,.30,.42,x-.351,.44,hobZ,m.screen);box(.035,.023,.42,x-.372,.65,hobZ,m.chrome);
 box(.39,.035,.52,wallX-.28,1.68,hobZ,m.chrome);
 const sinkZ=first+2*module;
 const basin=mesh(new THREE.LatheGeometry([[.025,0],[.09,0],[.16,.07],[.19,.12],[.205,.14],[.198,.15],[.18,.125],[.135,.05],[.025,.025]].map(q=>new THREE.Vector2(...q)),40),m.chrome,x,.765,sinkZ);basin.scale.z=1.04;
 const faucet=new THREE.CatmullRomCurve3([new THREE.Vector3(x+.23,.915,sinkZ),new THREE.Vector3(x+.23,1.18,sinkZ),new THREE.Vector3(x+.02,1.18,sinkZ),new THREE.Vector3(x+.02,1.07,sinkZ)]);mesh(new THREE.TubeGeometry(faucet,24,.012,10,false),m.chrome,0,0,0);
 for(const side of [-1,1])box(.64,.87,.024,x,.455,side<0?first-.31:first+(count-1)*module+.31,m.white);
 return solids;
}
