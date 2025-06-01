
import { useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const TestDataGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Function to generate test data
  const generateTestData = async () => {
    setIsLoading(true);
    try {
      // Generate daily readings
      const dailyReadings = generateDailyTestData();
      await set(ref(database, 'statistics/dailyReadings'), dailyReadings);
      
      // Generate weekly readings
      const weeklyReadings = generateWeeklyTestData();
      await set(ref(database, 'statistics/weeklyReadings'), weeklyReadings);
      
      // Generate waste type data
      const wasteTypeData = generateWasteTypeTestData();
      await set(ref(database, 'statistics/wasteTypes'), wasteTypeData);
      
      toast.success("Test data successfully generated!", {
        description: "Check the Statistics page to see the data."
      });
    } catch (error) {
      console.error("Error generating test data:", error);
      toast.error("Failed to generate test data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Tools</CardTitle>
        <CardDescription>
          Generate test data for development and testing purposes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This will populate your Firebase database with sample statistics data.
          Use this for testing the charts and real-time functionality.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={generateTestData} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Data...
            </>
          ) : "Generate Test Data"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper functions to generate test data
function generateDailyTestData() {
  const readings = {};
  const now = new Date();
  const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
  
  hours.forEach((hour, index) => {
    const timestamp = new Date(now).setHours(index * 4, 0, 0, 0);
    readings[`reading${index}`] = {
      time: hour,
      temperature: 18 + Math.random() * 2,
      waterQuality: 85 + Math.random() * 10,
      batteryLevel: 85 - (index * 5),
      batteryLevel2: index > 2 ? 87 - (index * 5) : undefined,
      batteryLevel3: index > 2 ? 88 - (index * 5) : undefined,
      wasteCollected: index * 2 + Math.random() * 2,
      timestamp
    };
  });
  
  return readings;
}

function generateWeeklyTestData() {
  const readings = {};
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  days.forEach((day, index) => {
    const timestamp = new Date().setDate(new Date().getDate() - (new Date().getDay() - index));
    readings[`day${index}`] = {
      day,
      temperature: 18 + Math.random() * 2,
      waterQuality: 88 + Math.random() * 5,
      wasteCollected: 10 + Math.random() * 6,
      timestamp
    };
  });
  
  return readings;
}

function generateWasteTypeTestData() {
  return {
    plastics: {
      name: 'Plastics',
      value: 45
    },
    metals: {
      name: 'Metals',
      value: 15
    },
    organics: {
      name: 'Organics',
      value: 25
    },
    other: {
      name: 'Other',
      value: 15
    }
  };
}

export default TestDataGenerator;
