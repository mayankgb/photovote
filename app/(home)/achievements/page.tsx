"use client"

import { getUserparticipation } from "@/app/actions/contest";
import { $Enums } from "@prisma/client";
import { useEffect, useState } from "react";

interface UserParticipation {
  contestId: string;
  contestName: string;
  status: $Enums.ContestStatus;
  endData: string;
  userRank: number | undefined;
}

export default function Achievements() {
  const [userData, setUserData] = useState<UserParticipation[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // Uncomment below for real data fetching
        const response = await getUserparticipation();
        if (response.status > 200 || !response.data) {
          setError("Failed to fetch data");
          return;
        }
        const newData: UserParticipation[] = response.data.map((d) => ({
          contestId: d.contest.id,
          contestName: d.contest.name,
          status: d.contest.status,
          endData: new Date(d.contest.endDate).toISOString().split("T")[0],
          userRank: d.rank
        }));
        
        // Using dummy data for testing
        // setUserData(dummyData);
        setUserData(newData)
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setError("An error occurred while fetching data");
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Function to render rank based on contest status
  const renderRank = (item: UserParticipation) => {
    if (item.status === "ENDED") {
      return item.userRank ? (
        <span className="font-medium text-blue-600">#{item.userRank}</span>
      ) : (
        <span className="text-gray-500">Not ranked</span>
      );
    } else {
      return <span className="text-gray-500 italic">Results pending</span>;
    }
  };

  // Function to render status with appropriate styling
  const renderStatus = (status: $Enums.ContestStatus) => {
    if (status === "ENDED") {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">ENDED</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Ongoing</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
        <p>Error: {error}</p>
        <p className="mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  if (userData.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900">No contests found</h3>
        <p className="mt-2 text-gray-500">You haven't participated in any contests yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h2 className="px-6 py-4 text-xl font-semibold text-gray-800 border-b">Your Contest Achievements</h2>
      
      {/* Desktop view */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contest Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Rank</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userData.map((item) => (
              <tr key={item.contestId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.contestName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.endData}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStatus(item.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {renderRank(item)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile view */}
      <div className="block md:hidden">
        <ul className="divide-y divide-gray-200">
          {userData.map((item) => (
            <li key={item.contestId} className="px-4 py-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-medium text-gray-900 pr-2">{item.contestName}</h3>
                {renderStatus(item.status)}
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>End Date: {item.endData}</span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">Your Rank:</span>
                <span>{renderRank(item)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}