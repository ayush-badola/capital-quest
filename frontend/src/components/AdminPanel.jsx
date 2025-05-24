
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { SocketContext } from '../contexts/SocketContext';
import { ArrowRightIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const AdminPanel = () => {
  const [name, setName] = useState('');
  const [points, setPoints] = useState('');
  const [newTeam, setNewTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const  socket  = useContext(SocketContext);

  // Fetch teams on mount
  useEffect(() => {
    const init = async () => {
    const [teamsRes, curRes] = await Promise.all([
      axios.get('/api/teams'),
      axios.get('/api/admin/current-team'),
    ]);
    const all = teamsRes.data.data;
    setTeams(all);
    const idx = all.findIndex(t => t._id === curRes.data._id);
    setCurrentTeamIndex(idx !== -1 ? idx : 0);
  };
  init();
    const fetchTeams = async () => {
      try {
        const res = await axios.get('/api/teams');
        setTeams(res.data.data);
      } catch (err) {
        toast.error('Failed to load teams');
      }
    };
    fetchTeams();
  }, []);

  const handleAddTeam = async () => {
    if (!newTeam.trim()) return;
    
    try {
      setIsLoading(true);
      const { data } = await axios.post('/api/teams', { name: newTeam });
      setTeams([...teams, data]);
      setNewTeam('');
      toast.success('Team added successfully!');
      socket.emit('refresh-teams');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add team');
    } finally {
      setIsLoading(false);
    }
  };

  const nextTeam = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post('/api/admin/next-team');
      // setCurrentTeamIndex(prev => (prev + 1) % teams.length);
      const idx = teams.findIndex(t => t._id === data._id);
    if (idx !== -1) setCurrentTeamIndex(idx);
      toast.success(`Now presenting: ${data.name}`);
      socket.emit('team-update', data);
      setTeams(ts =>
  ts.map(t => t._id === data._id ? data : t)
);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to switch teams');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeam = async (teamId) => {
    try {
      await axios.delete(`/api/teams/${teamId}`);
      setTeams(teams.filter(t => t._id !== teamId));
      toast.success('Team deleted successfully');
      socket.emit('refresh-teams');
    } catch (err) {
      toast.error('Failed to delete team');
    }
  };
  


  const addJudge = async () => {
    try {
      // await axios.post('http://localhost:5000/api/judges', {
      await axios.post(`${process.env.VITE_API_URL}/api/judges`, {

        name,
        totalPoints: parseInt(points),
      });
      alert('Judge added!');
      setName('');
      setPoints('');
    } catch (err) {
      alert('Error adding judge');
    }
  };
  

  return (
    
    
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Add Judge</h2>
      <input
        type="text"
        placeholder="Judge Name"
        className="w-full p-3 mb-3 border-2 border-purple-300 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Points"
        className="w-full p-3 mb-3 border-2 border-purple-300 rounded"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
      />
      <button
        onClick={addJudge}
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
      >
        Add Judge
      </button>
    </div>






      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Competition Control Panel
          </h1>
          <p className="text-gray-400">Currently presenting: {teams[currentTeamIndex]?.name || 'None'}</p>
        </div>

        {/* Team Management Card */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Team Management
              </span>
            </h2>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <input
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                  className="w-64 px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 outline-none transition-all"
                  placeholder="Enter team name"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTeam()}
                />
              </div>
              <button
                onClick={handleAddTeam}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="w-5 h-5 inline-block mr-2" />
                Add Team
              </button>
            </div>
          </div>

          {/* Team List */}
          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team._id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <span className="text-white font-medium">{team.name}</span>
                <button
                  onClick={() => deleteTeam(team._id)}
                  className="p-2 text-red-400 hover:text-red-300 rounded-md hover:bg-red-900/20 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Competition Controls */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stage Controls
              </span>
            </h2>
            <button
              onClick={nextTeam}
              disabled={isLoading || teams.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightIcon className="w-6 h-6 inline-block mr-2" />
              Next Presenting Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;