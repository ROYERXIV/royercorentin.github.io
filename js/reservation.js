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
        this.divInfos = document.getElementById("infos_resa");
        this.divConfirmation = document.getElementById("confirmation_resa");
        this.resaEnCours = document.getElementById("reservation_en_cours");
        this.boutonConfirmation = document.getElementById("bouton_confirmation");
        window.onload = this.resaCheck();
        this.storageResa();
        this.startResa();
        this.initCanvas();
    }
    startResa() {
        this.boutonResa.addEventListener('click', () => {
            // Check des inputs
            if (this.inputNom.value == "") {
                alert("Vous avez oublié de mettre votre nom");
            } else if (this.inputPrenom.value == "") {
                alert("Vous avez oublié votre Prénom");
            } else {
                this.divInfos.style.display = "none";
                this.divConfirmation.style.display = "block";
                this.boutonResa.style.display = "none";
                this.confirmationResa();
            }
        });
        this.annulationBouton.addEventListener('click', () => {
            this.annulationResa();
            alert("Réservation annulée!");
        });
        this.closeResa.addEventListener("click", () => {
            this.voletResa.style.opacity = "0";
            this.voletResa.style.right = "0";
            this.voletResa.style.display = "none";

        });
        // Remplissage des inputs
    }
    confirmationResa() {
        this.boutonConfirmation.addEventListener("click", () => {
            if (this.isSigned === true) {
                sessionStorage.removeItem("recupEndTimer");
                this.divConfirmation.style.display = "none";
                this.resaEnCours.style.display = "flex";
                this.recapTimer.style.display = "block";
                clearInterval(this.intervalTimer);
                this.recupData();
                this.startTimer();
                this.annulationBouton.style.display = "inline-block";
            } else {
                alert("Vous n'avez pas signé !");
            }
        });
    }
    recupData() {
        this.recupStation = document.getElementById('nom_station').textContent;
        sessionStorage.setItem("sessionStation", this.recupStation);
        this.recapTexte = document.getElementById('recap_texte');
        this.recapPrenom = localStorage.getItem('inputFirstName');
        this.recapNom = localStorage.getItem('inputName');
        this.recapTexte.innerHTML = " Vous avez reservé un vélo a la Station : "+"<br />" + this.recupStation + "<br /> " + "Au nom de :" + " " + this.recapPrenom + " " + this.recapNom;
        this.recapTexte.style.background = "#2D9A29";
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
            this.recapTexte.innerHTML = " Vous avez reservé un vélo a la Station : " +"<br />"+ this.sessionStation + "<br/>" + "Au nom de :" + " " + this.recapPrenom + " " + this.recapNom;
            this.recapTexte.style.background = "#2D9A29";
            this.annulationBouton.style.display = "inline-block";
            this.start = sessionStorage.getItem("start");
            this.divInfos.style.display = "none";
            this.divConfirmation.style.display = "none";
            this.boutonResa.style.display = "none";
            this.resaEnCours.style.display = "flex";
            this.recapTimer.style.display = "block";
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
        this.divTimer.innerText = null;
        this.recapText.innerText = " Votre reservation a expiré.";
        this.recapTexte.style.background = "gray";
        this.annulationBouton.style.display = "none";
        this.resaEnCours.style.display = "none";
        this.divConfirmation.style.display = "none";
        this.divInfos.style.display = "block";
        this.boutonResa.style.display = "block";
        this.recapTimer.style.display = "none";
    }

    annulationResa() {
        clearInterval(this.intervalTimer);
        sessionStorage.removeItem("start");
        this.divTimer.innerText = null;
        this.recapText.innerText = "Vous n'avez pas de réservation pour le moment.";
        this.recapTexte.style.background = "gray";
        this.annulationBouton.style.display = "none";
        this.resaEnCours.style.display = "none";
        this.divConfirmation.style.display = "none";
        this.divInfos.style.display = "block";
        this.boutonResa.style.display = "block";
        this.recapTimer.style.display = "none";


    }
    storageResa() {
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
        });
    }
    initCanvas() {
        this.canvas = document.getElementById("canvas_signature");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "black";
        this.canvas.height = 200;
        this.canvas.width = 300;
        this.ctx.linejoin = "round";
        this.ctx.linecap = "round";
        this.draw = false;
        this.isSigned = false;
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
            event.preventDefault();
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);

        });
        this.canvas.addEventListener('touchmove', (e) => {
            if (this.draw) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.x;
                const y = e.touches[0].clientY - rect.y;
                this.isSigned = true;
                event.preventDefault();
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            }
        });
        this.canvas.addEventListener('touchend', () => {
            this.draw = false;
            event.preventDefault();
            this.ctx.closePath();
        });
    }

}

