const firebaseConfig = {
  apiKey: "AIzaSyD0-Lmvx-dmxvQcb_b4T3U-D4sdadH9Y3g",
  authDomain: "l9-boss-tracker.firebaseapp.com",
  databaseURL: "https://l9-boss-tracker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "l9-boss-tracker",
  storageBucket: "l9-boss-tracker.firebasestorage.app",
  messagingSenderId: "24208974708",
  appId: "1:24208974708:web:925e95b886b8ead9924221"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

db.ref("bossTimers").on("value", snap => {
    cloudData = snap.val() || {};
    updateTimers();
    sortBosses();
});


let cloudData = {};
let isTyping = false;
let isAdmin = false;
let expandedCard = null;

function resetCardState(card){
    if(!card) return;

    // Close dropdown
    const dropdown = card.querySelector(".boss-dropdown");
    const menuBtn = card.querySelector(".boss-menu");
    const overlay = card.querySelector(".details-overlay");
    const title = card.querySelector(".details-box h3");

    if(dropdown) dropdown.classList.remove("active");
    if(menuBtn) menuBtn.classList.remove("active");
    if(overlay) overlay.classList.remove("menu-open");
    if(title) title.classList.remove("fade-out");
}


document.addEventListener("click", function(e){

    // ================= LOOT CLICK =================
    const loot = e.target.closest(".loot-slot");
    if(loot){

    const popup = document.getElementById("itemPopup"); 

const nameEl = document.getElementById("itemName");
const rarityEl = document.getElementById("itemRarity");
const rarity = (loot.dataset.rarity || "").toLowerCase();

const type = (loot.dataset.type || "").toLowerCase();

const weaponKeywords = [
    "staff",
    "battle staff",
    "shield",
    "sword and shield",
    "crossbow",
    "bow",
    "greatsword",
    "knuckles"
];

const isWeapon = weaponKeywords.some(keyword => type.includes(keyword));

// Reset old classes
nameEl.className = "";
rarityEl.className = "";

// Set text
nameEl.innerText = loot.dataset.name || "";
setTimeout(() => {

    const wrapper = nameEl.parentElement;

    if (nameEl.scrollWidth > wrapper.clientWidth) {

        const text = loot.dataset.name;

        nameEl.innerHTML = `
            <span>${text}</span>
            <span>${text}</span>
        `;

        const totalWidth = nameEl.scrollWidth;
        const speed = totalWidth / 60; // adjust speed here

        nameEl.style.animationDuration = speed + "s";
        nameEl.classList.add("name-scroll");

    } else {
        nameEl.classList.remove("name-scroll");
        nameEl.innerText = loot.dataset.name;
    }

}, 50);



rarityEl.innerText = "Rarity: " + (loot.dataset.rarity || "");

// Apply rarity colors
if(rarity === "epic") {
    nameEl.classList.add("name-epic");
    rarityEl.classList.add("rarity-epic");
}
else if(rarity === "legendary") {
    nameEl.classList.add("name-legendary");
    rarityEl.classList.add("rarity-legendary");
}
else if(rarity === "mythic") {
    nameEl.classList.add("name-mythic");
    rarityEl.classList.add("rarity-mythic");
}



    document.getElementById("itemType").innerText = loot.dataset.type || "";

    const statsText = loot.dataset.stats || "";
    document.getElementById("itemStats").innerHTML =
        statsText.replaceAll("|", "<br>");

    
    document.getElementById("itemLocation").innerText = loot.dataset.location || "";
    document.getElementById("itemImage").src = loot.querySelector("img").src;
    // ================= OPTIONS RENDER =================
const optionsContainer = document.getElementById("itemOptions");
optionsContainer.innerHTML = "";
if (rarity === "epic" && isWeapon) {

    const header = document.createElement("div");
    header.className = "option-header";
    header.innerHTML = `
        <span>Option Name</span>
        <span>Stats</span>
        <span>Success Rate</span>
    `;
    optionsContainer.appendChild(header);

    epicOptions.forEach(opt => {
        const row = document.createElement("div");
        row.className = "option-row";
        row.innerHTML = `
            <span>${opt.name}</span>
            <span>${opt.value}</span>
            <span>${opt.success}</span>
        `;
        optionsContainer.appendChild(row);
    });
}


    

document.getElementById("itemDesc").innerText = isWeapon 
    ? "" 
    : (loot.dataset.desc || "");


    popup.classList.add("active");
    document.body.style.overflow = "hidden";

    return;
}


    // ================= CLOSE POPUP =================
    if(e.target.id === "itemPopup"){
        document.getElementById("itemPopup").classList.remove("active");
        document.body.style.overflow = "auto";

        return;
    }

    // ================= BOSS CARD =================
    const card = e.target.closest(".card");

   if(!card){
    if(expandedCard){
        resetCardState(expandedCard);
        expandedCard.classList.remove("show-details");
        expandedCard = null;
    }
    return;
}

    if(e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;

   if(expandedCard && expandedCard !== card){
    resetCardState(expandedCard);
    expandedCard.classList.remove("show-details");
}


    if(card.classList.contains("show-details")){
        card.classList.remove("show-details");
        expandedCard = null;
    } else {
        card.classList.add("show-details");
        expandedCard = card;
    }

});



/* ===== TIMEZONE LOCAL STORAGE UPGRADE ===== */
let selectedOffset = 8;
const timezoneSelect = document.getElementById("timezoneSelect");


const savedOffset = localStorage.getItem("timezoneOffset");
if(savedOffset){
    selectedOffset = parseInt(savedOffset);
    timezoneSelect.value = savedOffset;
}

// tngina nakaka pressure 
timezoneSelect.addEventListener("change", function(){
    selectedOffset = parseInt(this.value);
    localStorage.setItem("timezoneOffset", selectedOffset);
});
/* ========================================== */

function convertTimezone(date){
    const utc = date.getTime() + (date.getTimezoneOffset()*60000);
    return new Date(utc + selectedOffset*3600000);
}

function adminLogin(){
    document.querySelector(".admin-btn").classList.add("active-admin");
    const password = prompt("Enter Admin Password:");
    
    if(password === "1900"){   // changeable By teshi
        isAdmin = true;
        alert("Admin mode activated");
        applyAdminMode();
    } else {
        alert("Wrong password");
    }
}


/* ===== FULL BOSS LIST ===== */
const bosses = [

{
  name: "Venatus",
  type: "interval",
  hours: 10,
  image: "Pictures/Venatus.png",

  info: "Ancient dragon of the abyss.",
  location: "Forgotten Canyon",
  weakness: "Lightning",
  recommended: "5-7 Players",

  drops: [
      { name: "Delphon Saddle", rarity:"Mythic", type:"Mount Ticket" },
      { name: "Azzam Hissan Knuckles", rarity:"Epic", type:"Knuckles" }
  ]
},

{ name:"Viorent", type:"interval", hours:10, image:"Pictures/Viorent.png"},
{ name:"Ego", type:"interval", hours:21, image:"Pictures/Ego.png"},
{ name:"Livera", type:"interval", hours:24, image:"Pictures/Livera.png"},
{ name:"Araneo", type:"interval", hours:24, image:"Pictures/Araneo.png"},
{ name:"Undomiel", type:"interval", hours:24, image:"Pictures/Undomiel.png"},
{ name:"Lady Dalia", type:"interval", hours:18, image:"Pictures/Lady Dalia.png"},
{ name:"General Aquleus", type:"interval", hours:29, image:"Pictures/General Aquleus.png"},
{ name:"Amentis", type:"interval", hours:29, image:"Pictures/Amentis.png"},
{ name:"Baron Braudmore", type:"interval", hours:32, image:"Pictures/Baron Braudmore.png"},
{ name:"Wannitas", type:"interval", hours:48, image:"Pictures/Wannitas.png"},
{ name:"Metus", type:"interval", hours:48, image:"Pictures/Metus.png"},
{ name:"Duplican", type:"interval", hours:48, image:"Pictures/Duplican.png"},
{ name:"Shuliar", type:"interval", hours:35, image:"Pictures/Shuliar.png"},
{ name:"Gareth", type:"interval", hours:32, image:"Pictures/Gareth.png"},
{ name:"Titore", type:"interval", hours:37, image:"Pictures/Titore.png"},
{ name:"Larba", type:"interval", hours:35, image:"Pictures/Larba.png"},
{ name:"Catena", type:"interval", hours:35, image:"Pictures/Catena.png"},
{ name:"Secreta", type:"interval", hours:62, image:"Pictures/Secreta.png"},
{ name:"Ordo", type:"interval", hours:62, image:"Pictures/Ordo.png"},
{ name:"Asta", type:"interval", hours:62, image:"Pictures/Asta.png"},
{ name:"Supore", type:"interval", hours:62, image:"Pictures/Supore.png"},

{ name:"Clemantis", type:"fixed",
schedule:[{day:1,time:"11:30"},{day:4,time:"19:00"}],
image:"Pictures/Clemantis.png"},

{ name:"Saphirus", type:"fixed",
schedule:[{day:0,time:"17:00"},{day:2,time:"11:30"}],
image:"Pictures/Saphirus.png"},

{ name:"Neutro", type:"fixed",
schedule:[{day:2,time:"19:00"},{day:4,time:"11:30"}],
image:"Pictures/Neutro.png"},

{ name:"Thymele", type:"fixed",
schedule:[{day:1,time:"19:00"},{day:3,time:"11:30"}],
image:"Pictures/Thymele.png"},

{ name:"Milavy", type:"fixed",
schedule:[{day:6,time:"15:00"}],
image:"Pictures/Milavy.png"},

{ name:"Ringor", type:"fixed",
schedule:[{day:6,time:"17:00"}],
image:"Pictures/Ringor.png"},

{ name:"Roderick", type:"fixed",
schedule:[{day:5,time:"19:00"}],
image:"Pictures/Roderick.png"},

{ name:"Auraq", type:"fixed",
schedule:[{day:5,time:"22:00"},{day:3,time:"21:00"}],
image:"Pictures/Auraq.png"},

{ name:"Chaiflock", type:"fixed",
schedule:[{day:6,time:"22:00"}],
image:"Pictures/Chaiflock.png"},

{ name:"Benji", type:"fixed",
schedule:[{day:0,time:"21:00"}],
image:"Pictures/Benji.png"},
{
    
  name: "Icaruthia",
  type: "fixed",
  disabled: true,
  schedule: [
    { day: 2, time: "21:00" },
    { day: 5, time: "21:00" }
  ],
  image: "Pictures/Icaruthia.png"
},

{
  name: "Motti",
  type: "fixed",
  disabled: true,
  schedule: [
    { day: 3, time: "19:00" },  // Wednesday
    { day: 6, time: "19:00" }   // Saturday
  ],
  image: "Pictures/Motti.png"
},

{
  name: "Nevaeh",
  type: "fixed",
  disabled: true,
  schedule: [
    { day: 0, time: "22:00" }   // Sunday
  ],
  image: "Pictures/Nevaeh.png"
},


{ name:"Tumier", type:"fixed",
schedule:[{day:0,time:"19:00"}],
image:"Pictures/Tumier.png"}

];
/* ===== END BOSS LIST ===== */



function getNextFixedSpawn(schedule){
    const now = new Date();
    let next = null;

    schedule.forEach(s=>{
        const target = new Date();
        const [h,m] = s.time.split(":");
        target.setHours(h,m,0,0);
        const dayDiff = (s.day - now.getDay() + 7) % 7;
        target.setDate(now.getDate() + dayDiff);
        if(target <= now) target.setDate(target.getDate()+7);
        if(!next || target < next) next = target;
    });

    return next;
}

function formatTime(ms){
    const total = Math.max(0, Math.ceil(ms/1000));
    const h = Math.floor(total/3600);
    const m = Math.floor((total%3600)/60);
    const s = total%60;
    return `${h}h ${m}m ${s}s`;
}

function isSameDay(d1,d2){
    return d1.getFullYear()===d2.getFullYear() &&
           d1.getMonth()===d2.getMonth() &&
           d1.getDate()===d2.getDate();
}

function isTomorrow(spawn, now){
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate()+1);
    return isSameDay(spawn, tomorrow);
}
const lootData = {
    Venatus: [

{
    name: "Delphon Saddle",
    rarity: "Mythic",
    type: "Mount Summon Ticket",
    img: "Boss loots/1.Venatus/Delphon Saddle.png",
    desc: "A saddle used to obtain Mount Delphon. If you already own the mount, you will receive 4 Mount Parts instead.",
    stats: ""
},

{
    name: "Azzam Hissan Knuckles",
    rarity: "Epic",
    type: "Knuckles",
    img: "Boss loots/1.Venatus/Azzam Hissan Knuckles.png",
    desc: "Epic knuckles infused with battle power.",
    stats: "Melee Attack: 200 | Additional Option: 3 Options"
},

{
    name: "Azzam Hissan Sword and Shield",
    rarity: "Epic",
    type: "Sword and Shield",
    img: "Boss loots/1.Venatus/Azzam hissan Sword And Shield.png",
    desc: "Epic sword and shield set crafted for frontline combat.",
    stats: "Melee Attack: 540 | Additional Option: 3 Options"
},

{
    name: "Azzam Hissan Battle Staff",
    rarity: "Epic",
    type: "Battle Staff",
    img: "Boss loots/1.Venatus/Azzam Hissan Battle Staff.png",
    desc: "Epic battle staff infused with arcane energy.",
    stats: "Magic Attack: 565 | Additional Option: 3 Options"
}

],
Viorent: [

{
    name: "Lamphon Saddle",
    rarity: "Legendary",
    type: "Mount Summon Ticket",
    img: "Boss loots/2.Viorent/Lamphon Saddle.png",
    desc: "A saddle used to obtain Mount Lamphon. If you already own the mount, you will receive 3 Mount Parts instead.",
    stats: ""
},

{
    name: "Serad Knuckles",
    rarity: "Epic",
    type: "Knuckles",
    img: "Boss loots/2.Viorent/Serad Knuckles.png",
    desc: "Epic knuckles forged with brutal combat energy.",
    stats: "Melee Attack 204 | Additional Option: 3 Options"
},

{
    name: "Serad Battle Staff",
    rarity: "Epic",
    type: "Battle Staff",
    img: "Boss loots/2.Viorent/Serad Battle Staff.png",
    desc: "Epic staff infused with arcane destructive power.",
    stats: "Magic Attack 580 | Additional Option: 3 Options"
},

{
    name: "Serad Battle Shield",
    rarity: "Epic",
    type: "Battle Shield",
    img: "Boss loots/2.Viorent/Serad Battle Shield.png",
    desc: "Epic shield crafted for frontline domination.",
    stats: "Melee Attack 525 | Additional Option: 3 Options"
}

],
Ego: [

{
    name: "Serad Knuckles",
    rarity: "Epic",
    type: "Knuckles",
    img: "Boss loots/3.Ego/Serad Knuckles.png",
    desc: "",
    stats: "Melee Attack 204 | Additional Option: 3 Options"
},

{
    name: "Serad Sword and Shield",
    rarity: "Epic",
    type: "Sword and Shield",
    img: "Boss loots/3.Ego/Serad Sword and Shield.png",
    desc: "",
    stats: "Melee Attack 550 | Additional Option: 3 Options"
},

{
    name: "Serad Battle Staff",
    rarity: "Epic",
    type: "Battle Staff",
    img: "Boss loots/3.Ego/Serad Battle Staff.png",
    desc: "",
    stats: "Magic Attack 580 | Additional Option: 3 Options"
},

{
    name: "Serad Staff",
    rarity: "Epic",
    type: "Staff",
    img: "Boss loots/3.Ego/Serad Staff.png",
    desc: "",
    stats: "Magic Attack 525 | Additional Option: 3 Options"
}

],

Clemantis: [
    {
    name: "Somnium Saddle",
    rarity: "Mythic",
    type: "Mount Summon Ticket",
    img: "Boss loots/4.Clemantis/Somnium Saddle.png",
    desc: "A saddle used to obtain Mount Somnium. If you already own the mount, you will receive 4 Mount Parts instead.",
    stats: ""
},
{
    name: "Serad Sword and Shield",
    rarity: "Epic",
    type: "Sword and Shield",
    img: "Boss loots/4.Clemantis/Serad Sword and Shield.png",
    desc: "",
    stats: "Melee Attack 550 | Additional Option: 3 Options"
},
{
    name: "Serad Greatsword",
    rarity: "Epic",
    type: "Greatsword",
    img: "Boss loots/4.Clemantis/Serad Greatsword.png",
    desc: "",
    stats: "Melee Attack 605 | Additional Option: 3 Options"
},
{
    name: "Serad Staff",
    rarity: "Epic",
    type: "Staff",
    img: "Boss loots/4.Clemantis/Serad Staff.png",
    desc: "",
    stats: "Magic Attack 525 | Additional Option: 3 Options"
},

   
],
 Livera: [
{
    name: "Ability: Lightning Spirit [Enhance]",
    rarity: "Legendary",
    type: "Ability Book",
    img: "Boss loots/5.Livera/Ability Lightning Spirit.png",
    desc: "Use to acquire Ability [Lightning Spirit].",
    stats: ""
},

{
    name: "Petrolov Saddle",
    rarity: "Legendary",
    type: "Mount Summon Ticket",
    img: "Boss loots/5.Livera/Petrolov Saddle.png",
    desc: "A saddle used to obtain Mount Petrolov. If you already own the mount, you will receive 3 Mount Parts instead.",
    stats: ""
},

{
    name: "Serbis Battle Shield",
    rarity: "Epic",
    type: "Battle Shield",
    img: "Boss loots/5.Livera/Serbis Battle Shield.png",
    desc: "",
    stats: "Melee Attack: 530 | Additional Option: 3 Options"
},

{
    name: "Serbis Greatsword",
    rarity: "Epic",
    type: "Greatsword",
    img: "Boss loots/5.Livera/Serbis Greatsword.png",
    desc: "",
    stats: "Melee Attack: 615 | Additional Option: 3 Options"
}

 ],






    Neutro: [
        { 
            name:"Void Staff",
            img:"Pictures/loot3.png",
            desc:"A mysterious staff infused with void energy.",
            rarity:"Legendary",
            location:"Dropped by Neutro"
        }
    ]
};

const epicOptions = [
    { name: "Critical Hit Damage", value: "8%", success: "10%" },
    { name: "All Damage in PvP", value: "11%", success: "10%" },
    { name: "Attack Speed", value: "8%", success: "10%" },
    { name: "Accuracy", value: "80", success: "10%" },
    { name: "Endurance Ignore in PvP", value: "70", success: "10%" },
    { name: "HP Recovery in Battle", value: "40", success: "10%" },
    { name: "MP Recovery in Battle", value: "20", success: "10%" },
    { name: "Gold Gain", value: "2%", success: "10%" },
    { name: "Barrier Increase Rate", value: "4%", success: "10%" },
    { name: "Skill MP Consumption Decrease", value: "2%", success: "10%" }
];



function createCard(boss){
    const card = document.createElement("div");
    card.className="card";
    card.dataset.spawn = Infinity;

    const baseContent = boss.type === "interval" ? `
        <div class="badge">Interval</div>
        <div class="name">${boss.name} (${boss.hours}h)</div>
        <div class="timer">Not Set</div>
        <div class="spawn"></div>
       <div class="admin-controls">
    <button class="open-admin"
            onclick="openAdminLayer('${boss.name}', ${boss.hours})">
        Set Timer
    </button>
</div>


</div>


    ` : boss.type === "fixed" && boss.disabled ? `
    <div class="badge">Fixed</div>
    <div class="name">${boss.name}</div>
    <div class="timer">No Contest</div>
    <div class="spawn">
        ${boss.schedule.map(s=>{
            const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            return days[s.day] + " " + s.time;
        }).join("<br>")}
    </div>
`
: `
    <div class="badge">Fixed</div>
    <div class="name">${boss.name}</div>
    <div class="timer">--</div>
    <div class="spawn"></div>
    <div class="fixed">Weekly Spawn</div>
`;


  let lootHTML = "";

if(lootData[boss.name] && lootData[boss.name].length > 0){
    lootHTML = lootData[boss.name].map(item => `
    <div class="loot-slot"
         data-name="${item.name}"
         data-desc="${item.desc || ''}"
         data-rarity="${item.rarity || ''}"
         data-type="${item.type || ''}"
         data-stats="${item.stats || ''}"
         data-location="${item.location || ''}">
        <img src="${item.img || 'Pictures/placeholder.png'}" alt="${item.name}">
    </div>
`).join("");

} else {
    lootHTML = `
        <div style="
            grid-column: span 2;
            opacity:0.6;
            padding:20px;
            text-align:center;
        ">
            No loot info yet
        </div>
    `;
}





    card.innerHTML = `
    <img class="boss-img" src="${boss.image}">
    <div class="card-content">
        ${baseContent}
    </div>

    <div class="details-overlay">
        <div class="details-box">

            <!-- TOP GROUP -->
            <div class="details-topbar">
                <div class="boss-menu" onclick="toggleBossMenu(event, '${boss.name}')">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <div class="boss-dropdown" id="menu-${boss.name}">
                <p><strong>Boss Info:</strong> ${boss.info || "Unknown boss"}</p>
                <p><strong>Location:</strong> ${boss.location || "Unknown location"}</p>
                <p><strong>Total Loot:</strong> ${(lootData[boss.name] || []).length}</p>
            </div>

            <!-- CENTER GROUP -->
            <div class="details-center">
                <h3>${boss.name} Loot</h3>
                <div class="loot-grid">
                    ${lootHTML}
                </div>
            </div>

        </div>
    </div>
`;


    document.getElementById("soonGrid").appendChild(card);
}


function updateTimers(){
    const now = new Date();
    const cards = Array.from(document.querySelectorAll(".card"));

    cards.forEach(card=>{
        const bossName = card.querySelector(".name").innerText.split(" (")[0];
        const boss = bosses.find(b=>b.name===bossName);
        if(boss.disabled){
          card.dataset.spawn = Infinity;
             return;
}

        const timerEl = card.querySelector(".timer");
        const spawnEl = card.querySelector(".spawn");

        let spawn;

        if(boss.type==="interval"){
            const saved = cloudData[boss.name];
            if(!saved){
                timerEl.innerText="Not Set";
                card.dataset.spawn = Infinity;
                return;
            }
            spawn = new Date(saved);
        } else {
            spawn = getNextFixedSpawn(boss.schedule);
        }

        const remaining = spawn - now;
        card.dataset.spawn = spawn.getTime();

        if(remaining>0){
            timerEl.classList.remove("ready","warning");
            if(remaining<=3600000) timerEl.classList.add("warning");

            timerEl.innerText = formatTime(remaining);

            const converted = convertTimezone(spawn);
            spawnEl.innerText = "Spawn: " + converted.toLocaleString([], {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true
            });

        } else {
            timerEl.classList.remove("warning");
            timerEl.classList.add("ready");
            timerEl.innerText="🔥 READY";
        }
    });
}

function sortBosses(){
    if(isTyping) return;
    if(expandedCard) return;

    const now = new Date();

    const today = document.getElementById("todayGrid");
    const tomorrow = document.getElementById("tomorrowGrid");
    const soon = document.getElementById("soonGrid");

    const cards = Array.from(document.querySelectorAll(".card"));

    // Place cards into correct section
    cards.forEach(card=>{
        const spawnTime = Number(card.dataset.spawn);

        let targetSection;

        if(!spawnTime || spawnTime === Infinity){
            targetSection = soon;
        } else {
            const spawnDate = new Date(spawnTime);

            if(isSameDay(spawnDate, now)){
                targetSection = today;
            }
            else if(isTomorrow(spawnDate, now)){
                targetSection = tomorrow;
            }
            else{
                targetSection = soon;
            }
        }

        if(card.parentElement !== targetSection){
            targetSection.appendChild(card);
        }
    });

    // Sort each section by lowest remaining time
    [today, tomorrow, soon].forEach(section=>{

        const sectionCards = Array.from(section.querySelectorAll(".card"));

        sectionCards.sort((a,b)=>{

            const spawnA = Number(a.dataset.spawn);
            const spawnB = Number(b.dataset.spawn);

            const hasA = spawnA && spawnA !== Infinity;
            const hasB = spawnB && spawnB !== Infinity;

            if(hasA && !hasB) return -1;
            if(!hasA && hasB) return 1;
            if(!hasA && !hasB) return 0;

            const remainingA = spawnA - now.getTime();
            const remainingB = spawnB - now.getTime();

            return remainingA - remainingB;
        });

        sectionCards.forEach((card,index)=>{
            if(section.children[index] !== card){
                section.insertBefore(card, section.children[index] || null);
            }
        });

    });
}


function setDeath(name,hours){
    const input = document.getElementById("input-"+name).value;
    if(!input) return;

    const [h,m] = input.split(":");
    const death = new Date();

    const now = new Date();
    death.setHours(h, m, now.getSeconds(), now.getMilliseconds());

    const spawn = death.getTime() + hours * 3600000;

    db.ref("bossTimers/" + name).set(spawn);

    triggerTimerAnimation(name);
}


function triggerTimerAnimation(bossName){
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const name = card.querySelector(".name").innerText;
        if(name.includes(bossName)){
            card.classList.add("timer-set");
            setTimeout(() => {
                card.classList.remove("timer-set");
            }, 600);
        }
    });
}

let currentAdminBoss = null;
let currentAdminHours = null;

function openAdminLayer(name, hours){

    currentAdminBoss = name;
    currentAdminHours = hours;

    document.getElementById("adminBossName").innerText = name;

    const bossObj = bosses.find(b => b.name === name);
if(bossObj){
    document.getElementById("adminBossImage").src = bossObj.image;
}


    const spawn = cloudData[name];
    if(spawn){
           const converted = convertTimezone(new Date(spawn));

    document.getElementById("adminCurrentTimer").innerText =
        "Current Spawn: " + converted.toLocaleString([], {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });
    } else {
        document.getElementById("adminCurrentTimer").innerText =
            "No timer set";
    }

    document.getElementById("adminLayer").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeAdminLayer(){
    document.getElementById("adminLayer").classList.remove("active");
    document.body.style.overflow = "auto";
}
document.getElementById("adminSetBtn").onclick = function(){

    const input = document.getElementById("adminTime").value;
    if(!input) return;

    const [h,m] = input.split(":");
    const death = new Date();

    const now = new Date();
    death.setHours(h, m, now.getSeconds(), now.getMilliseconds());

    const spawn = death.getTime() + currentAdminHours * 3600000;

    // 🔥 SAVE TO FIREBASE
    db.ref("bossTimers/" + currentAdminBoss).set(spawn);

    triggerTimerAnimation(currentAdminBoss);
    closeAdminLayer();
};


document.getElementById("adminCustomBtn").onclick = function(){

    const dateValue = document.getElementById("adminDate").value;
    const timeValue = document.getElementById("adminCustomTime").value;

    if(!dateValue || !timeValue) return;

    const death = new Date(dateValue + "T" + timeValue);
    const spawn = death.getTime() + currentAdminHours * 3600000;

    // 🔥 SAVE TO FIREBASE
    db.ref("bossTimers/" + currentAdminBoss).set(spawn);

    triggerTimerAnimation(currentAdminBoss);
    closeAdminLayer();
};

document.getElementById("adminResetBtn").onclick = function(){

    if(!currentAdminBoss) return;

    db.ref("bossTimers/" + currentAdminBoss).remove();

    triggerTimerAnimation(currentAdminBoss);
    closeAdminLayer();
};




bosses.forEach(createCard);
applyAdminMode();

function applyAdminMode(){
    const controls = document.querySelectorAll(".admin-controls");
    controls.forEach(control=>{
        control.style.display = isAdmin ? "block" : "none";
    });
}


function startTimer(){
    updateTimers();
    setInterval(()=>{
    updateTimers();
    if (!isTyping) sortBosses();
}, 1000);

}
function toggleBossMenu(event, bossName){
    event.stopPropagation();

    const menu = document.getElementById("menu-" + bossName);
    const button = event.currentTarget;
    const card = button.closest(".card");
    const title = card.querySelector(".details-box h3");
    const overlay = card.querySelector(".details-overlay");

    const isActive = menu.classList.toggle("active");
    button.classList.toggle("active");

    if(isActive){
        title.classList.add("fade-out");
        overlay.classList.add("menu-open");
    } else {
        title.classList.remove("fade-out");
        overlay.classList.remove("menu-open");
    }
}



startTimer();



