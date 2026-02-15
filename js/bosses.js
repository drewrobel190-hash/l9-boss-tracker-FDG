const bosses = [

{
  name: "Venatus",
  type: "interval",
  hours: 10,
  image: "Pictures/Venatus.png",

  info: "Level 60 Field Boss",
  location: "Corrupted Basin > Corrupted River Stream",
},

{ name:"Viorent",
  type:"interval", 
  hours:10, 
  image:"Pictures/Viorent.png",
  info: "Level 65 Field Boss",
  location: "Cresendent Lake > Gill Stream",
},

{ name:"Ego", 
  type:"interval", 
  hours:21, 
  image:"Pictures/Ego.png",
  info: "Level 70 Field Boss",
  location: "Ulan Canyon > Reclaimed Gathering Point",
},

{ name:"Livera",
  type:"interval", hours:24, image:"Pictures/Livera.png",
  info: "Level 75 Field Boss",
  location: "Protectors Ruin's > Black Storm Peninsula"
},

{ name:"Araneo", 
  type:"interval", hours:24, image:"Pictures/Araneo.png",
  info: "Level 75 Field Boss",
  location: "Lower Tomb Of Tyriosa 1F"
},

{ name:"Undomiel", 
  type:"interval", hours:24, image:"Pictures/Undomiel.png",
  info: "Level 85 Field Boss",
  location: "Secret Laboratory > Test Subject Lab"
},
{ name:"Lady Dalia", 
  type:"interval", hours:18, image:"Pictures/Lady Dalia.png",
  info: "Level 85 Field Boss",
  location: "Twilight Hill > Bloody Shadow"
},
{ name:"General Aquleus", 
  type:"interval", hours:29, image:"Pictures/General Aquleus.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > General Aquleus's Cave"
},
{ name:"Amentis", type:"interval", hours:29, image:"Pictures/Amentis.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Amentis's Cave"
},
{ name:"Baron Braudmore", type:"interval", hours:32, image:"Pictures/Baron Braudmore.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Baron Braudmore's Cave"
},
{ name:"Wannitas", type:"interval", hours:48, image:"Pictures/Wannitas.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Wannitas's Cave"
},
{ name:"Metus", type:"interval", hours:48, image:"Pictures/Metus.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Metus's Cave"
},
{ name:"Duplican", type:"interval", hours:48, image:"Pictures/Duplican.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Duplican's Cave"
},
{ name:"Shuliar", type:"interval", hours:35, image:"Pictures/Shuliar.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Shuliar's Cave"
},
{ name:"Gareth", type:"interval", hours:32, image:"Pictures/Gareth.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Gareth's Cave"
},
{ name:"Titore", type:"interval", hours:37, image:"Pictures/Titore.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Titore's Cave"
},
{ name:"Larba", type:"interval", hours:35, image:"Pictures/Larba.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Larba's Cave"
},
{ name:"Catena", type:"interval", hours:35, image:"Pictures/Catena.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Catena's Cave"
},
{ name:"Secreta", type:"interval", hours:62, image:"Pictures/Secreta.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Secreta's Cave"
},
{ name:"Ordo", type:"interval", hours:62, image:"Pictures/Ordo.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Ordo's Cave"
},
{ name:"Asta", type:"interval", hours:62, image:"Pictures/Asta.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Asta's Cave"
},
{ name:"Supore", type:"interval", hours:62, image:"Pictures/Supore.png",
  info: "Level 75 Field Boss",
  location: "Cresendent Lake > Supore's Cave"
},

{ name:"Clemantis", type:"fixed",
schedule:[{day:1,time:"11:30"},{day:4,time:"19:00"}],
image:"Pictures/Clemantis.png",
info: "Level 70 Field Boss",
location: "Corrupted Basin > White Witch Cradle",
},

{ name:"Saphirus", type:"fixed",
schedule:[{day:0,time:"17:00"},{day:2,time:"11:30"}],
image:"Pictures/Saphirus.png",
info: "Level 80 Field Boss",
location: "Cresendent Lake > Moonlight Shackle",
},

{ name:"Neutro", type:"fixed",
schedule:[{day:2,time:"19:00"},{day:4,time:"11:30"}],
image:"Pictures/Neutro.png",
info: "Level 80 Field Boss",
location: "Desert of the Screaming > Battlefield of Love and Hatred"
},

{ name:"Thymele", type:"fixed",
schedule:[{day:1,time:"19:00"},{day:3,time:"11:30"}],
image:"Pictures/Thymele.png",
info: "Level 70 Field Boss",
location: "Corrupted Basin > Thymele's Cave"
},

{ name:"Milavy", type:"fixed",
schedule:[{day:6,time:"15:00"}],
image:"Pictures/Milavy.png",
info: "Level 70 Field Boss",
location: "Corrupted Basin > Milavy's Cave"
},

{ name:"Ringor", type:"fixed",
schedule:[{day:6,time:"17:00"}],
image:"Pictures/Ringor.png",
info: "Level 70 Field Boss",
location: "Corrupted Basin > Ringor's Cave"
},

{ name:"Roderick", type:"fixed",
schedule:[{day:5,time:"19:00"}],
image:"Pictures/Roderick.png",
info: "Level 70 Field Boss",
location: "Corrupted Basin > Roderick's Cave"
},

{ name:"Auraq", type:"fixed",
schedule:[{day:5,time:"22:00"},{day:3,time:"21:00"}],
image:"Pictures/Auraq.png",
info: "Level 70 Field Boss",
location: "Corrupted Basin > Auraq's Cave"
},

{ name:"Chaiflock", type:"fixed",
schedule:[{day:6,time:"22:00"}],
image:"Pictures/Chaiflock.png",
info: "Level 70 Field Boss",
location: "Corrupted Basin > Chaiflock's Cave"
},

{ name:"Benji", type:"fixed",
schedule:[{day:0,time:"21:00"}],
image:"Pictures/Benji.png",
info: "Level 70 Field Boss",
location: "Corrupted Basin > Benji's Cave"
},
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
image:"Pictures/Tumier.png"},

// ===== WORLD BOSSES =====

{
  name: "Ratan",
  type: "fixed",
  category: "world",

  schedule: [
    { day: 0, time: "11:00" },
    { day: 0, time: "20:00" },
    { day: 1, time: "11:00" },
    { day: 1, time: "20:00" },
    { day: 2, time: "11:00" },
    { day: 2, time: "20:00" },
    { day: 3, time: "11:00" },
    { day: 3, time: "20:00" },
    { day: 4, time: "11:00" },
    { day: 4, time: "20:00" },
    { day: 5, time: "11:00" },
    { day: 5, time: "20:00" },
    { day: 6, time: "11:00" },
    { day: 6, time: "20:00" }
  ],
  image: "Pictures/World boss/Ratan.png",
  info: "Level 60 World Boss",
  location: "World Boss Area"
},

{
  name: "Parto",
  type: "fixed",
  category: "world",

  schedule: [
    { day: 0, time: "11:00" },
    { day: 0, time: "20:00" },
    { day: 1, time: "11:00" },
    { day: 1, time: "20:00" },
    { day: 2, time: "11:00" },
    { day: 2, time: "20:00" },
    { day: 3, time: "11:00" },
    { day: 3, time: "20:00" },
    { day: 4, time: "11:00" },
    { day: 4, time: "20:00" },
    { day: 5, time: "11:00" },
    { day: 5, time: "20:00" },
    { day: 6, time: "11:00" },
    { day: 6, time: "20:00" }
  ],
  image: "Pictures/World Boss/Parto.png",
  info: "Level 85 World Boss",
  location: "World Boss Area"
},

{
  name: "Nedra",
  type: "fixed",
  category: "world",

  schedule: [
    { day: 0, time: "11:00" },
    { day: 0, time: "20:00" },
    { day: 1, time: "11:00" },
    { day: 1, time: "20:00" },
    { day: 2, time: "11:00" },
    { day: 2, time: "20:00" },
    { day: 3, time: "11:00" },
    { day: 3, time: "20:00" },
    { day: 4, time: "11:00" },
    { day: 4, time: "20:00" },
    { day: 5, time: "11:00" },
    { day: 5, time: "20:00" },
    { day: 6, time: "11:00" },
    { day: 6, time: "20:00" }
  ],
  image: "Pictures/World boss/Nedra.png",
  info: "Level 105 World Boss",
  location: "World Boss Area"
},


];

