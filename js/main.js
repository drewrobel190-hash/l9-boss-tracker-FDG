console.log("Bosses:", bosses);
console.log("Loot:", lootData);

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

function getOptionPool(rarity, isArmor){

    if(rarity === "rare"){
        return isArmor ? rareArmorOptions : rareOptions;
    }

    if(rarity === "epic"){
        return isArmor ? epicArmorOptions : epicOptions;
    }

    if(rarity === "legendary"){
        return isArmor ? legendaryArmorOptions : legendaryOptions;
    }

    return [];
}

function openItemPopupFromSlot(slot){

    const rarity = (slot.dataset.rarity || "common").toLowerCase();
    const type = (slot.dataset.type || "").toLowerCase();

    // ===== TYPE DETECTION =====
    const isWeapon = [
        "sword","staff","knuckles","dagger",
        "shield","bow","crossbow"
    ].some(t => type.includes(t));

    const isArmor = [
    "helm","hood","hat","armor","vest","robe","gaiters","leather pants","cloth pants","gauntlets","wristbands","gloves","greaves","high boots","loafers"
].some(t => type.includes(t));


    // ===== BASIC INFO =====
    const nameEl = document.getElementById("itemName");
    const rarityEl = document.getElementById("itemRarity");

    nameEl.className = "";
    rarityEl.className = "";

    nameEl.classList.add("name-" + rarity);
    rarityEl.classList.add("rarity-" + rarity);

    nameEl.innerText = slot.dataset.name || "Unknown";
    rarityEl.innerText =
        "Rarity: " + rarity.charAt(0).toUpperCase() + rarity.slice(1);

    document.getElementById("itemType").innerText =
        slot.dataset.type || "Unknown";

const statsEl = document.getElementById("itemStats");

if (slot.dataset.stats && slot.dataset.stats.trim() !== "") {
    statsEl.innerHTML = slot.dataset.stats.replaceAll("|","<br>");
    statsEl.style.display = "block";
} else {
    statsEl.innerHTML = "";
    statsEl.style.display = "none";
}


const descEl = document.getElementById("itemDesc");

// 🚫 Hide description for weapons and armors
if (isWeapon || isArmor) {
    descEl.innerText = "";
    descEl.style.display = "none";
}
// ✅ Show description for mounts/materials only
else if (slot.dataset.desc && slot.dataset.desc.trim() !== "") {
    descEl.innerText = slot.dataset.desc;
    descEl.style.display = "block";
}
else {
    descEl.innerText = "";
    descEl.style.display = "none";
}

const locationEl = document.getElementById("itemLocation");

if (slot.dataset.location && slot.dataset.location.trim() !== "") {
    locationEl.innerText = slot.dataset.location;
    locationEl.style.display = "block";
} else {
    locationEl.innerText = "";
    locationEl.style.display = "none";
}

    const img = slot.querySelector("img");
    if(img){
        document.getElementById("itemImage").src = img.src;
    }

    // ===== OPTION TABLE (WEAPON + ARMOR ONLY) =====
    const optionContainer = document.getElementById("itemOptions");
    optionContainer.innerHTML = "";

    if(isWeapon || isArmor){

        const pool = getOptionPool(rarity, isArmor);

        if(pool && pool.length > 0){

            optionContainer.innerHTML = `
                <div class="option-header">
                    <span>Option</span>
                    <span>Value</span>
                    <span>Success</span>
                </div>
            `;

            pool.forEach(opt => {

                const row = document.createElement("div");
                row.className = "option-row";

                row.innerHTML = `
                    <span>${opt.name}</span>
                    <span>${opt.value}</span>
                    <span>${opt.success}</span>
                `;

                optionContainer.appendChild(row);
            });
        }
    }

    document.getElementById("itemPopup").classList.add("active");
    document.body.style.overflow = "hidden";

}






document.addEventListener("DOMContentLoaded", function(){

    const mapContent = document.querySelector(".map-content");

    const mapInner = document.getElementById("mapInner");
    // ===== BOSS MARKERS =====


// Add Venatus



    if(!mapContent || !mapInner){
        console.log("Map elements not found");
        return;
    }

    let scale = 1;
    let posX = 0;
    let posY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

   function updateTransform(){

    const mapImage = mapInner.querySelector("img");

    if(!mapImage) return;

    const containerWidth = mapContent.clientWidth;
    const containerHeight = mapContent.clientHeight;

    const imageWidth = mapImage.naturalWidth * scale;
    const imageHeight = mapImage.naturalHeight * scale;

    const minX = Math.min(0, containerWidth - imageWidth);
    const minY = Math.min(0, containerHeight - imageHeight);
    const maxX = 0;
    const maxY = 0;

    posX = Math.max(minX, Math.min(posX, maxX));
    posY = Math.max(minY, Math.min(posY, maxY));

    mapInner.style.transform =
        `translate(${posX}px, ${posY}px) scale(${scale})`;
}


    mapContent.addEventListener("wheel", function(e){
        e.preventDefault();

        const zoomSpeed = 0.2;
        const rect = mapContent.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const prevScale = scale;

        scale += e.deltaY < 0 ? zoomSpeed : -zoomSpeed;
        scale = Math.min(Math.max(1, scale), 4);

        const scaleChange = scale / prevScale;

        posX = mouseX - (mouseX - posX) * scaleChange;
        posY = mouseY - (mouseY - posY) * scaleChange;

        updateTransform();
    });

    mapContent.addEventListener("mousedown", function(e){
        isDragging = true;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
        mapContent.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", function(e){
        if(!isDragging) return;
        posX = e.clientX - startX;
        posY = e.clientY - startY;
        updateTransform();
    });

    window.addEventListener("mouseup", function(){
        isDragging = false;
        mapContent.style.cursor = "grab";
    });

    mapContent.addEventListener("click", function(e){

    if(isDragging) return; // prevent drag click

    const rect = mapContent.getBoundingClientRect();

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const mapX = (clickX - posX) / scale;
    const mapY = (clickY - posY) / scale;

    console.log("X:", Math.round(mapX), "Y:", Math.round(mapY));
});

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

    const btn = document.querySelector(".admin-btn");

    // 🔁 If already admin → LOG OUT
    if(isAdmin){
        isAdmin = false;
        btn.classList.remove("active-admin");
        alert("Admin mode deactivated");
        applyAdminMode();
        return;
    }

    // 🔐 If not admin → ask password
    const password = prompt("Enter Admin Password:");

    if(password === "1900"){
        isAdmin = true;
        btn.classList.add("active-admin");
        alert("Admin mode activated");
        applyAdminMode();
    } else {
        alert("Wrong password");
    }
}



/* ===== FULL BOSS LIST ===== */

/* ===== END BOSS LIST ===== */



function getNextFixedSpawn(schedule){

    const nowUTC = new Date();
    const now = new Date(
        nowUTC.getTime() + (selectedOffset * 3600000)
    );

    let next = null;

    schedule.forEach(s => {

        const target = new Date(now);
        const [h,m] = s.time.split(":");

        target.setHours(h, m, 0, 0);

        const dayDiff = (s.day - now.getDay() + 7) % 7;
        target.setDate(now.getDate() + dayDiff);

        if(target <= now){
            target.setDate(target.getDate() + 7);
        }

        if(!next || target < next){
            next = target;
        }

    });

    // convert back to real UTC timestamp
    return new Date(
        next.getTime() - (selectedOffset * 3600000)
    );
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






function createCard(boss){
    const card = document.createElement("div");
    card.className="card";
    if (boss.category === "world") {
    card.dataset.category = "world";
}

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
    lootHTML = lootData[boss.name].slice(0,4).map(item => `
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
    <div class="boss-info-box">
        <p><strong>Boss Info:</strong> ${boss.info || "Unknown boss"}</p>
        <p><strong>Location:</strong> ${boss.location || "Unknown location"}</p>
        <p class="all-loots-btn"
           onclick="showAllLoot('${boss.name.trim()}')">
           <strong>All Loots:</strong> ${(allLootData[boss.name] || []).length}
        </p>
    </div>
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
        const boss = bosses.find(b => b.name === bossName);

if(!boss){
    card.dataset.spawn = Infinity;
    return;
}

if(boss.disabled){
    const timerEl = card.querySelector(".timer");
    const spawnEl = card.querySelector(".spawn");

    timerEl.innerText = "No Contest";
    spawnEl.innerHTML = boss.schedule.map(s=>{
        const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        return days[s.day] + " " + s.time;
    }).join("<br>");

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

//errors when clicking set timer without selecting time, and when clicking custom without selecting date or time. also when clicking reset without an active boss. should add checks to prevent these. also maybe add confirmation for reset since it can be accidental.
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
const setBtn = document.getElementById("adminSetBtn");

if (setBtn) {
    setBtn.onclick = function(){

    if(!currentAdminBoss || currentAdminHours == null){
        alert("No boss selected.");
        return;
    }

    const input = document.getElementById("adminTime").value;
    if(!input){
        alert("Please select a time.");
        return;
    }

    const [h,m] = input.split(":");
    const death = new Date();
    const now = new Date();
    death.setHours(h, m, now.getSeconds(), now.getMilliseconds());

    const spawn = death.getTime() + currentAdminHours * 3600000;

    db.ref("bossTimers/" + currentAdminBoss).set(spawn);

    triggerTimerAnimation(currentAdminBoss);
    closeAdminLayer();
};

}

const customBtn = document.getElementById("adminCustomBtn");
if (customBtn) {
    customBtn.onclick = function(){

    if(!currentAdminBoss || currentAdminHours == null){
        alert("No boss selected.");
        return;
    }

    const dateValue = document.getElementById("adminDate").value;
    const timeValue = document.getElementById("adminCustomTime").value;

    if(!dateValue || !timeValue){
        alert("Please select both date and time.");
        return;
    }

    const death = new Date(dateValue + "T" + timeValue);
    const spawn = death.getTime() + currentAdminHours * 3600000;

    db.ref("bossTimers/" + currentAdminBoss).set(spawn);

    triggerTimerAnimation(currentAdminBoss);
    closeAdminLayer();
};

}

const resetBtn = document.getElementById("adminResetBtn");
if (resetBtn) {
    resetBtn.onclick = function(){

    if(!currentAdminBoss){
        alert("No boss selected.");
        return;
    }

    if(!confirm("Reset this timer?")){
        return;
    }

    db.ref("bossTimers/" + currentAdminBoss).remove();

    triggerTimerAnimation(currentAdminBoss);
    closeAdminLayer();
};
resetBtn.onclick = function(){
        if(!currentAdminBoss) return;

        db.ref("bossTimers/" + currentAdminBoss).remove();

        triggerTimerAnimation(currentAdminBoss);
        closeAdminLayer();
    };
}

console.log("Bosses:", bosses);
console.log("LootData:", lootData);

bosses.forEach(createCard);
document.addEventListener("click", function(e){

    if(e.target.closest(".loot-slot")){
        return;
    }

    const clickedCard = e.target.closest(".card");

    document.querySelectorAll(".card").forEach(card => {

        if(card !== clickedCard){
            card.classList.remove("show-details");
            resetCardState(card);   // 👈 THIS IS THE MAGIC
        }

    });

    if(clickedCard){
        clickedCard.classList.toggle("show-details");
    }
});



// 🔥 HANDLE SMALL LOOT CLICK (CARD LOOT)
document.addEventListener("click", function(e){

    const slot = e.target.closest(".loot-slot");
    if(!slot) return;

    e.stopPropagation();

    openItemPopupFromSlot(slot);
});


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
    card.classList.toggle("menu-active", isActive);

    button.classList.toggle("active");

    if(isActive){
        title.classList.add("fade-out");
        overlay.classList.add("menu-open");
    } else {
        title.classList.remove("fade-out");
        overlay.classList.remove("menu-open");
    }
}

function showAllLoot(bossName){

    bossName = bossName.trim();
    
    console.log("Boss Name:", bossName);
    console.log("AllLootData Key Exists?:", allLootData[bossName]);

    const popup = document.getElementById("allLootPopup");
    const grid = document.getElementById("allLootGrid");
    const title = document.getElementById("allLootTitle");

    console.log("Boss Name:", bossName);
    console.log("Loot Data:", allLootData[bossName]);

    title.innerText = bossName + " - All Loots";
    grid.innerHTML = "";

    const lootList = allLootData[bossName] || [];

    lootList.forEach(item => {
const slot = document.createElement("div");
slot.className = "loot-slot";

slot.dataset.name = item.name || "";
slot.dataset.desc = item.desc || "";
slot.dataset.rarity = item.rarity || "";
slot.dataset.type = item.type || "";
slot.dataset.stats = item.stats || "";
slot.dataset.location = item.location || "";

slot.innerHTML = `<img src="${item.img}" alt="${item.name}">`;

        slot.onclick = () => {
    openItemPopupFromSlot(slot);
};

        grid.appendChild(slot);
    });

    popup.classList.add("active");
}

function closeAllLoot(event){
    const popup = document.getElementById("allLootPopup");

    // Only close if clicking background
    if (!event || event.target === popup) {
        popup.classList.remove("active");
    }
}

// 🔥 CLOSE ITEM POPUP WHEN CLICKING BACKGROUND
document.getElementById("itemPopup").addEventListener("click", function(e){
    if(e.target.id === "itemPopup"){
        this.classList.remove("active");
        document.body.style.overflow = "auto";
    }
});


document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){

        // Close Item Popup
        const itemPopup = document.getElementById("itemPopup");
        if(itemPopup.classList.contains("active")){
            itemPopup.classList.remove("active");
            document.body.style.overflow = "auto";
        }

        // Close All Loot Popup
        const allLootPopup = document.getElementById("allLootPopup");
        if(allLootPopup.classList.contains("active")){
            allLootPopup.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }
});


    

startTimer();

function createWorldBossCard(name, level, image, location){

    const container = document.getElementById("worldBossContent");


    const card = document.createElement("div");
    card.className = "world-boss-card";

    card.innerHTML = `
        <img src="${image}" class="world-boss-img">
        
        <div class="world-boss-name">${name}</div>
        <div class="world-boss-time">
            Daily 11:00 – 12:00<br>
            Daily 20:00 – 21:00
        </div>
        <div class="world-boss-location">
            ${location}
        </div>
    `;

    container.appendChild(card);
}



const openMapBtn = document.getElementById("openMapBtn");
const mapOverlay = document.getElementById("mapOverlay");
const mapImage = document.getElementById("mapImage");

openMapBtn.onclick = () => {
    mapOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; 
};


function closeMapOverlay(){
    mapOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
}



// ================= CONTINENT MAP SYSTEM =================

const continents = {
  elsera: {
    Dien: [
  { name: "Dien Port", level: "", img: "Maps/Dien/Dient Port.png" },
  { name: "Northern Dien", level: "Lv. 1-9", img: "Maps/Dien/Nothern Dien.png" },
  { name: "Gray Ruins", level: "Lv. 11-19", img: "Maps/Dien/Gray Ruins.png" },
  { name: "Corrupted Basin", level: "Lv. 20-30", img: "Maps/Dien/Corrupted Basin.png" },
  { name: "Secret Laboratory", level: "Lv. 32-55", img: "Maps/Dien/Secret Laboratory.png" }
],


    Lindris: [
      { name: "Lindris", level: "", img: "Maps/Lindris/Lindris.png" },
      { name: "Crescent Lake", level: "Lv. 37-41", img: "Maps/Lindris/Cresendent Lake.png" },
      { name: "Twilight Hill", level: "Lv. 43-48", img: "Maps/Lindris/Twilight Hill.png" },
    ],

    Ulan: [
      { name: "Ulan", level: "", img: "Maps/Ulan/Ulan .png" },
      { name: "Ulan Canyon", level: "Lv. 50-56", img: "Maps/Ulan/Ulan Canyon.png" },
      { name: "Protector's Ruins", level: "Lv. 55-59", img: "Maps/Ulan/Protector's Ruins.png" },
      { name: "Desert of the Screaming", level: "Lv. 62-68", img: "Maps/Ulan/Desert of the Screaming.png" },
      { name: "Lower Tomb of Tyriosa 1F", level: "Lv. 65-70", img: "Maps/Ulan/Lower Tomb of Tyriosa 1F.png" },
      { name: "Lower Tomb of Tyriosa 2F", level: "Lv. 74-82", img: "Maps/Ulan/Lower Tomb of Tyriosa 2F.png" },
      { name: "Lower Tomb of Tyriosa 3F", level: "Lv. 88-102", img: "Maps/Ulan/Lower Tomb of Tyriosa 3F.png" }
    ],

    Serbis: [
      { name: "Serbis", level: "" },
      { name: "Land of Glory", level: "Lv. 70-78" },
      { name: "Battlefield of Templar", level: "Lv. 76-88" },
      { name: "Plateau of Revolution", level: "Lv. 85-94" },
      { name: "Ruins of the War", level: "Lv. 91-100" },
      { name: "Silvergrass Field", level: "Lv. 101-108" },
      { name: "Barbas", level: "Lv. 105-115" },
      { name: "Deadman's Land District 1", level: "Lv. 87-92" },
      { name: "Deadman's Land District 2", level: "Lv. 95-100" },
      { name: "Deadman's Land District 3", level: "Lv. 105-113" }
    ]
  },

  kransia: {
  "Ashen Haven": [
    { 
      name: "Ashen Haven",
      level: "",
      img: "Maps/Kransia/Ashen Haven.png"

      
    },

     { 
      name: "Fallen Wasteland",
      level: "",
      img: "Maps/Kransia/Fallen Wasteland.png"
    }
  ],

  
}

};

// ===== MAP BOSS LOCATIONS =====
const mapBossData = {

    "Maps/Dien/Dient Port.png": [
      { name: "Dien Port Plaza", type: "portal", x: 763, y: 474 }
    ],

    "Maps/Dien/Corrupted Basin.png": [
      { name: "Venatus", x: 939, y: 428 },
      { name: "Clemantis", x: 636, y: 111 },

        //  Portals teshi
        { name: "Fetid Puddle", type: "portal", x: 702, y: 455 },
        { name: "In Front of Secret Laboratory", type: "portal", x: 602, y: 227 },
        { name: "Reeking Land", type: "portal", x: 647, y: 728 },

      
        { name: "Secret Laboratory", type: "dungeon", level: "Lv. 32-55",x: 612, y: 156},


        //  Elites teshi
        { name: "Corrupted ShellBug", type: "elite", level: "Lv. 30", x: 636, y: 566 },
        { name: "Brutal Butcher", type: "elite", level: "Lv. 35", x: 364, y: 452 }

    ],

    "Maps/Dien/Nothern Dien.png": [

        { name: "Deligeon Ranger Hideout", type: "portal", x: 660, y: 81 },
        { name: "Deligeon Ranger Post 2", type: "portal", x: 604, y: 481 },

        { name: "Outlaw Kaiser", type: "elite", level: "14", x: 597, y: 310 },
        { name: "Screaming Wings", type: "elite", level: "Lv. 8", x: 952, y: 422 }

        
    ],

    "Maps/Dien/Gray Ruins.png": [
        { name: "Abandoned Camp", type: "portal", x: 780, y: 383 },
        { name: "Execution Ground", type: "portal", x: 543, y: 476 },
        
        { name: "Dark Apparition", type: "elite", level: "Lv. 23", x: 445, y: 316 },
        { name: "Suspicious Wizard", type: "elite", level: "Lv. 19", x: 1008, y: 430 },

    ],

    "Maps/Dien/Secret Laboratory.png": [
        { name: "Undomiel", x: 816, y: 242}, 

        { name: "Magic Puppet", type: "elite", level: "Lv. 60", x: 890, y: 455 },
        { name: "Wizards Pet", type: "elite", level: "Lv. 60", x: 789, y: 536 },
        { name: "Secret Creation", type: "elite", level: "Lv. 40", x: 627, y: 174 }
    ],

    "Maps/Lindris/Lindris.png": [
        { name: "FLoating Tower", type: "portal", x: 422, y: 625 }
    ],

    "Maps/Lindris/Cresendent Lake.png": [
        { name: "Saphirus", x: 693, y: 436 },
        { name: "Viorent", x: 439, y: 340 },

        { name: "Twitching Darkness", type: "portal", x: 506, y: 417 },
        { name: "Silent Moonlight", type: "portal", x: 659, y: 356 },
        { name: "Moonlight Wave", type: "portal", x: 785, y: 569 },

        { name: "Lamia Shaman", type: "elite", level: "Lv. 46", x: 900, y: 439 },
        { name: "Angusto", type: "elite", level: "Lv. 46", x: 558, y: 223 },

    ],

    "Maps/Lindris/Twilight Hill.png": [
        { name: "Ratan", x: 873, y: 287 },

        { name: "Lady Dalia", x: 470, y: 277 },
        { name: "Thymele", x: 507, y: 595 },

        { name: "Precarious Transport Route", type: "portal", x: 652, y: 623 },
        { name: "Daybreak Hill", type: "portal", x: 613, y: 399 },
        { name: "Twilight Way", type: "portal", x: 716, y: 214 },

        { name: "Charging Thardus", type: "elite", level: "Lv. 53", x: 403, y: 528 },
        { name: "Ancient Thardus", type: "elite", level: "Lv. 49", x: 622, y: 255 },
        { name:  "Berserk Thardus", type: "elite", level: "Lv. 54", x: 892, y: 497 },
    ],

    "Maps/Ulan/Ulan .png": [
        { name: "Plaza of Liberation", type: "portal", x: 583, y: 460 },  
    ],

    "Maps/Ulan/Ulan Canyon.png": [
        { name: "Ego", x: 319, y: 484 },

        { name: "Rocky Mountain", type: "portal", x: 545, y: 542 },
        { name: "Farmyard", type: "portal", x: 697, y: 288 },
        { name: "Canyon Entrance", type: "portal", x: 837, y: 517 },
        
        { name: "Ancient Turtle", type: "elite", level: "Lv. 58", x: 769, y: 686 },
        { name: "Desert Golem", type: "elite", level: "Lv. 57", x: 556, y: 312 },
        { name: "Alarak", type: "elite", level: "Lv. 49", x: 407, y: 468 },
    ],

     "Maps/Ulan/Protector's Ruins.png": [
        { name: "Parto", x: 652, y: 189 },

        { name: "Acient Traces", type: "portal", x: 383, y: 363 },
        { name: "Nesha's Holy Site", type: "portal", x: 632, y: 443 },
        { name: "Acient Kingdom's Garden", type: "portal", x: 964, y: 427 },
    ]
};

// ===== RENDER BOSS MARKERS =====
function renderBossMarkers(imagePath){

    document.querySelectorAll(".boss-marker").forEach(m => m.remove());

    const bossList = mapBossData[imagePath];
    if(!bossList) return;

    bossList.forEach(boss => {

        const marker = document.createElement("div");
        marker.className = "boss-marker";
        marker.style.position = "absolute";
        marker.style.left = boss.x + "px";
        marker.style.top = boss.y + "px";
        marker.style.position = "absolute";
marker.style.left = boss.x + "px";
marker.style.top = boss.y + "px";
marker.style.width = "40px";
marker.style.height = "40px";
marker.style.transform = "translate(-50%, -50%)";
marker.style.cursor = "pointer";
marker.style.background = "transparent";
// 🔥 HOVER TOOLTIP
marker.addEventListener("mouseenter", function(){

    const tooltip = document.createElement("div");
    tooltip.className = "map-hover-tooltip";
    tooltip.innerText = boss.name;

    document.body.appendChild(tooltip);

    const rect = marker.getBoundingClientRect();

    tooltip.style.left = rect.left + rect.width / 2 + "px";
    tooltip.style.top = rect.top - 10 + "px";

    marker._tooltip = tooltip;
});

marker.addEventListener("mouseleave", function(){
    if(marker._tooltip){
        marker._tooltip.remove();
        marker._tooltip = null;
    }
});



 marker.onclick = () => {

    // 🔥 If world boss → open world boss panel immediately
if(boss.name === "Ratan" || boss.name === "Parto" || boss.name === "Nedra"){

    mapOverlay.classList.remove("active");
    document.body.style.overflow = "hidden";

    worldOverlay.classList.add("active");

    // 🔥 highlight selected world boss
    document.querySelectorAll(".world-boss-card").forEach(card => {
        card.classList.remove("selected");
    });

    const targetCard = Array.from(document.querySelectorAll(".world-boss-card"))
        .find(card => card.querySelector(".world-boss-name").innerText === boss.name);

    if(targetCard){
        targetCard.classList.add("selected");
    }

    return;
}



    const cards = document.querySelectorAll(".card");
    let found = false;

    cards.forEach(card => {

        const bossName = card.querySelector(".name").innerText.split(" (")[0];

        if(bossName === boss.name){

            found = true;

            // Close map
            mapOverlay.classList.remove("active");
            document.body.style.overflow = "auto";

            // Close other cards
            document.querySelectorAll(".card").forEach(c => {
                c.classList.remove("show-details");
            });

            card.scrollIntoView({ behavior: "smooth", block: "center" });

            setTimeout(() => {
                card.classList.add("show-details");
            }, 400);
        }
    });

    // 🔥 If NOT a main boss → show simple popup
   if(!found){

    // 🔥 If world boss → open world boss panel
   

    // Normal popup for other stuff
    const infoBox = document.createElement("div");
    infoBox.className = "map-info-popup";

    infoBox.innerHTML = `
        <h3>${boss.name}</h3>
        ${boss.type ? `<p><strong>Type:</strong> ${boss.type}</p>` : ""}
        ${boss.level ? `<p><strong>Level:</strong> ${boss.level}</p>` : ""}
    `;

    document.body.appendChild(infoBox);

    setTimeout(() => {
        infoBox.classList.add("show");
    }, 10);

    setTimeout(() => {
        infoBox.classList.remove("show");
        setTimeout(() => infoBox.remove(), 300);
    }, 2500);
}

};



        mapInner.appendChild(marker);
    });
}


const continentTabs = document.querySelectorAll(".continent-tab");
const sidebar = document.getElementById("mapSidebar" );

function loadContinent(continentKey){
    sidebar.innerHTML = "";

    const continentData = continents[continentKey];

    Object.keys(continentData).forEach(continentName => {

        // ===== MAIN TITLE (Dien, Lindris etc) =====
        const titleDiv = document.createElement("div");
        titleDiv.className = "main-region";
        titleDiv.innerText = continentName;

        // Container for zones
        const zoneContainer = document.createElement("div");
        zoneContainer.className = "zone-container";

        continentData[continentName].forEach(zone => {

    const zoneDiv = document.createElement("div");
    zoneDiv.className = "sub-region";
    zoneDiv.innerHTML = `
        <div>${zone.name}</div>
        <small style="color:#aaa">${zone.level}</small>
    `;

    zoneDiv.onclick = () => {

    document.querySelector(".sub-region.active")?.classList.remove("active");
    zoneDiv.classList.add("active");

    if(zone.img){

        // Start animation
        mapImage.classList.add("map-animate");

        setTimeout(() => {
            mapImage.src = zone.img;
            renderBossMarkers(zone.img);


            // Fade back in
            mapImage.classList.remove("map-animate");
        }, 200);
    }
};


    zoneContainer.appendChild(zoneDiv);
});



        // Toggle open/close
        // Toggle open/close
titleDiv.onclick = () => {

    zoneContainer.classList.toggle("open");

    if(zoneContainer.classList.contains("open")){

        const zones = zoneContainer.querySelectorAll(".sub-region");

        zones.forEach((zone, index) => {
            zone.style.transitionDelay = (index * 0.08) + "s";
        });

    } else {

        // reset delay when closing
        const zones = zoneContainer.querySelectorAll(".sub-region");
        zones.forEach(zone => {
            zone.style.transitionDelay = "0s";
        });

    }
};


        sidebar.appendChild(titleDiv);
        sidebar.appendChild(zoneContainer);
    });
    

}




continentTabs.forEach(tab => {
    tab.onclick = () => {
        document.querySelector(".continent-tab.active")?.classList.remove("active");
        tab.classList.add("active");
        loadContinent(tab.dataset.continent);
    };
});

// Load default continent
loadContinent("elsera");


const worldBossBtn = document.getElementById("worldBossBtn");
const worldOverlay = document.getElementById("worldBossOverlay");


worldBossBtn.onclick = () => {

    // ✅ Close Map if open
    mapOverlay.classList.remove("active");

    // ✅ Open World Boss
    worldOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
};



worldOverlay.onclick = (e) => {
    if(e.target === worldOverlay){
        worldOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    }
    document.querySelectorAll(".world-boss-card").forEach(card => {
    card.classList.remove("selected");
});

};



// ===== CREATE WORLD BOSSES =====

createWorldBossCard("Ratan", 60, "Pictures/World boss/Ratan.png", "Tomb of Time");
createWorldBossCard("Parto", 85, "Pictures/World boss/Parto.png", "Magic Puppet's Yearning");
createWorldBossCard("Nedra", 105, "Pictures/World boss/Nedra.png", "Bloodsoaked Plateau");

