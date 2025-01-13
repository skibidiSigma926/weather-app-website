let DanmarkskortImg, Sol, SkySol;
let Lokation = [0, 0];
let AalborgBtn, AarhusBtn, KobenhavnBtn;
let VejrType = "Sol";

function preload() {
  DanmarkskortImg = loadImage("Billeder/AB-TMAB031-Danmarkskort.png");
  Sol = loadImage("Billeder/sun-icon-set-clipart-design-illustration-free-png.webp");
  SkySol = loadImage("Billeder/sun-behind-cloud-emoji-clipart-lg.png");
}

function setup() {
  createCanvas(1000, 500);
  background("#E0E0E0");
  
  // Knapper til byvalg
  AalborgBtn = createButton('Aalborg');
  //AalborgBtn.position(50, 420);
  AalborgBtn.mousePressed(() => ByValg('Aalborg'));
  
  AarhusBtn = createButton('Aarhus');
  //AarhusBtn.position(150, 420);
  AarhusBtn.mousePressed(() => ByValg('Aarhus'));
  
  KobenhavnBtn = createButton('København');
  //KobenhavnBtn.position(250, 420);
  KobenhavnBtn.mousePressed(() => ByValg('København'));
  
  scale(0.5); image(DanmarkskortImg, 0, 0);
}

function draw() {
  background("#E0E0E0");
  scale(0.5); image(DanmarkskortImg, 0, 0);
  
  // Vælg ikon baseret på vejrtype
  let ikon = VejrType === "Sol" ? Sol : SkySol;
  
  // Tegn ikon på valgt lokation
  image(ikon, Lokation[0], Lokation[1], ikon.width * 0.075, ikon.height * 0.075);
}

function ByValg(by) {
  if (by === 'Aarhus') { 
    Lokation = [400, 450]; 
    VejrType = "Sol"; // Brug data fra API her
  } else if (by === 'København') {
    Lokation = [750, 575];
    VejrType = "SkySol"; // Brug data fra API her
  } else if (by === 'Aalborg') {
    Lokation = [370, 220];
    VejrType = "Sol"; // Brug data fra API her
  }
}
