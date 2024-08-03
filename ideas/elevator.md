## Elevator System

Given a building with N elevators, determine which elevator should stop for a passenger calling from a specific floor. Consider factors such as proximity, current direction, and elevator status (idle, moving up, or moving down).

### Core Functionalities:

- Passenger Call: Receives a passenger call from a specific floor.
- Elevator Assignment: Assigns the closest suitable elevator to the passenger.
- Elevator Movement: Controls elevator movement based on passenger destinations and internal logic.

### Key Considerations:

- Elevator State: Track elevator position, direction, occupancy, and status (idle, moving up, moving down).
- Passenger Data: Maintain passenger information including start floor and destination floor.
- Assignment Algorithm: Implement a strategy to select the optimal elevator based on defined criteria (proximity, direction, occupancy).
- Performance Optimization: Consider performance implications for large buildings and high passenger traffic.

### Design Considerations

- **Elevator Model:**
  - `id`: Unique identifier for the elevator.
  - `currentFloor`: The floor the elevator is currently on.
  - `direction`: The current direction of the elevator (up, down, idle).
  - `status`: The current status of the elevator (idle, moving up, moving down).
  - `passengers`: A list of passengers currently in the elevator.
- **Passenger Model:**
  - `id`: Unique identifier for the passenger.
  - `startFloor`: The floor the passenger called the elevator from.
  - `destinationFloor`: The floor the passenger wants to go to.
- **Building Model:**
  - `numberOfFloors`: The total number of floors in the building.
  - `elevators`: A list of elevator objects.

### Algorithm

1. **Find Closest Elevators:**
   - Identify elevators closest to the passenger's floor.
2. **Prioritize Elevators:**
   - Prioritize elevators based on factors like:
     - Current direction (elevators moving towards the passenger's floor are preferred).
     - Number of passengers (elevators with fewer passengers are preferred).
     - Distance from the passenger's floor.
3. **Assign Passenger:**
   - Assign the passenger to the highest-priority elevator.
   - Update the elevator's passenger list and current direction if necessary.

### Initialization

- **Elevator Initialization:**
  - Create a list of elevator objects, each with initial values like `currentFloor` as the ground floor, `direction` as `idle`, and `status` as `idle`.
- **Passenger Generation (Bonus):**
  - Create a function to randomly generate passengers with random start and destination floors.
  - Use a timer or interval to simulate passenger calls every 5 seconds.
