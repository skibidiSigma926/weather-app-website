let land = "Danmark"
let vejrdatas = {}
let byer = [
  { navn: "København", lat: 55.5761, lon: 12.8683 },
  { navn: "Aarhus", lat: 55.9829, lon: 11.0700 }, 
  { navn: "Odense", lat: 55.2500, lon: 11.3000 },
  { navn: "Aalborg", lat: 56.7488, lon: 10.9217 }
]
let valgtBy = null
let kortBillede
let kortBredde = 1000
let kortHoejde = 1000
let bjælkeHoejde = kortHoejde / 3 // den vil stadig ik lade os skrive ø, så behold det som oe
let klikRadius = 15

// kortets geografi min og max lat/lon for Danmark
let latMin = 54.5;
let latMax = 57.5;
let lonMin = 9.0;
let lonMax = 13.5;

function preload() {
  kortBillede = loadImage("kort.PNG")
}

function setup() {
  createCanvas(kortBredde, kortHoejde + bjælkeHoejde) // sæt canvas størrelse til at være kortets størrelse plus bjælken
  hentVejrData(land); // hent vejrdata for Danmark
  noFill()
  noStroke()
}

function draw() {
  background(255)

  danmarkKort()
  blåBjælke()
  
  // Tekst under den blå bjælke
  fill(0)
  textSize(24)
  textAlign(CENTER, CENTER)
  text(`Temperaturen i ${land}`, kortBredde / 2, bjælkeHoejde + 30)
}

function hentVejrData(land) {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=56.2639&longitude=9.5018&current_weather=true&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max&timezone=Europe/Copenhagen`
  if (valgtBy) {
    url = `https://api.open-meteo.com/v1/forecast?latitude=${valgtBy.lat}&longitude=${valgtBy.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max&timezone=Europe/Copenhagen`
  }

  loadJSON(url, function(data) {
    vejrdatas = data
  })
}

function danmarkKort() {
  let kortX = 0
  let kortY = bjælkeHoejde
  image(kortBillede, kortX, kortY, kortBredde, kortHoejde) //kort placering med lat lon til ca. virkeligheden 
  
  // placéring af byernes prikker på kortet
  fill(255, 0, 0)
  byer.forEach(by => {
    let x = map(by.lon, lonMin, lonMax, 0, kortBredde)
    let y = map(by.lat, latMax, latMin, bjælkeHoejde, bjælkeHoejde + kortHoejde)
    ellipse(x, y, klikRadius * 2, klikRadius * 2)
  });
}

function blåBjælke() {
  let darkBlue = color(0, 0, 139)
  let lightBlue = color(135, 206, 250)
  for (let i = 0; i < 5; i++) {
    let xStart = (kortBredde / 5) * i
    let xEnd = (kortBredde / 5) * (i + 1)
    let col = lerpColor(darkBlue, lightBlue, i / 5)
    fill(col);
    rect(xStart, 0, xEnd - xStart, bjælkeHoejde)
  }
  
  // lodrette streger imellem segmenterne
  stroke(255);
  for (let i = 1; i < 5; i++) {
    let x = (kortBredde / 5) * i
    line(x, 0, x, bjælkeHoejde)
  }

  if (vejrdatas.daily) {
    textSize(22)
    fill(211, 211, 211)
    textAlign(CENTER, CENTER);

    // vis data inkl for de næste dage
    for (let i = 0; i < 5; i++) {
      let maxTemp = vejrdatas.daily.temperature_2m_max[i];
      let minTemp = vejrdatas.daily.temperature_2m_min[i];
      let vindHastighed = vejrdatas.daily.wind_speed_10m_max[i];
      let dato = new Date(vejrdatas.daily.time[i]);
      let ugedag = dato.toLocaleString('da-DK', { weekday: 'long' })

      // skift "I dag" og "I morgen" for de første to dage fordi vi har komm/it elever i gruppen der mener de er noget
      if (i === 0) {
        ugedag = "I dag";
      } else if (i === 1) {
        ugedag = "I morgen";
      }

      let x = (kortBredde / 5) * i + (kortBredde / 10)

      // hovedteksten uden skygge
      fill(211, 211, 211)
      textSize(24);
      text(`${ugedag}`, x, bjælkeHoejde / 5) // dagens navn
      text(`${maxTemp}°C`, x, bjælkeHoejde / 3) // max temperatur
      text(`${minTemp}°C`, x, bjælkeHoejde / 2 + 30) // min temperatur
      textSize(16) // For de små forklaringer
      fill(255)
      text("Max Temp", x, bjælkeHoejde / 3 - 20)
      text("Min Temp", x, bjælkeHoejde / 2 + 10)
      text(`m/s: ${vindHastighed}`, x, bjælkeHoejde / 2 + 110)
      text("Vindhastighed", x, bjælkeHoejde / 2 + 90)
    }
  } else { //hvis fejl i api 
    textSize(22)
    fill(255)
    text("Henter vejrdata...", kortBredde / 2, bjælkeHoejde / 2)
  }
}

function mousePressed() {
  byer.forEach(by => {
    let x = map(by.lon, lonMin, lonMax, 0, kortBredde)
    let y = map(by.lat, latMax, latMin, bjælkeHoejde, bjælkeHoejde + kortHoejde)
    
    // tjek om musen er tæt på en by 
    if (dist(mouseX, mouseY, x, y) < klikRadius) {
      valgtBy = by
      land = by.navn
      hentVejrData(land); // hent ny vejrdata for den valgte by
    }
  })
}
