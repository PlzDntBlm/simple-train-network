class Station {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
}

class Track {
    constructor(startStation, endStation) {
        this.startStation = startStation;
        this.endStation = endStation;
        this.status = 'operational'; // Default status
    }

    setStatus(newStatus) {
        this.status = newStatus;
    }
}


class TrainNetwork {
    constructor() {
        this.stations = {};
        this.tracks = [];
    }

    addStation(name, x, y) {
        const station = new Station(name, x, y);
        this.stations[name] = station;
        return station;
    }

    connectStations(startName, endName) {
        if (!this.stations[startName] || !this.stations[endName]) {
            throw new Error("Station does not exist");
        }

        // Bidirectional tracks
        this.tracks.push(new Track(this.stations[startName], this.stations[endName]));
        this.tracks.push(new Track(this.stations[endName], this.stations[startName]));
    }

    setTrackStatus(startName, endName, status) {
        const track = this.tracks.find(track =>
            track.startStation.name === startName && track.endStation.name === endName);

        if (track) {
            track.setStatus(status);
        } else {
            throw new Error("Track does not exist");
        }
    }

    visualize(containerId) {
        const svg = d3.select(`#${containerId}`).append('svg')
            .attr('width', 600)
            .attr('height', 400);

        // Function to slightly offset the tracks for visualization
        function offsetLine(track, offset) {
            const dx = track.endStation.x - track.startStation.x;
            const dy = track.endStation.y - track.startStation.y;
            const normal = Math.sqrt(dx * dx + dy * dy);
            const offsetX = offset * (dy / normal);
            const offsetY = offset * (-dx / normal);

            return {
                x1: track.startStation.x + offsetX,
                y1: track.startStation.y + offsetY,
                x2: track.endStation.x + offsetX,
                y2: track.endStation.y + offsetY
            };
        }

        // Draw Tracks with offset to visualize separate tracks
        // Draw Tracks with status-based styling
        svg.selectAll('.track')
            .data(this.tracks)
            .enter()
            .append('line')
            .attr('class', 'track')
            .attr('x1', d => offsetLine(d, 3).x1)
            .attr('y1', d => offsetLine(d, 3).y1)
            .attr('x2', d => offsetLine(d, 3).x2)
            .attr('y2', d => offsetLine(d, 3).y2)
            .attr('stroke', d => d.status === 'operational' ? 'black' : 'red'); // Example: red for non-operational tracks

        // Draw Stations
        svg.selectAll('.station')
            .data(Object.values(this.stations))
            .enter()
            .append('circle')
            .attr('class', 'station')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 5)
            .attr('fill', 'blue');

        // Add Labels
        svg.selectAll('.label')
            .data(Object.values(this.stations))
            .enter()
            .append('text')
            .attr('x', d => d.x + 10)
            .attr('y', d => d.y + 5)
            .text(d => d.name)
            .attr('font-size', '10px');
    }
}

// Create network and stations
const network = new TrainNetwork();
network.addStation("Central", 300, 200);
network.addStation("North Park", 300, 100);
network.addStation("South Plaza", 300, 300);
network.addStation("East Junction", 400, 200);
network.addStation("West End", 200, 200);

// Connect Stations
network.connectStations("Central", "North Park");
network.connectStations("Central", "South Plaza");
network.connectStations("Central", "East Junction");
network.connectStations("Central", "West End");
network.connectStations("North Park", "East Junction");
network.connectStations("South Plaza", "West End");

// Set track status
network.setTrackStatus("Central", "North Park", "under repair");

// Visualize the network
network.visualize('network');
