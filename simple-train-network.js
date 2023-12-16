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
        this.status = 'operational'; // operational, underMaintenance, outOfService
        this.isBidirectional = false;
    }

    setStatus(newStatus) {
        this.status = newStatus;
    }

    setBidirectional(isBidirectional) {
        this.isBidirectional = isBidirectional;
        // If there's a corresponding reverse track, you might also want to update its bidirectionality
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

    // Method to connect two stations with a unidirectional track
    connectOneWay(startName, endName) {
        if (!this.stations[startName] || !this.stations[endName]) {
            throw new Error("Station does not exist");
        }
        this.tracks.push(new Track(this.stations[startName], this.stations[endName]));
    }

    // Method to connect two stations with bidirectional tracks
    connectBothWays(startName, endName) {
        this.connectOneWay(startName, endName);
        this.connectOneWay(endName, startName);
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

        const tooltip = d3.select("#tooltip");

        // Function to determine if reverse track exists
        const hasReverseTrack = (track) => {
            return this.tracks.some(t =>
                t.startStation.name === track.endStation.name &&
                t.endStation.name === track.startStation.name);
        };

        // Function to slightly offset the tracks for visualization
        function offsetLine(track, offset, hasReverse) {
            if (!hasReverse) return {
                x1: track.startStation.x,
                y1: track.startStation.y,
                x2: track.endStation.x,
                y2: track.endStation.y
            };

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

        // Draw Tracks with or without offset
        svg.selectAll('.track')
            .data(this.tracks)
            .enter()
            .append('line')
            .attr('class', 'track')
            .attr('x1', d => offsetLine(d, 3, hasReverseTrack(d)).x1)
            .attr('y1', d => offsetLine(d, 3, hasReverseTrack(d)).y1)
            .attr('x2', d => offsetLine(d, 3, hasReverseTrack(d)).x2)
            .attr('y2', d => offsetLine(d, 3, hasReverseTrack(d)).y2)
            .attr('stroke', d => d.status === 'operational' ? 'black' : 'red')
            .on("mouseover", function (event, d) {
                tooltip.style("display", "inline");
                tooltip.html(`Track: ${d.startStation.name} to ${d.endStation.name}<br>Status: ${d.status}<br>Is used: ${d.isBidirectional ? "in both directions" : "in set direction"}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                tooltip.style("display", "none");
            });

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

    updateTrackStatus(startName, endName, status, isBidirectional) {
        const track = this.findTrack(startName, endName);
        if (track) {
            track.setStatus(status);
            track.setBidirectional(isBidirectional);
        } else {
            throw new Error("Track does not exist");
        }

        // Additional logic for corresponding reverse track, if necessary
    }

    findTrack(startName, endName) {
        return this.tracks.find(track =>
            track.startStation.name === startName && track.endStation.name === endName);
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
network.connectBothWays("Central", "North Park");
network.connectBothWays("Central", "South Plaza");
network.connectBothWays("Central", "East Junction");
network.connectBothWays("Central", "West End");
network.connectBothWays("North Park", "East Junction");
network.connectOneWay("South Plaza", "West End");

// Set track status
network.setTrackStatus("Central", "North Park", "under repair");

network.updateTrackStatus("Central", "East Junction", "underMaintenance", true);


// Visualize the network
network.visualize('network');
