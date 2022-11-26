//VARIABLES
var trex, trex_running, trex_collided;
var suelo, trex_suelo;
var sueloin;
var o1, o2, o3, o4, o5, o6;
var score = 0;
var PLAY =1;
var END =0;
var gameState = PLAY;
var gruposN;
var gruposC;
var gameover, gameoverImg;
var restart, restartImg;
var tero, teroImg;
var gruposT;
var check, checkmp3;
var die, diemp3;
var jump, jumpmp3;


//CARGAR LAS IMÁGENES Y ANIMACIONES
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_suelo = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  o1 = loadImage("obstacle1.png");
  o2 = loadImage("obstacle2.png");
  o3 = loadImage("obstacle3.png");
  o4 = loadImage("obstacle4.png");
  o5 = loadImage("obstacle5.png");
  o6 = loadImage("obstacle6.png");
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  trex_collided = loadAnimation("trex_collided.png");
  teroImg = loadAnimation("tero1.png", "tero2.png");
  
  //CARGAR SONIDOS
  checkmp3 = loadSound("checkpoint.mp3");
  diemp3 = loadSound("die.mp3");
  jumpmp3 = loadSound("jump.mp3");
  
}


//CREAR LAS VARIABLES
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,20); 
  
  //AÑADIR LA ANIMACIÓN
  trex.addAnimation("running",trex_running);
  trex.addAnimation("colisión",trex_collided);
  
  //MODIFICAR EL TAMAÑO DEL PERSONAJE
  trex.scale = 0.5;
  
  //AÑADIR LAS IMÁGENES
  suelo = createSprite(width/2, height-80, width, 2);
  suelo.addImage(trex_suelo);
  
  gameover = createSprite(width/2, height/2 - 50);
  gameover.addImage(gameoverImg);
  
  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  restart.scale = 0.6;
  
  //CREAR SUELO INVISIBLE
  sueloin = createSprite(width/2, height-10, width, 125);
  sueloin.visible = false;
  
  //CREAR GRUPOS 
  gruposC = new Group();
  gruposN = new Group();
  gruposT = new Group();
  
  trex.setCollider("circle", 0,0,40);
  trex.debug = true;
  
}


function draw() {
  background("grey");
  
  //CREAR TEXTO
  text("puntuación: " + score, 100,20);
  
  //CREAR ESTADO DE JUEGO
  if(gameState === PLAY) {
    
    //VELOCIDAD DEL SUELO Y SE MULTIPLICA LA VELOCIDAD
    suelo.velocityX = - (5 + 2* score / 200);
    
    //COLOCAR NÚMEROS ENTEROS
    score = score + Math.round (frameCount/60);
    
    if(score > 0 && score % 100 === 0) {
      checkmp3.play();
    } 
    
    //INDICAR QUE CUANDO SE PRESIONE LA TECLA, TREX BRINCARA
    if(touches.lenght > 0 || keyDown("space")&& trex.y >= height-120) {
      jumpmp3.play();
      touches = [];
     
      
      
    //VELOCIDAD DEL PERSONAJE
    trex.velocityY= -3;  
  }
    
    //ASIGNAR GRAVEDAD AL PERSONAJE
    trex.velocityY = trex.velocityY+0.5;
    
    gameover.visible = false;
    restart.visible = false;
    
    
  //CREAR SUELO INFINITO
  if(suelo.x <0) {
  suelo.x = suelo.width/2;
  }
    
    spawnClouds();
  cactus();
    Teros();
    
    if(gruposC.isTouching(trex)) {
      gameState = END;
      //trex.velocityY = -3;
      diemp3.play();
    }
    
  }
  
  
  else if(gameState === END) {
    suelo.velocityX = 0;
    
    //Se usa setVelocity cuando es un grupo
    //Detiene al grupo de los cactus y nubes
    gruposC.setVelocityXEach(0);
    gruposN.setVelocityXEach(0);
    //gruposT.setVelocityXEach(0);
    
    trex.changeAnimation("colisión",trex_collided);
    trex.velocityY = 0;
    
    //Código para que no desaparezcan de la pantalla
    gruposC.setLifetimeEach(-1);
    gruposN.setLifetimeEach(-1);
    //gruposT.setLifetimeEach(-1);
    
     gameover.visible = true;
  restart.visible = true;
    
    if(touches.lenght > 0 || keyDown("space"))
    {
      reinicio();
      touches = []
    }
  
    //MANDAR A LLAMAR A LA FUNCIÓN "REINICIO"
  if(mousePressedOver(restart)) {
    reinicio();
  }
    
  }
  
  //TREX COLISIONA CON EL SUELO INVISIBLE / EVITAR Q EL TREX CAIGA
  trex.collide(sueloin);
  
  
  
 
  drawSprites()
} 


function reinicio() {
  gameover.visible = false;
  restart.visible = false;
  trex.changeAnimation("running",trex_running)
  gruposC.destroyEach();
  gruposN.destroyEach();
  gameState = PLAY;
  score = 0;
  
}


function spawnClouds() {
  
  //CÓDIGO PARA LA VARIABLE "CLOUD" 
  if (frameCount % 60 === 0) {
    cloud = createSprite(width+20, height-600, 40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(height/2,1800))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    
    //ASIGNAR TIEMPO DE VIDA A LA VARIABLE
    cloud.lifetime = 134
    gruposN.add(cloud);
    
    //AJUSTAR LA PROFUNDIDAD
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    }
}


function cactus() {
  if (frameCount % 60 === 0) {
    cactus2 = createSprite(1200,height-95,20,25);
    
    //INDICAR Y AUMENTAR VELOCIDAD 
    cactus2.velocityX= - (3 + score/100);
    cactus2.lifetime = 300;
    
    //ASIGNAR LOS LÍMITES DE NÚMEROS PARA LA ACCIÓN ALEATORIA
    var rand = Math.round(random(1,6));
    
    //CREAR EL CÓDIGO PARA LA ACCIÓN ALEATORIA
    switch (rand) {
      case 1 : cactus2.addImage(o1);
        break;
        case 2 : cactus2.addImage(o2);
        break;
        case 3 : cactus2.addImage(o3);
        break; 
        case 4 : cactus2.addImage(o4);
        break;
        case 5 : cactus2.addImage(o5);
        break;
        case 6 : cactus2.addImage(o6);
        break;
        default : break;
    }
    cactus2.scale = 0.5;
    
    //AÑADIR LOS CACTUS A GRUPOSC
    gruposC.add(cactus2);
  }
}

function Teros() {
  if (frameCount % 60 === 0) {
    
  tero = createSprite(height/1800, 1800);
  tero.addAnimation("teros",teroImg);
    
    tero.velocityX = -10;
    gruposT.add(tero);
    tero.lifetime = 200;
    
    tero.y = Math.round(random(height/1800, 1800));
  }
}
