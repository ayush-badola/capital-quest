import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SocketContext } from '../contexts/SocketContext';

const ScoreBoard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const socket = useContext(SocketContext);

  useEffect(() => {
  const fetchTeams = async () => {
    try {
      console.log('Fetching teams from API...');
      const res = await axios.get('/api/teams');
      console.log('API Response:', res.data);
      if (res.data?.success && Array.isArray(res.data.data)) {
         console.log('Received teams:', res.data.data);
        setTeams(res.data.data);
      } else {
        console.warn('Unexpected response format');
        throw new Error(res.data.error || 'Invalid data format');
      }
      
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err.response?.data || err.message);
    }
    finally {
      console.log('Loading complete');
      setLoading(false);
    }
  };

  const handleTeamsUpdate = (updatedTeams) => {
      const formatted = updatedTeams.map(team => ({
        _id: team._id,
        name: team.name,
        totalPoints: team.scores.reduce((sum, score) => sum + (score?.points || 0), 0)
      }));
      setTeams(formatted);
    };
  fetchTeams();
  
// if (socket) {
//       socket.on('teams-updated', (updatedTeams) => {
//         const formatted = updatedTeams.map(team => ({
//           _id: team._id,
//           name: team.name,
//           totalPoints: team.scores.reduce((sum, score) => sum + (score?.points || 0), 0)
//         }));
//         setTeams(formatted);
//       });
//     }
if (socket) {
        socket.off('teams-updated', handleTeamsUpdate);
      }
   return () => {
      if (socket) {
        socket.off('teams-updated', handleTeamsUpdate);
      }
    };
    // return () => {
    //   if (socket) socket.off('teams-updated');
    // };
  }, [socket]);

useEffect(() => {
  const handleTeamsUpdate = (teams) => {
    const formatted = teams.map(team => ({
      _id: team._id,
      name: team.name,
      totalPoints: team.scores.reduce((sum, score) => sum + (score?.points || 0), 0)
    }));
    setTeams(formatted);
  };

  socket.on('team-update', () => {
   // maybe re-fetch, or ask the server for all teams again:
   fetchTeams();
 });
  return () => socket.off('teams-updated', handleTeamsUpdate);
}, [socket]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-2xl text-purple-600">Loading scores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gray-100 p-8">
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Live Scores</h1>
        <div className="grid gap-4">
          {teams.length > 0 ? (
            teams.map((team) => (
              <div key={team._id} className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{team.name}</h3>
                  <span className="text-2xl font-bold text-purple-600">
                    {team.totalPoints?.toFixed(2) || 0} pts
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-xl">
              No teams found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;