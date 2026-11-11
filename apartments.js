'use strict';
// Fictional, deterministic catalog; prices are total gross PLN for the apartment only.
window.NEBOSA_APARTMENTS=[];
for(let floor=2;floor<=28;floor++){
 ['A','B','C'].forEach((letter,index)=>{
  const penthouse=floor===28,area=penthouse?[145,174,212][index]:Math.round(([42,68,95][index]+floor*[.45,.6,.8][index])*10)/10;
  const rooms=penthouse?[4,5,5][index]:index+2;
  const rate=penthouse?[28500,30000,32000][index]:19200+floor*220+index*650;
  const status=(floor+index*3)%13===0?'Sprzedany':(floor+index*2)%7===0?'Zarezerwowany':'Dostępny';
  const shares=rooms===2?[['Salon z aneksem',.48],['Sypialnia',.28],['Łazienka',.11],['Hol',0]]:rooms===3?[['Salon z aneksem',.4],['Sypialnia główna',.2],['Pokój',.16],['Łazienka',.1],['Hol',0]]:rooms===4?[['Salon z aneksem',.35],['Sypialnia główna',.18],['Pokój 1',.14],['Pokój 2',.12],['Łazienka',.08],['WC',.03],['Hol',0]]:[['Salon z aneksem',.32],['Sypialnia główna',.18],['Pokój 1',.13],['Pokój 2',.12],['Gabinet',.10],['Łazienka',.06],['WC',.02],['Hol',0]];
  let used=0;const schedule=shares.map(([name,fraction],i)=>{const value=i===shares.length-1?Math.round((area-used)*10)/10:Math.round(area*fraction*10)/10;used=Math.round((used+value)*10)/10;return{name,area:value}});
  window.NEBOSA_APARTMENTS.push({id:`N.${String(floor).padStart(2,'0')}.${letter}`,floor,letter,area,rooms,rate,price:Math.round(area*rate),status,penthouse,balcony:penthouse?[32,46,62][index]:Math.round((7+index*3+floor*.15)*10)/10,orientation:['Południowy zachód','Południowy wschód','Północny zachód'][index],name:penthouse?'Penthouse / kolekcja Horyzont':['Riverside / światło i oddech','Panorama / przestrzeń dla Ciebie','Skyline / nowy wymiar codzienności'][index],schedule,parking:penthouse?120000:95000,storage:18000,ceiling:penthouse?'3,20':'2,85',level:penthousesafe(penthouse)});
 });
}
function penthousesafe(value){return value?'Kolekcja penthouse':'Apartament standardowy'}


// Four architectural templates: open foyers and genuinely different room arrangements.
window.NEBOSA_LAYOUT=function(p){
 const templates={
 2:{W:8.4,D:6.8,rooms:[['living','Salon z aneksem','living',[[0,3.2,8.4,3.6]]],['bed-0','Sypialnia','bed',[[0,0,3.6,3.2]]],['bath-0','Łazienka','bath',[[5.4,0,3,2.8]]],['hall','Hol otwarty','hall',[[3.6,0,1.8,3.2],[5.4,2.8,3,.4]]]]},
 3:{W:9.6,D:8,rooms:[['living','Salon z aneksem','living',[[0,5,9.6,3]]],['bed-0','Sypialnia główna','bed',[[0,0,3.6,3.5]]],['bed-1','Pokój','bed',[[3.6,0,3.4,3.5]]],['bath-0','Łazienka','bath',[[7,0,2.6,3]]],['hall','Hol otwarty','hall',[[0,3.5,7,1.5],[7,3,2.6,2]]]]},
 4:{W:11,D:10,rooms:[['living','Salon z aneksem','living',[[3.7,5.2,7.3,4.8]]],['bed-0','Sypialnia główna','bed',[[0,5.2,3.7,4.8]]],['bed-1','Pokój 1','bed',[[0,0,4,3.7]]],['bed-2','Pokój 2','bed',[[4,0,3.5,3.7]]],['bath-0','Łazienka','bath',[[9,0,2,3]]],['bath-1','WC','bath',[[9,3,2,2.2]]],['hall','Galeria wejściowa','hall',[[7.5,0,1.5,5.2],[0,3.7,7.5,1.5]]]]},
 5:{W:13,D:12,rooms:[['living','Salon z jadalnią','living',[[4.2,5.4,5.4,6.6],[0,9.4,4.2,2.6],[9.6,8.6,3.4,3.4]]],['bed-0','Sypialnia główna','bed',[[0,5.4,4.2,4]]],['bed-1','Pokój 1','bed',[[0,0,4.2,3.8]]],['bed-2','Pokój 2','bed',[[4.2,0,3.8,3.8]]],['bed-3','Gabinet','office',[[9.6,5.4,3.4,3.2]]],['bath-0','Łazienka','bath',[[9.6,0,3.4,3.8]]],['bath-1','WC','bath',[[9.6,3.8,3.4,1.6]]],['hall','Galeria wejściowa','hall',[[8,0,1.6,5.4],[0,3.8,8,1.6]]]]}
 };
 const t=templates[p.rooms],scale=Math.sqrt(p.area/(t.W*t.D)),W=t.W*scale,D=t.D*scale;
 const rooms=t.rooms.map(([key,name,kind,rects])=>{const parts=rects.map(([x,z,w,d])=>({x:x*scale,z:z*scale,w:w*scale,d:d*scale}));return {key,name,kind,...parts[0],parts,area:Math.round(parts.reduce((a,r)=>a+r.w*r.d,0)*10)/10}});
 const balconyW=Math.min(W,Math.max(3.8,p.balcony/1.75)),balcony={key:'balcony',name:p.penthouse?'Taras':'Balkon',kind:'balcony',area:p.balcony,x:(W-balconyW)/2,z:D,w:balconyW,d:p.balcony/balconyW};balcony.parts=[{x:balcony.x,z:D,w:balcony.w,d:balcony.d}];rooms.push(balcony);
 const inside=(r,x,z)=>r.parts.some(q=>x>q.x-1e-6&&x<q.x+q.w+1e-6&&z>q.z-1e-6&&z<q.z+q.d+1e-6);
 const all=rooms.slice(0,-1),xs=[...new Set(all.flatMap(r=>r.parts.flatMap(q=>[q.x,q.x+q.w])).map(n=>+n.toFixed(7)))].sort((a,b)=>a-b),zs=[...new Set(all.flatMap(r=>r.parts.flatMap(q=>[q.z,q.z+q.d])).map(n=>+n.toFixed(7)))].sort((a,b)=>a-b),segments=[];
 const owner=(x,z)=>all.find(r=>inside(r,x,z))?.key||null;
 for(const axis of ['x','z']){const coords=axis==='x'?zs:xs,steps=axis==='x'?xs:zs;for(const at of coords){let prior=null;for(let i=0;i<steps.length-1;i++){const start=steps[i],end=steps[i+1],mid=(start+end)/2;const a=axis==='x'?owner(mid,at-.0001):owner(at-.0001,mid),b=axis==='x'?owner(mid,at+.0001):owner(at+.0001,mid);if(a===b){prior=null;continue}if(prior&&prior.a===a&&prior.b===b&&Math.abs(prior.end-start)<1e-5){prior.end=end;continue}prior={axis,at,start,end,a,b};segments.push(prior)}}}
 for(const edge of segments){if(!edge.a||!edge.b)continue;const a=rooms.find(r=>r.key===edge.a),b=rooms.find(r=>r.key===edge.b),publicRoom=r=>r.kind==='hall'||r.kind==='living';edge.open=publicRoom(a)&&publicRoom(b);if(edge.open)continue;if(publicRoom(a)!==publicRoom(b)&&edge.end-edge.start>1.05){edge.door={center:(edge.start+edge.end)/2,width:Math.min(1.12,(edge.end-edge.start)-.2)};const privateRoom=publicRoom(a)?b:a;if(privateRoom.entry){edge.door=null;continue}privateRoom.entrySide=edge.axis==='x'?(privateRoom.key===edge.b?'front':'back'):(privateRoom.key===edge.b?'left':'right');privateRoom.entry={x:edge.axis==='x'?edge.door.center:edge.at,z:edge.axis==='x'?edge.at:edge.door.center};}}
 const living=rooms[0],kitchenPart=living.parts.filter(q=>Math.abs(q.x+q.w-W)<.001).sort((a,b)=>b.d-a.d)[0],module=.6,count=Math.min(5,Math.floor((kitchenPart.d-.36)/module));living.kitchen={x:W-.40,wallX:W,first:kitchenPart.z+.18+module/2,count,module,part:kitchenPart};living.kitchenStart=living.kitchen.first;
 rooms[0].area=Math.round((rooms[0].area+p.area-rooms.slice(0,-1).reduce((a,r)=>a+r.area,0))*10)/10;return {W,D,rooms,segments,depth:D+balcony.d,scale};
};
// Keep the catalog's room schedule in agreement with the actual model, including L-shaped rooms.
for(const p of window.NEBOSA_APARTMENTS){const rooms=window.NEBOSA_LAYOUT(p).rooms.filter(r=>r.kind!=='balcony');let sum=rooms.reduce((s,r)=>s+r.area,0);rooms[0].area=Math.round((rooms[0].area+p.area-sum)*10)/10;p.schedule=rooms.map(r=>({name:r.name,area:r.area}));}

// One shared seating rule: the TV and sofa share the same sight line.
window.NEBOSA_SEATING=function(r){const sofaLength=Math.min(2.8,r.d-.8),tvZ=r.z+Math.min(r.d*.5,1.8),sofaX=r.x+Math.min(2.8,r.w*.49);return {sofa:{x:sofaX,z:tvZ,length:sofaLength,depth:.95,angle:-Math.PI/2},tv:{x:r.x+.12,z:tvZ},table:{x:sofaX-1.15,z:tvZ},rug:{x:sofaX-.55,z:tvZ,w:2.55,d:sofaLength+.45}}};

window.NEBOSA_DINING=function(r){const wing=r.parts.find(q=>q.x<r.x-.01);const x=wing?wing.x+wing.w*.55:r.x+r.w*.63,z=wing?wing.z+wing.d*.5:Math.min(r.z+r.d-1.3,r.z+r.d*(r.d>3.5?.78:.5));return {x,z,radius:.52,chairs:[{x,z:z-.86,rotation:0},{x,z:z+.86,rotation:Math.PI}]}};
