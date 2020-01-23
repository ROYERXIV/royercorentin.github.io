// Constructeur de la Map
class Map {
    constructor(id, url, lat, lng, zoom) {
        this.setMap(id, url, lat, lng, zoom);
        this.loadStations(url);
    }
    // Initialisation de la map
    setMap(id, url, lat, lng, zoom) {
        this.mymap = L.map(id).setView([lat, lng], zoom);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 20,
            id: 'mapbox/streets-v11',
            accessToken: 'sk.eyJ1IjoicHJveWVyY29yZW50aW45MSIsImEiOiJjazRuNjQyamcxeDA5M2tudGp2djh3bXdoIn0.K2ZMWcnLfoeBnkjxiZNrCQ'
        }).addTo(this.mymap);
    }
    // Chargement des stations
    loadStations(url) {
        ajaxGet(url, (stations) => {
            // Initialisation des stations et marqueurs
            for (let i = 0; i < stations.length; i++) {
                const station = stations[i];
                // console.log(station);
                const marker = L.marker([station.position.lat, station.position.lng]).addTo(this.mymap);
                marker.station = station;
                marker.addEventListener("click", (e) => {
                    console.log(station);
                    // Volet des réservations
                    const voletResa = document.getElementById("reservation");
                    // document.querySelector("#map").style.width = "70%";
                    voletResa.style.width = "30%";
                    voletResa.style.opacity = "1";
                    voletResa.style.right = "0";
                    voletResa.style.height = "80vh";
                    document.querySelector("#nom_station").innerText = "Station " + station.name;
                    document.querySelector("#adresse_station").innerHTML = " Adresse : " + station.address;
                    document.querySelector("#nombre_places").innerText = station.available_bike_stands + " emplacements disponibles !";
                    document.querySelector("#nombre_velos").innerText = station.available_bikes + " vélos disponibles !";
                });
            }
        });
    }
}

const map = new Map(
    "map",
    "https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=b9a75eec8dfb55eeb8a042bbe5fb64d270f667c7",
    45.76,
    4.84,
    12.8);

// SECTION CANVAS 

class CanvasSignature {
    constructor() {
        this.canvas = document.getElementById("canvas_signature");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "black";
        this.canvas.height = 200;
        this.canvas.width = 300;
        this.ctx.linejoin = "round";
        this.ctx.linecap = "round";
        this.draw = false;
        this.initMouse();
        this.isSigned = false;
    }
    initMouse() {
        this.canvas.addEventListener('mousemove', (e) => {
            console.log(e.offsetX, e.offsetY);
            if (this.draw) {
                this.isSigned = true;
                this.ctx.lineTo(e.offsetX, e.offsetY);
                this.ctx.stroke();
            }
        });
        this.canvas.addEventListener('mousedown', (e) => {
            this.draw = true;
            this.ctx.beginPath();
            this.ctx.moveTo(e.offsetX, e.offsetY);

        });
        this.canvas.addEventListener('mouseup', () => {
            this.draw = false;
            this.ctx.closePath();
        });
        this.canvas.addEventListener('touchstart', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.x;
            const y = e.touches[0].clientY - rect.y;
            this.draw = true;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);

        });
        this.canvas.addEventListener('touchmove', (e) => {
            if (this.draw) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.x;
                const y = e.touches[0].clientY - rect.y;
                this.isSigned = true;
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            }
        });
        this.canvas.addEventListener('touchend', () => {           
            this.draw = false;
            this.ctx.closePath();
        });
    }
}

const canvas = new CanvasSignature();

class StorageReservation {
    constructor() {
        this.boutonResa = document.getElementById("bouton_résa");
        this.inputNom = document.getElementById("input_nom");
        this.inputPrenom = document.getElementById("input_prenom");
        this.inputNom.value = localStorage.getItem("inputName");
        this.inputPrenom.value = localStorage.getItem("inputFirstName");
        this.boutonResa.addEventListener('click', () => {
            localStorage.setItem("inputName", this.inputNom.value);
            console.log(this.inputNom.value);
            localStorage.setItem("inputFirstName", this.inputPrenom.value);
            console.log(this.inputPrenom.value);
            this.storedName = localStorage.getItem('inputName');
            console.log(this.storedName);
            this.storedFirstName = localStorage.getItem('inputFirstName');
            console.log(this.storedFirstName);
        })
    }
}

const Resastorage = new StorageReservation();

class Reservation {
    constructor() {
        this.boutonResa = document.getElementById("bouton_résa");
        this.inputNom = document.getElementById("input_nom");
        this.inputPrenom = document.getElementById("input_prenom");
        this.divResa = document.getElementById("recap_reservation");
        this.recapText = document.getElementById("recap_texte");
        this.recapText.innerText = "Vous n'avez pas de réservation pour le moment";
        this.recapTimer = document.getElementById("recap_timer");
        this.stockageStation = document.getElementById("nom_station").value;
        this.annulationBouton = document.getElementById("annulation");
        this.closeResa = document.getElementById("close_resa");
        this.annulationBouton.style.display = "none";
        this.voletResa = document.getElementById("reservation");
        window.onload = this.resaCheck();
        this.boutonResa.addEventListener('click', () => {
            // Check des inputs
            if (this.inputNom.value == "") {
                alert("Vous avez oublié de mettre votre nom");
            } else if (this.inputPrenom.value == "") {
                alert("Vous avez oublié votre Prénom");
            }
             else {
                sessionStorage.removeItem("recupEndTimer");
                this.recupData();
                this.startTimer();
                this.annulationBouton.style.display = "block";
            }
        });
        this.annulationBouton.addEventListener('click', () => {
            this.annulationResa();
            alert("Réservation annulée!");
        })
        this.closeResa.addEventListener("click", () => {
            this.voletResa.style.width = "0";
            this.voletResa.style.opacity = "0";
            this.voletResa.style.right = "0";
            this.voletResa.style.height = "0";

        })
        // Remplissage des inputs
    }
    recupData() {
        this.recupStation = document.getElementById('nom_station').textContent;
        sessionStorage.setItem("sessionStation", this.recupStation);
        this.recapTexte = document.getElementById('recap_texte');
        this.recapPrenom = localStorage.getItem('inputFirstName');
        this.recapNom = localStorage.getItem('inputName');
        this.recapTexte.innerText = " Vous avez reservé un vélo a la Station : " + this.recupStation + " " + "Au nom de :" + " " + this.recapPrenom + " " + this.recapNom;
    }
    startTimer() {
        this.start = (new Date()).getTime();
        this.divTimer = document.getElementById("recap_timer");
        sessionStorage.setItem("start", this.start);
        this.intervalTimer = setInterval(() => {
            this.now = (new Date()).getTime();
            // console.log(now-start);
            this.time = 1200 - Math.floor((this.now - this.start) / 1000);
            this.testTimer = Math.floor(this.time / 60) + ":" + (this.time % 60);
            this.endTimer = this.start + 1200000;
            sessionStorage.setItem('recupEndTimer', this.endTimer);
            if (this.now > this.endTimer) {
                this.annulationResa();
                this.resaTimeOut();
            }
            console.log(this.testTimer);
            this.divTimer.innerHTML = "Temps restant :" + "<br/>" + this.testTimer;
        }, 1000);

    }
    resaCheck() {
        this.start = (new Date()).getTime();
        this.divTimer = document.getElementById("recap_timer");
        if (sessionStorage.getItem("start")) {
            this.recupStation = document.getElementById('nom_station').textContent;
            this.recapTexte = document.getElementById('recap_texte');
            this.recapPrenom = localStorage.getItem('inputFirstName');
            this.recapNom = localStorage.getItem('inputName');
            this.sessionStation = sessionStorage.getItem("sessionStation");
            this.recapTexte.innerText = " Vous avez reservé un vélo a la Station : " + this.sessionStation + " " + "Au nom de :" + " " + this.recapPrenom + " " + this.recapNom;
            this.annulationBouton.style.display = "block";
            this.start = sessionStorage.getItem("start");
            console.log(this.start);
            this.intervalTimer = setInterval(() => {
                this.now = (new Date()).getTime();
                // console.log(now-start);
                this.time = 1200 - Math.floor((this.now - this.start) / 1000);
                this.testTimer = Math.floor(this.time / 60) + ":" + (this.time % 60);
                this.endTimer = sessionStorage.getItem('recupEndTimer');
                console.log(this.now);
                console.log(this.endTimer);
                if (this.now > this.endTimer) {
                    this.annulationResa();
                    this.resaTimeOut();
                }
                console.log(this.testTimer);
                this.divTimer.innerHTML = "Temps restant :" + "<br/>" + this.testTimer;
            }, 1000);
        }

    }

    resaTimeOut() {
        alert("Votre réservation a expiré");
        this.divTimer.innerText = "";
        this.recapText.innerText = " Votre reservation a expiré.";
    }

    annulationResa() {
        clearInterval(this.intervalTimer);
        sessionStorage.removeItem("start");
        this.divTimer.innerText = " ";
        this.recapText.innerText = "Vous n'avez pas de réservation pour le moment.";
        this.annulationBouton.style.display = "none";


    }
}

const classResa = new Reservation();