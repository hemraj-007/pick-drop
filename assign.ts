type Point = string;
type Trip = {
  pickups: Point[];
  drops: Point[];
  via?: Point; // Optional warehouse or via point
};

// Example data structure for the shipment
const shipment = {
  pickups: ['A', 'B'],
  drops: ['C', 'D']
};

// Function to validate the set of trips
function validateTrips(trips: Trip[], shipment: { pickups: Point[], drops: Point[] }): boolean {
  let pickupMap: Record<Point, boolean> = {};
  let dropMap: Record<Point, boolean> = {};

  // Initialize maps to track the completion of pickups and drops
  shipment.pickups.forEach(p => pickupMap[p] = false);
  shipment.drops.forEach(d => dropMap[d] = false);

  // Process each trip
  trips.forEach(trip => {
    trip.pickups.forEach(p => {
      if (shipment.pickups.includes(p)) {
        pickupMap[p] = true; // Mark as picked
      }
    });

    trip.drops.forEach(d => {
      if (shipment.drops.includes(d) && canDrop(trip, pickupMap)) {
        dropMap[d] = true; // Mark as dropped
      }
    });
  });

  // Check if all pickups and drops are completed
  return Object.values(pickupMap).every((v:any) => v) && Object.values(dropMap).every((v:any) => v);
}

// Helper function to determine if we can drop the item based on prior pickups
function canDrop(trip: Trip, pickupMap: Record<Point, boolean>): boolean {
  return trip.via ? true : trip.pickups.every(p => pickupMap[p]);
}

// Example trips
const validTrips: Trip[] = [
  { pickups: ['A'], drops: [], via: 'W' },
  { pickups: ['B'], drops: [], via: 'W' },
  { pickups: [], drops: ['C'], via: 'W' },
  { pickups: [], drops: ['D'], via: 'W' }
];

const invalidTrips: Trip[] = [
  { pickups: ['A'], drops: [], via: 'W1' },
  { pickups: ['B'], drops: [], via: 'W2' },
  { pickups: [], drops: ['C'], via: 'W3' },
  { pickups: [], drops: ['D'], via: 'W4' }
];

console.log("Valid Trips: ", validateTrips(validTrips, shipment)); // Should return true
console.log("Invalid Trips: ", validateTrips(invalidTrips, shipment)); // Should return false
