import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../contexts/SocketContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const JudgeUI = () => {
  const [remainingPoints, setRemainingPoints] = useState(null);
const [hasScored, setHasScored] = useState(false);

  const [judges, setJudges] = useState([]);
const [selectedJudgeId, setSelectedJudgeId] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [points, setPoints] = useState('');
  const  socket  = useContext(SocketContext);

  useEffect(() => {
  const fetchJudgeDetails = async () => {
    if (!selectedJudgeId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/judges/${selectedJudgeId}`);
      const { maxPoints, assignedPoints } = res.data;
setRemainingPoints(maxPoints - assignedPoints);
    } catch (err) {
      console.error('Failed to fetch judge details');
    }
  };

  fetchJudgeDetails();
}, [selectedJudgeId, currentTeam]); // also refetch when team changes


useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/admin/current-team');
        setCurrentTeam(res.data);
      } catch (e) {
        console.error('Failed to load current team', e);
      }
    })();
  }, []);

  useEffect(() => {
  const fetchJudges = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/judges');
      setJudges(res.data);
    } catch (err) {
      toast.error('Error fetching judges');
    }
  };
  fetchJudges();
}, []);



  useEffect(() => {
    socket.on('team-update', (team) => {
      setCurrentTeam(team);
      setPoints('');
      setHasScored(false);
    });

    return () => socket.off('team-update');
  }, [socket]);

  // const submitScore = async () => {
  //   if (points && currentTeam) {
  //     await axios.post('/api/scores', {
  //       teamId: currentTeam._id,
  //       judgeId: selectedJudgeId,
  //       points: parseFloat(points)
  //     });
  //     toast.success('Score submitted!');
  //     setPoints('');
  //     socket.emit('refresh-teams');
  //   }
  // };

  const submitScore = async () => {
  const pts = parseFloat(points);
  if (!pts || !currentTeam || !selectedJudgeId) return;

  if (pts > remainingPoints) {
    toast.error('Not enough points remaining!');
    return;
  }

  try {
    await axios.post('/api/scores', {
      teamId: currentTeam._id,
      judgeId: selectedJudgeId,
      points: pts
    });

    toast.success('Score submitted!');
    setHasScored(true);
    setRemainingPoints(prev => prev - pts);
    setPoints('');
    socket.emit('refresh-teams');
  } catch (err) {
    toast.error('Failed to submit score');
  }
};


const handlePointsChange = (e) => {
  const val = e.target.value;
  if (val === '') {
    setPoints('');
    return;
  }
  const num = Number(val);
  if (num >= 0 && (remainingPoints === null || num <= remainingPoints)) {
    setPoints(val);
  }
};


  return (
<div className="min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-pink-600 flex flex-col items-center justify-center px-4 py-12">
  <ToastContainer
  position="top-center"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>

  {/* Judge Selection Card */}
  <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-md mb-10 text-center">
    <h2 className="text-3xl font-extrabold text-purple-700 mb-6 tracking-wide">Choose Your Identity</h2>
    <select
      className="w-full p-4 border-2 border-purple-400 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-transparent text-lg font-medium transition duration-300 ease-in-out cursor-pointer"
      value={selectedJudgeId || ''}
      onChange={(e) => setSelectedJudgeId(e.target.value)}
    >
      <option value="" disabled>
        Select a judge
      </option>
      {judges.map(j => (
        <option key={j._id} value={j._id}>
          👨‍⚖️ {j.name}
        </option>
      ))}
    </select>
  </div>

  {/* Scoring Card */}
  <div className="bg-white rounded-xl p-10 shadow-2xl w-full max-w-md text-center">
    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight min-h-[3rem]">
      {currentTeam?.name || 'Waiting for team...'}
    </h1>

    <input
      type="number"
      value={points}
      disabled={hasScored}
      // onChange={(e) => setPoints(e.target.value)}
      onChange={handlePointsChange}

      className={`w-full p-5 border-2 rounded-lg mb-6 text-center text-2xl font-semibold 
        border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-400 transition duration-300 ${
          hasScored ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`}
      placeholder="Enter points"
      min={0}
    />

    <button
      onClick={submitScore}
      disabled={
  hasScored || 
  !selectedJudgeId || 
  !points || 
  Number(points) <= 0 || 
  (remainingPoints !== null && Number(points) > remainingPoints)
}

      className={`w-full py-4 rounded-lg text-white font-bold text-xl transition-colors duration-300
        ${
          hasScored
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
        }`}
    >
      {hasScored ? 'Score Submitted' : 'Submit Score'}
    </button>

    {remainingPoints !== null && (
      <p className="mt-6 text-purple-700 text-lg font-semibold">
        Remaining Points: <span className="text-purple-900">{remainingPoints}</span>
      </p>
    )}
  </div>
</div>

  );
};

export default JudgeUI;