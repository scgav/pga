
const grid=document.getElementById('grid'), countEl=document.getElementById('count'), barFill=document.getElementById('barFill');
const selections=new Map(); let submitted=false; let cards=[];

const PGA_PLAYER_LIST="https://data-api.pgatour.com/player/list/R";
const PGA_HEADSHOT=id=>`https://pga-tour-res.cloudinary.com/image/upload/c_thumb,g_face,w_600,h_600,z_0.72/headshots_${id}.jpg`;

// Verified IDs are also embedded so many prominent players load even if the directory request is blocked.
const VERIFIED_IDS={
"Scottie Scheffler":"46046","Rory McIlroy":"28237","Brooks Koepka":"36689","Cameron Young":"57366",
"Si Woo Kim":"37455","Chris Gotterup":"59095","Sam Burns":"47504","Tommy Fleetwood":"30911",
"Jacob Bridgeman":"60004","Russell Henley":"34098","Ryan Gerard":"59018","Gary Woodland":"31323",
"Kristoffer Reitan":"49855","Min Woo Lee":"37378","J.J. Spaun":"39324","Robert MacIntyre":"52215",
"Maverick McNealy":"46442","Michael Brennan":"61522","Ryo Hisatsune":"51287","Ben Griffin":"54591",
"Nico Echavarria":"51349","Austin Smotherman":"50095","Sahith Theegala":"51634","Matt McCarty":"59141",
"Pierceson Coody":"59836","Harris English":"34099","Doug Ghim":"52375","Michael Thorbjornsen":"57364",
"Eric Cole":"47591","Harry Hall":"57975","Sungjae Im":"39971","Ludvig Åberg":"52955",
"Alex Smalley":"46340","Jordan Spieth":"34046"
};

function norm(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim()}
function initials(n){return n.split(/\s+/).map(x=>x[0]).slice(0,2).join("")}
function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const board=shuffle([...PLAYERS]);

async function resolvePgaIds(){
  const ids={...VERIFIED_IDS};
  try{
    const r=await fetch(PGA_PLAYER_LIST,{mode:"cors"});
    if(!r.ok) throw new Error("directory unavailable");
    const d=await r.json();
    const rows=Array.isArray(d)?d:(d.players||[]);
    const byName=new Map(rows.map(p=>[norm(p.displayName||`${p.firstName||""} ${p.lastName||""}`),String(p.id)]));
    PLAYERS.forEach(p=>{const id=byName.get(norm(p.name));if(id)ids[p.name]=id});
  }catch(e){
    console.warn("PGA TOUR player directory request was blocked; using embedded verified IDs.",e);
  }
  return ids;
}

function usedElsewhere(cardId){return new Set([...selections.entries()].filter(([id])=>id!==cardId).map(([,name])=>name))}
function matches(query,name){const q=norm(query);if(!q)return true;const n=norm(name);return q.split(" ").every(part=>n.includes(part))}
function updateProgress(){const n=selections.size;countEl.textContent=n;barFill.style.width=n+"%"}
function renderMenu(card,input,menu,player){
 if(submitted)return;
 const used=usedElsewhere(player.id),q=input.value;
 const options=PLAYERS.filter(p=>!used.has(p.name)&&matches(q,p.name)).slice(0,12);
 menu.innerHTML="";
 if(!options.length){menu.innerHTML='<div class="empty">No available names match.</div>';menu.classList.add("open");return}
 options.forEach(p=>{const d=document.createElement("div");d.className="option";d.textContent=p.name;d.setAttribute("role","option");
 d.addEventListener("mousedown",e=>{e.preventDefault();choose(card,input,menu,player,p.name)});menu.appendChild(d)});
 menu.classList.add("open");
}
function choose(card,input,menu,player,name){selections.set(player.id,name);input.value=name;input.dataset.selected=name;card.classList.add("matched");menu.classList.remove("open");updateProgress()}
function clearChoice(card,input,menu,player){selections.delete(player.id);input.value="";input.dataset.selected="";card.classList.remove("matched");menu.classList.remove("open");updateProgress();input.focus();renderMenu(card,input,menu,player)}
function makeCard(player,idx,pgaIds){
 const card=document.createElement("article");card.className="card";card.dataset.id=player.id;
 card.innerHTML=`<div class="photoWrap"><div class="rank">FACE ${idx+1}</div><div class="fallback">${initials(player.name)}</div><img hidden alt="Golfer headshot"></div>
 <div class="answer"><input autocomplete="off" spellcheck="false" aria-label="Name this golfer" placeholder="Type a player name…"><button type="button" class="clear" aria-label="Clear answer">×</button><div class="menu" role="listbox"></div></div><div class="feedback"></div>`;
 const img=card.querySelector("img"),fallback=card.querySelector(".fallback"),input=card.querySelector("input"),menu=card.querySelector(".menu"),clear=card.querySelector(".clear");
 const pid=pgaIds[player.name];
 if(pid){
   img.src=PGA_HEADSHOT(pid);
   img.onload=()=>{fallback.hidden=true;img.hidden=false};
   img.onerror=()=>{img.hidden=true;fallback.hidden=false};
 }
 input.addEventListener("focus",()=>renderMenu(card,input,menu,player));
 input.addEventListener("input",()=>{if(input.dataset.selected&&input.value!==input.dataset.selected){selections.delete(player.id);input.dataset.selected="";card.classList.remove("matched");updateProgress()}renderMenu(card,input,menu,player)});
 input.addEventListener("keydown",e=>{const opts=[...menu.querySelectorAll(".option")];let active=opts.findIndex(x=>x.classList.contains("active"));
  if(e.key==="ArrowDown"){e.preventDefault();active=Math.min(active+1,opts.length-1);opts.forEach(x=>x.classList.remove("active"));opts[active]?.classList.add("active");opts[active]?.scrollIntoView({block:"nearest"})}
  if(e.key==="ArrowUp"){e.preventDefault();active=Math.max(active-1,0);opts.forEach(x=>x.classList.remove("active"));opts[active]?.classList.add("active");opts[active]?.scrollIntoView({block:"nearest"})}
  if(e.key==="Enter"&&opts.length){e.preventDefault();choose(card,input,menu,player,opts[Math.max(active,0)].textContent)}
  if(e.key==="Escape")menu.classList.remove("open");
 });
 input.addEventListener("blur",()=>setTimeout(()=>menu.classList.remove("open"),100));
 clear.addEventListener("click",()=>clearChoice(card,input,menu,player));
 grid.appendChild(card);cards.push({card,input,player});
}
async function init(){
 const pgaIds=await resolvePgaIds();
 board.forEach((p,i)=>makeCard(p,i,pgaIds));updateProgress();
 const missing=PLAYERS.filter(p=>!pgaIds[p.name]).length;
 if(missing) document.getElementById("imageNotice").textContent=`PGA TOUR headshots loaded. ${missing} player ID${missing===1?"":"s"} could not be resolved in this browser; those cards use initials.`;
}
init();

document.getElementById("submitBtn").addEventListener("click",()=>{
 const missing=100-selections.size,msg=document.getElementById("submitMsg");
 if(missing&&!confirm(`You still have ${missing} unmatched ${missing===1?"player":"players"}. Submit anyway?`))return;
 submitted=true;let score=0;
 cards.forEach(({card,input,player})=>{const guess=selections.get(player.id)||"",ok=guess===player.name;if(ok)score++;
 card.classList.add(ok?"correct":"wrong");card.querySelector(".feedback").textContent=ok?"✓ Correct":`✕ ${guess||"No answer"} → ${player.name}`;input.disabled=true;card.querySelector(".clear").style.display="none"});
 document.getElementById("score").textContent=score;
 document.getElementById("scoreLine").textContent=score>=90?"Tour-level face recognition. Ridiculous.":score>=75?"You know this field extremely well.":score>=50?"Solid — but the bottom half got you.":"The FedExCup Fall sickos have defeated you.";
 document.getElementById("results").showModal();msg.textContent="";
});
document.getElementById("reviewBtn").addEventListener("click",()=>document.getElementById("results").close());
document.getElementById("playAgainBtn").addEventListener("click",()=>location.reload());
document.getElementById("resetBtn").addEventListener("click",()=>{if(confirm("Clear every answer and reshuffle the board?"))location.reload()});
