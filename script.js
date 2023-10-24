//Botones y ranges
let replayB = document.getElementById("replay");
let replayIMG = document.getElementById("replay-img");
let beforeB = document.getElementById("before");
let beforeIMG = document.getElementById("before-img");
let playB = document.getElementById("play");
let playIMG = document.getElementById("play-img");
let nextB = document.getElementById("next");
let nextIMG = document.getElementById("next-img");
let randomB = document.getElementById("random");
let randomIMG = document.getElementById("random-img");
let volumen=document.getElementById("volumen");

//Variables de estado
let replayState = false;
let playState = false;
let randomState = false;

//Texto e imagen
let cancion = document.getElementById("cancion");
let imgAlbum = document.getElementById("imgAlbum");
let cola = document.getElementById("cola");
let timeNow=document.getElementById("tiempoAhora");
let timeFinal=document.getElementById("tiempoFinal");
let body=document.body;

//Fondo actual
let fondo=1;

//Canciones
let songs = ["dragon", "gerudo", "kass", "midna"];
let songsTitle = ["Dragon Roost Island", "Gerudo Valley", "Kass' Theme", "Midna's Lament"];
let songsSrc = [];//Src de canciones
let songPlaying = 0;//Canción reproduciendose

let i = 0;
songs.forEach(element => {//Crea las canciones y los botones de estas
    let aux = document.createElement("audio");
    let colaSong = document.createElement("div");
    colaSong.innerHTML = `<p>${songsTitle[i]}</p>`; 
    colaSong.classList.add("cancionCola");
    colaSong.id=`${element}`;
    colaSong.addEventListener("click",function() {
        selectSong(songs.indexOf(colaSong.id));
    }, false);
    i++;
    cola.appendChild(colaSong);
    aux.src = `music/${element}.mp3`
    aux.load();
    aux.pause();
    songsSrc.push(aux);
});
//Event listener de todos los botones y ranges
playB.addEventListener("click", playClick);
beforeB.addEventListener("click", beforeSong);
nextB.addEventListener("click", nextSong);
replayB.addEventListener("click", repeat);
randomB.addEventListener("click",randomSong);
volumen.addEventListener("change", changeVolume);

const interval = setInterval(function () {
    //Poner el valor máximo del tiempo de canción
    timeFinal.innerText=timeSet(songsSrc[songPlaying].duration);
    songsSrc[songPlaying].onloadedmetadata = () => $seekbar.max = songsSrc[songPlaying].duration
    // Actualizar avance de la canción
    timeNow.innerText=timeSet(songsSrc[songPlaying].currentTime);
    $seekbar.onchange = () => songsSrc[songPlaying].currentTime = $seekbar.value
    $seekbar.max=songsSrc[songPlaying].buffered.end(songsSrc[songPlaying].buffered.length-1);
    songsSrc[songPlaying].ontimeupdate = () => $seekbar.value = songsSrc[songPlaying].currentTime
    //Reproduce la siguiente cancion cuando acabe, comprueba si está en repetición o no
    if(songsSrc[songPlaying].currentTime>= songsSrc[songPlaying].duration){
        if(!replayState){
            nextSong();
        } else{
            playClick();
        }
    }
}, 1000);
//Reproduce y cambia el icono de play
function playClick() {
    if (playState) {
        playState = false;
        playIMG.src = "img/play.png";
        songsSrc[songPlaying].pause();
    } else {
        playState = true;
        playIMG.src = "img/pausa.png";
        songsSrc[songPlaying].play();
    }
}
//Cambia todos los valores a la canción que corresponda
function playSong(index) {
    cancion.innerText = songsTitle[index];
    imgAlbum.src = `img/${songs[index]}.jpg`
    songPlaying = index;
    document.getElementById(songs[index]).classList.remove("cancionCola");
    document.getElementById(songs[index]).classList.add("cancionColaPlay");
    randomWallpaper();
}
//Para la música que estaba en reproduccion y actualiza la interfaz acorde
function stopMusic() {
    let songAux = 0;
    songsSrc.forEach(element => {
        document.getElementById(songs[songAux]).classList.remove("cancionColaPlay");
        document.getElementById(songs[songAux]).classList.add("cancionCola");
        songAux++;
    });
    songsSrc[songPlaying].pause();
    songsSrc[songPlaying].currentTime=0;
    playState = false;
    playIMG.src = "img/play.png";
}
//Reproduce la siguiente canción que corresponda
function nextSong() {
    stopMusic();
    if(!randomState){
        if (songPlaying >= songs.length - 1) {
            songPlaying = 0;
        } else {
            songPlaying++;
        }
    }else{
        randomSongNumber();
    }

    playSong(songPlaying);
    playClick();
}
//Reproduce la anterior canción que corresponda
function beforeSong() {
    stopMusic();
    if(!randomState){
        if (songPlaying == 0) {
            songPlaying = songs.length - 1;
        } else {
            songPlaying--;
        }
    }else{
        randomSongNumber();
    }

    playSong(songPlaying);
    playClick();
}
//Pone un fondo aleatorio a la web
function randomWallpaper(){
    body.classList.remove(`fondo${fondo}`);
    let generated=0
    do {
        generated=Math.floor(Math.random() * (5 - 1 + 1) + 1);
    } while (generated==fondo);
    fondo=generated;
    body.classList.add(`fondo${fondo}`);
}
//Pone el tiempo de la canción en su formato
function timeSet(time){
    let timeAux=Math.round(time);
    let part1=Math.trunc(timeAux/60);
    let part2=Math.round(timeAux%60);
    if(part2>=0 && part2<10){
        part2=`0${part2}`;
    }
    let result= `${part1}:${part2}`;
    return result;
}
//Controla la repetición de canciones
function repeat(){
    if(replayState){
        replayState=false;
        replayIMG.src="img/repeat-off.png";
    }else{
        replayState=true;
        replayIMG.src="img/repeat-on.png";
    }
}
//Controla si hay que poner una canción aleatoria
function randomSong(){
    if(randomState){
        randomState=false;
        randomIMG.src="img/random-off.png";
    }else{
        randomState=true;
        randomIMG.src="img/random-on.png";
    }
}
//Crea un número de canción aleatoria distinto del que se está reproduciendo
function randomSongNumber(){
    let generated=0
    do {
        generated=Math.floor(Math.random() * (songs.length-1 - 0 + 1) + 0);
    } while (generated==songPlaying);
    songPlaying=generated;
}
//Funcion de los botones de selector de canción
function selectSong(index){
    stopMusic();
    playSong(index);
    playClick();
}
//Cambia el volumen de las canciones
function changeVolume(){
    songsSrc.forEach(element => {
        element.volume=volumen.value;
    });
}

playSong(songPlaying);