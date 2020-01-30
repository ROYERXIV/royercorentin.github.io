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
        this.markerCluster = L.markerClusterGroup();
        this.mymap.addLayer(this.markerCluster);
    }
    // Chargement des stations
    loadStations(url) {
        ajaxGet(url, (stations) => {
            // Initialisation des stations et marqueurs
            for (let i = 0; i < stations.length; i++) {
                const station = stations[i];
                // console.log(station);

                const marker = L.marker([station.position.lat, station.position.lng]);
                this.markerCluster.addLayer(marker);
                marker.station = station;
                marker.addEventListener("click", (e) => {
                    console.log(station);
                    // Volet des réservations
                    const voletResa = document.getElementById("reservation");
                    // document.querySelector("#map").style.width = "70%";
                    voletResa.style.opacity = "1";
                    voletResa.style.right = "0";
                    voletResa.style.height = "80vh";
                    voletResa.style.display = "flex";
                    document.querySelector("#nom_station").innerText = "Station " + station.name;
                    document.querySelector("#adresse_station").innerHTML = " Adresse : " + station.address;
                    document.querySelector("#nombre_places").innerText = station.available_bike_stands + " emplacements disponibles !";
                    document.querySelector("#nombre_velos").innerText = station.available_bikes + " vélos disponibles !";
                });
            }
        });
    }
}


