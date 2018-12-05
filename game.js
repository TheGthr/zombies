/* DELORME Tanguy - GAUTHIER Théo FISE2 */

var cs = document.getElementById("cv");
var ctx = cs.getContext("2d");
window.requestAnimationFrame = window.requestAnimationFrame || window.mozAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var backgroundSound = new Audio("background_sound.mp3");
backgroundSound.play();
backgroundSound.volume = 0.1;
// citations dans la partie
var debutPartie = new Audio("debutPartie.mp3");
debutPartie.play();
var win = new Audio("win.mp3"); 
var mortboss = new Audio("mortboss.mp3");
var crevez = new Audio("crevez.mp3");
var loose = new Audio("loose.mp3");
var monsterroar = new Audio("monsterroar.mp3");
//variable de conditions pour lancer les citations
var play = true;	
var play2 = true;
var play3 = true;
var play4 = true;

// Chargement du background
var background = new Image();
background.src = "grass.jpg";
background.loaded = false;
function drawBackground() {
	ctx.drawImage(background, 0, 0, 600, 800);
	background.loaded = true;
};

class Zombie {
	constructor(type, timestamp, player) {
		this.i = player.vectZ.length;
		this.type = type;
		this.sprite = new Image();
		this.spriteinitial = new Image();
		this.spritered = new Image();
		this.spritegrave = new Image();
		this.sprite.src = "zombies.png";
		this.spriteinitial.src = "zombies.png";
		this.spritered.src = "zombieshit.png";
		this.spritegrave.src = "tombes.png";
		switch (this.type) {
			case 0:
				this.sx = 0; // position x du zombie dans le sprite
				this.sxmax = 2; //position x max du zombie dans le sprite
				this.sy = 0; // position y du zombie dans le sprite
				this.pvMax = 1; // point de vie max du zombie
				this.pv = 1;		// point de vies du zombie en temps réel
				this.pointsGiven = 1;// score du zombie
				this.speed = 5;// vitesse
				break;
			case 1:
				this.sx = 3;
				this.sxmax = 5;
				this.sy = 0;
				this.pvMax = 2;
				this.pv = 2;
				this.pointsGiven = 3;
				this.speed = 35;
				break;
			case 2:
				this.sx = 6;
				this.sxmax = 8;
				this.sy = 0;
				this.pvMax = 3;
				this.pv = 3;
				this.pointsGiven = 5;
				this.speed = 20;
				break;
			case 3:
				this.sx = 9;
				this.sxmax = 11;
				this.sy = 0;
				this.pvMax = 25;
				this.pv = 25;
				this.pointsGiven = 30;
				this.speed = 100;
				break;
			default:
				this.sx = 9;
				this.sxmax = 11;
				this.sy = 0;
				this.pvMax = 25;
				this.pv = 25;
				this.pointsGiven = 30;
				this.speed = 75;
				break;
		}
		this.timehit = 250; // temps de rougissement du zombie
		this.red = false; // savoir si le zombie est rouge
		this.loaded = true; // savoir si le zombie est en vie ou mort
		this.posxinit = Math.floor(Math.random() * (600 - 64)); //position du zombie en x
		this.posyinit = Math.floor(Math.random() * (100)); // random number between 0 and 100
		this.posx = this.posxinit; //position du zombie en x en temps reel
		this.posy = this.posyinit; //position du zombie en y en temps reel
		this.start = null;
		this.onload = this.drawZombie();
		this.req = requestAnimationFrame(this.deplaceZombie.bind(this));
	}
	
	// méthode pour vérifier si un zombie est touché au clic
	hitZombie() { 

		//coordonnées de la souris dans le canvas
		let mouse = getOffset(event);
		let mouseX = mouse.X;
		let mouseY = mouse.Y;
		//4 coins de la photo du zombie
		let xMin = this.posx;
		let xMax = this.posx + 64;
		let yMin = this.posy;
		let yMax = this.posy + 64;
		//detection si le click est sur la photo du zombie
		if (mouseX > xMin && mouseX < xMax && mouseY > yMin && mouseY < yMax) {
			//ajustement de la barre de vie
			this.pv = this.pv - 1;
			this.red = true
			this.timehit = 250;
			//zombie mort
			if (this.pv == 0) {
				this.loaded = false;
				this.posy = 9000;
				player.vectZ.splice(this.i, 1);
				for (var i = this.i; i < player.vectZ.length; i++) {
					player.vectZ[i].i -= 1;
				}
				player.score += this.pointsGiven;
				if(this.type == 3)
				{
					mortboss.play();
				}
			}
		}
	}
	//Dessine la tombe du zombie
	drawGrave(){
		ctx.drawImage(this.spritegrave, 192, 54, 64, 64, this.posxinit, this.posyinit, 64, 64);	
	}
	//Dessine le zombie correspondant à un indice du tableau de zombies
	drawZombie() {
		// condition pour dessiner ou pas le zombie selon ses pv
		if (this.loaded) {	
			if(this.posy < 200) {
				this.drawGrave();
			}
			this.timehit = this.timehit - 1;
			if(this.timehit <= 0) {
				this.red = false
			}
			if(this.red) {
				ctx.drawImage(this.spritered, 64 * this.sx, this.sy, 64, 64, this.posx, this.posy, 64, 64);
			} else {
				ctx.drawImage(this.sprite, 64 * this.sx, this.sy, 64, 64, this.posx, this.posy, 64, 64);
			}
			//conditions pour gérer la couleur de la barre de vie du zombie 
			if (this.pv == this.pvMax) {
				ctx.fillStyle = "#00FF00"; // vert si pv max
			}
			else if (this.pv >= this.pvMax / 2) {
				ctx.fillStyle = "#FFa500"; //orange s pv plus de la moitié ou la moitié
			} else {
				ctx.fillStyle = "#FF0000"; //rouge si moins de la moitié
			}
			ctx.fillRect(this.posx, this.posy - 10, 64 * this.pv / this.pvMax, 5); //affiche la barre de vie et sa couleur
			this.hit = false;
		}
	}
	//Deplacement du zombie
	deplaceZombie(timestamp) {
		if (this.start === null) {
			this.start = timestamp;
		} else if (timestamp - this.start >= this.speed) { // vitesse de déplacement
			this.start = timestamp;
			if (this.posy < 730) {
				this.posy = this.posy + 4; // gère la fluidité
				this.sx = (this.sx + 1); //animation des 3 photos pour un zombie
				if (this.sx > this.sxmax)
					this.sx = this.sxmax - 2;
				
				player.vectZ[this.i] = this;
			} else if (this.posy >= 730 && this.posy < 900) { // si le joueur est touché
				player.isHit();
				this.loaded = false;
				this.posy = 950;
				player.vectZ.splice(this.i, 1);
				for (var i = this.i; i < player.vectZ.length; i++) {
					player.vectZ[i].i -= 1;
				}
				cancelAnimationFrame(this.deplaceZombie.bind(this));
			}
			draw(player.vectZ);
		}
		this.req = requestAnimationFrame(this.deplaceZombie.bind(this));
	}
};

class Player {
	constructor() {
		this.pv = 10; // points de vie du joueur
		this.vectZ = new Array(); // tableau pour ranger les zombies
		this.score = 0; // score du joueur
		this.isDead = false; // si le joueur a des points de vie
		this.hasWon = false; // si le joueur a gagné 
	}

	win() { // quand le jouer a gagné
		for (let i = 0; i < this.vectZ.length; i++) {
			cancelAnimationFrame(this.vectZ[i].req);
			this.vectZ[i].loaded = false;
		}
		this.hasWon = true;
		window.clearInterval(timerVar);
		window.clearInterval(zombieTVar);
	}

	isHit() { // quand le joueur est touché
		if (this.pv > 0) {
			this.pv -= 1;
			this.dead();
		}
	}

	dead() { // quand le joueur est mort
		if (this.pv == 0) {
			for (let i = 0; i < this.vectZ.length; i++) {
				cancelAnimationFrame(this.vectZ[i].req);
				this.vectZ[i].loaded = false;
			}
			this.isDead = true;
			window.clearInterval(timerVar);
			window.clearInterval(zombieTVar);
		}
	}
	//Affichage de la defaite
	drawDead() {
		ctx.font = "50px Arial Black";
		ctx.textAlign = "center";
		ctx.fillStyle = "red";
		ctx.fillText("GAME OVER", 300, 400);
		if(play == true){		
		loose.play();	
		play = false;
		}
	}
	//Affichage de la victoire
	drawWin() {
		ctx.font = "50px Arial Black";
		ctx.textAlign = "center";
		ctx.fillStyle = "blue";
		ctx.fillText("YOU WON !", 300, 400);
		if(play == true){		
		win.play();	
		play = false;
		}
	}
	//Affichage des pv pendant la partie
	drawPV() {
		ctx.font = "20px Arial Black";
		ctx.textAlign = "center";
		ctx.fillStyle = "white";
		ctx.fillText("Life : " + this.pv, 300, 35);
		this.randomNb = Math.floor(Math.random() * (1000));
	}
	//Affichage du score pendant la partie
	drawScore() {
		ctx.font = "20px Arial Black";
		ctx.textAlign = "center";
		ctx.fillStyle = "white";
		ctx.fillText("Score : " + this.score, 150, 35);
	}
};

//Recupere les cooredonnees du click de la souris
function getOffset(element) {
	var x = element.layerX;
	var y = element.layerY;	
	return ({ X: x, Y: y });
	
};
//Son lors du click de la souris
function soundHit(element) {
	let hit = new Audio("MW2_Intervention_Sound.mp3");
	hit.volume = 0.3;
	hit.play();	
};


var player = new Player();
var timeGenerate = 0;
var time = 0;
var freqGen = 2000;
var timerVar;
var zombieTVar;
var start = null;
let date = window.performance.now();
let zombie = new Zombie(0, date, player);
cs.addEventListener('click', function (e) { zombie.hitZombie() }, false);
player.vectZ.push(zombie);
generateZombie();

//Generation des zombies selon le cahier des charges
function generateZombie() {
	timerVar = setInterval(timer, 1000);
	zombieTVar = setInterval(zombieT, freqGen);	
};

function zombieT() { // génère un zombie toutes les freqGen secondes
	if (player.vectZ.length < 20 && player.isDead != true) {
		let type = 0;
		if (time >= 30 && time < 100) {
			if(play2 == true)
			{
			crevez.play();
			play2 = false;
			}
			type = Math.floor(Math.random() * 2);
		} else if (time >= 100 && time < 139) {
			if(play3 == true)
			{
			crevez.play();
			play3 = false;
			}
			type = Math.floor(Math.random() * 3);
		} else if (time === 139 || time === 140) {
			if(play4 == true)
			{
			monsterroar.play();
			play4 = false;
			}			
			type = 3;
			freqGen = 1000;
		} else if (time > 140) {		
			type = Math.floor(Math.random() * 3);
			freqGen = 1000;
		}
		var start = null;
		let date = window.performance.now();
		let zombie = new Zombie(type, date, player);
		cs.addEventListener('click', function (e) { zombie.hitZombie() }, false);
		player.vectZ.push(zombie);
	}
};

//Afficher les zombies qui ont été rangé dans un tableau
function draw(vectZ) {
	ctx.clearRect(0, 0, cs.width, cs.height);
	drawBackground();
	for (var i = 0; i < vectZ.length; i++) {
		vectZ[i].drawZombie();
	}
	timeGenerate += 2.5;
	player.drawPV();
	player.drawScore();
	drawTimer();
	if (player.isDead == true) {
		player.drawDead();
		backgroundSound.pause();		
	} else if (player.hasWon == true) {
		player.drawWin();
		backgroundSound.pause();
	}
};
//Gère le temps de la partie
function timer() {
	if (time < 200) {
		time += 1;
	} else if (time == 200 && player.pv > 0) {
		player.win();		
	}
};
//Affichage du temps
function drawTimer() {
	ctx.font = "20px Arial Black";
	ctx.textAlign = "center";
	ctx.fillStyle = "white";
	ctx.fillText("Time left : " + (200 - time), 450, 35);
};