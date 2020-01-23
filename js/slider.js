class Diaporama {
    constructor(id) {
        this.slider = document.getElementById(id);
        this.slides = slider.querySelectorAll("figure");
        this.btn_previous = slider.querySelector(".previous");
        this.btn_next = slider.querySelector(".next");
        this.index = 0;
        this.afficher();
        window.onload = this.keysInput();
        this.btn_playpause = document.querySelector(".playpause");
        this.iconepp = this.btn_playpause.querySelector("i");
        this.iconepp.addEventListener("click", () => {
            this.switchpp()
        });
        this.slideInterval = setInterval(() => {
            this.next()
        }, 5000);
        window.onload = this.switchpp();
        window.onload = this.slideInterval;
        this.btn_next.addEventListener("click", () => {
            this.next()
        });
        this.btn_previous.addEventListener("click", () => {
            this.previous()
        });
    }
    afficher() {
        for (let i = 0; i < this.slides.length; i++) {
            this.slides[i].style.display = "none";
        }
        this.slides[this.index].style.display = "block";
    }

    // Boutons de défilement
    //
    next() {
        this.index++;
        if (this.index > this.slides.length - 1) {
            this.index = 0;
        }
        this.afficher();
        this.resetInterval();
    }

    previous() {
        this.index--;
        if (this.index < 0) {
            this.index = this.slides.length - 1;
        }
        this.afficher();
        this.resetInterval();
    }
    switchpp() {
        if (this.iconepp.classList.contains("fa-pause")) {
            this.pause();
            this.iconepp.classList.remove("fa-pause");
            this.iconepp.classList.add("fa-play");
            return "ca pause";
        } else {
            this.pause();
            this.play();
            this.iconepp.classList.remove("fa-play");
            this.iconepp.classList.add("fa-pause");
            return "ca play";
        }

    }
    resetInterval() {
        this.pause();
        this.play();
    }
    pause() {
        clearInterval(this.slideInterval);
    }
    play() {
        this.slideInterval = setInterval(() => {
            this.next()
        }, 5000);
    }
    keysInput() {
        document.onkeyup = () => {
            if (event.keyCode == 37) {
                this.previous();
            } else if (event.keyCode == 39) {
                this.next();
            }
        }
    }


}
// init slider
const diaporama = new Diaporama("slider");

// bouton play pause




//