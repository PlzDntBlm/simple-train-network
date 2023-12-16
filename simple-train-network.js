class Station {
    constructor(name) {
        this.name = name;
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
}

// Create a new Train Network
const network = new TrainNetwork();

// Add Stations
network.addStation("Central");
network.addStation("North Park");
network.addStation("South Plaza");
network.addStation("East Junction");
network.addStation("West End");

// Connect Stations
network.connectStations("Central", "North Park");
network.connectStations("Central", "South Plaza");
network.connectStations("Central", "East Junction");
network.connectStations("Central", "West End");
network.connectStations("North Park", "East Junction");
network.connectStations("South Plaza", "West End");

console.log(network.listTracks());

