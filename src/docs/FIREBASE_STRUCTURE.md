
# Firebase Database Structure for OceanClean Robot

This document outlines the structure of the Firebase Realtime Database used by the OceanClean Robot Monitoring System.

## Overview

The database is organized into several top-level nodes:

```
oceanclean-robot/
├── statistics/
│   ├── dailyReadings/
│   ├── weeklyReadings/
│   ├── historicalData/
│   ├── wasteTypes/
├── robotPosition/
├── maps/
├── users/
├── settings/
└── logs/
```

## Statistics Node

The `statistics` node contains all data related to the robot's sensor readings and waste collection data.

### Daily Readings

Path: `statistics/dailyReadings/`

Contains hourly readings for the current day. Each reading has a unique ID and contains:

```json
{
  "reading1": {
    "time": "00:00",
    "temperature": 18.2,
    "waterQuality": 91,
    "batteryLevel": 85,
    "batteryLevel2": 84,
    "batteryLevel3": 86,
    "wasteCollected": 0.2,
    "timestamp": 1716345600000
  },
  "reading2": {
    "time": "04:00",
    "temperature": 17.8,
    "waterQuality": 92,
    "batteryLevel": 82,
    "batteryLevel2": 81,
    "batteryLevel3": 83,
    "wasteCollected": 1.5,
    "timestamp": 1716360000000
  }
}
```

### Weekly Readings

Path: `statistics/weeklyReadings/`

Contains daily aggregated readings for the current week:

```json
{
  "day1": {
    "day": "Monday",
    "temperature": 18.5,
    "waterQuality": 90,
    "wasteCollected": 12.4,
    "timestamp": 1716259200000
  },
  "day2": {
    "day": "Tuesday",
    "temperature": 18.7,
    "waterQuality": 91,
    "wasteCollected": 13.1,
    "timestamp": 1716345600000
  }
}
```

### Historical Data

Path: `statistics/historicalData/`

Contains archived sensor data older than the current week, organized by year, month, and day:

```json
{
  "2024": {
    "05": {
      "15": {
        "temperature": {
          "avg": 18.9,
          "min": 17.5,
          "max": 20.3
        },
        "waterQuality": {
          "avg": 90.5,
          "min": 88.2,
          "max": 93.1
        },
        "wasteCollected": 15.7,
        "batteryUsage": 55
      }
    }
  }
}
```

### Waste Types

Path: `statistics/wasteTypes/`

Contains data about the types of waste collected:

```json
{
  "plastics": {
    "name": "Plastics",
    "value": 45
  },
  "metals": {
    "name": "Metals",
    "value": 15
  },
  "organics": {
    "name": "Organics",
    "value": 25
  },
  "other": {
    "name": "Other",
    "value": 15
  }
}
```

## Robot Position

Path: `robotPosition`

Stores the current GPS position of the robot:

```json
{
  "lat": 37.7749,
  "lng": -122.4194,
  "heading": 45,
  "timestamp": 1716371234567
}
```

## Maps

Path: `maps/`

Contains map data including cleaning areas and routes:

```json
{
  "map1": {
    "id": "map1",
    "name": "Harbor Bay",
    "areas": [
      {
        "id": "area1",
        "name": "North Dock",
        "coordinates": [[37.7749, -122.4194], [37.7750, -122.4195], [37.7752, -122.4192]],
        "createdAt": 1716259200000
      }
    ],
    "createdAt": 1716259200000
  }
}
```

## Users

Path: `users/`

Stores user data and authentication information:

```json
{
  "user123": {
    "username": "admin",
    "role": "admin",
    "lastLogin": 1716371234567
  },
  "user456": {
    "username": "operator",
    "role": "user",
    "lastLogin": 1716371234567
  }
}
```

## Best Practices for Working with Firebase Realtime Database

1. **Use listeners for real-time data:**
   ```javascript
   const unsubscribe = onValue(ref(database, 'statistics/dailyReadings'), (snapshot) => {
     if (snapshot.exists()) {
       // Process data
     }
   });
   
   // Remember to unsubscribe when component unmounts
   return () => unsubscribe();
   ```

2. **Use query methods for filtering large datasets:**
   ```javascript
   const recentReadingsQuery = query(
     ref(database, 'statistics/dailyReadings'),
     orderByChild('timestamp'),
     limitToLast(24)
   );
   ```

3. **Data indexing:** For better performance, set up indexing rules in Firebase console for frequently queried paths.

4. **Atomic updates:** When updating multiple related fields, use multi-location updates:
   ```javascript
   const updates = {};
   updates['statistics/dailyReadings/reading1/temperature'] = 19.2;
   updates['statistics/dailyReadings/reading1/timestamp'] = Date.now();
   update(ref(database), updates);
   ```

5. **Keep data flat:** Avoid deeply nested structures that can be difficult to query efficiently.
