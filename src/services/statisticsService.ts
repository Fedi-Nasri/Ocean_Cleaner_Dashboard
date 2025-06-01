
import { database } from "@/lib/firebase";
import { ref, onValue, get, query, orderByChild, limitToLast } from "firebase/database";

export interface SensorReading {
  time: string; // For daily data
  day?: string; // For weekly data
  temperature: number;
  waterQuality: number;
  batteryLevel: number;
  batteryLevel2?: number;
  batteryLevel3?: number;
  wasteCollected: number;
  timestamp: number;
}

export interface WasteTypeData {
  name: string;
  value: number;
}

// Listen to real-time daily sensor readings
export const listenToDailySensorData = (
  callback: (data: SensorReading[]) => void,
  onError: (error: Error) => void
): () => void => {
  const dailyReadingsRef = query(
    ref(database, 'statistics/dailyReadings'),
    orderByChild('timestamp'),
    limitToLast(24) // Last 24 hours of data
  );

  const unsubscribe = onValue(
    dailyReadingsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        // Convert Firebase object to array and sort by time
        const dataArray: SensorReading[] = Object.values(rawData);
        dataArray.sort((a, b) => {
          // Sort by timestamp to ensure chronological order
          return a.timestamp - b.timestamp;
        });
        callback(dataArray);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error("Error fetching daily sensor data:", error);
      onError(error);
    }
  );

  // Return unsubscribe function for cleanup
  return unsubscribe;
};

// Listen to real-time weekly sensor readings
export const listenToWeeklySensorData = (
  callback: (data: SensorReading[]) => void,
  onError: (error: Error) => void
): () => void => {
  const weeklyReadingsRef = query(
    ref(database, 'statistics/weeklyReadings'),
    orderByChild('timestamp')
  );

  const unsubscribe = onValue(
    weeklyReadingsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        // Convert Firebase object to array
        const dataArray: SensorReading[] = Object.values(rawData);
        // Sort by day of week (Monday first)
        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        dataArray.sort((a, b) => {
          return dayOrder.indexOf(a.day || '') - dayOrder.indexOf(b.day || '');
        });
        callback(dataArray);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error("Error fetching weekly sensor data:", error);
      onError(error);
    }
  );

  return unsubscribe;
};

// Listen to real-time waste type data
export const listenToWasteTypeData = (
  callback: (data: WasteTypeData[]) => void,
  onError: (error: Error) => void
): () => void => {
  const wasteTypeRef = ref(database, 'statistics/wasteTypes');

  const unsubscribe = onValue(
    wasteTypeRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        // Convert Firebase object to array
        const dataArray: WasteTypeData[] = Object.values(rawData);
        callback(dataArray);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error("Error fetching waste type data:", error);
      onError(error);
    }
  );

  return unsubscribe;
};

// Get historical data for a specific date range
export const getHistoricalData = async (
  startDate: Date,
  endDate: Date
): Promise<SensorReading[]> => {
  try {
    const historicalRef = ref(database, 'statistics/historicalData');
    const snapshot = await get(historicalRef);
    
    if (snapshot.exists()) {
      const allData = snapshot.val();
      const filteredData = Object.values(allData).filter((reading: any) => {
        const readingDate = new Date(reading.timestamp);
        return readingDate >= startDate && readingDate <= endDate;
      });
      
      return filteredData as SensorReading[];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
};

