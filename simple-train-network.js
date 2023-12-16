class Station {
    constructor(name) {
        this.name = name;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Track {
    constructor(startStation, endStation) {
        this.startStation = startStation;
        this.endStation = endStation;
    }
}

class TrainNetwork {
    constructor() {
        this.stations = {};
        this.tracks = [];
    }

    addStation(name) {
        const station = new Station(name);
        this.stations[name] = station;
        return station;
    }

    connectStations(startName, endName) {
        if (!this.stations[startName] || !this.stations[endName]) {
            throw new Error("Station does not exist");
        }

        // Add track from start to end
        let track = new Track(this.stations[startName], this.stations[endName]);
        this.tracks.push(track);

        // Add reverse track from end to start
        track = new Track(this.stations[endName], this.stations[startName]);
        this.tracks.push(track);
    }

    // A simple method to list all tracks for visualization
    listTracks() {
        return this.tracks.map(track => `${track.startStation.name} to ${track.endStation.name}`);
    }

    visualize(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear previous visualization

        // Visualize Stations
        for (const key in this.stations) {
            const station = this.stations[key];
            const stationDiv = document.createElement('div');
            stationDiv.className = 'station';
            stationDiv.style.left = `${station.x}px`;
            stationDiv.style.top = `${station.y}px`;
            stationDiv.title = station.name;
            container.appendChild(stationDiv);
        }

        // Visualize Tracks
        // Additional logic needed to calculate line positions and angles
    }
}

// Create network and stations
const network = new TrainNetwork();
network.addStation("Central").setPosition(300, 200);
network.addStation("North Park").setPosition(300, 100);
// ... add other stations and set positions ...

// Visualize the network
network.visualize('network');
