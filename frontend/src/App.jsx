import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Brain, CalendarDays, Clock3, ListTodo, RefreshCw, Sparkles, Trash2 } from 'lucide-react';
import TaskForm from './components/TaskForm';
import AvailabilityForm from './components/AvailabilityForm';
import ScheduleView from './components/ScheduleView';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [availability, setAvailability] = useState(2);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadTasks() { setTasks((await axios.get(`${API}/tasks`)).data); }
  async function loadAvailability() { setAvailability((await axios.get(`${API}/availability`)).data.hours_per_day); }

  async function refreshSchedule() {
    setLoading(true); setError('');
    try { setSchedule((await axios.get(`${API}/schedule`)).data); }
    catch { setError('Cannot connect to the planner backend.'); }
    finally { setLoading(false); }
  }

  async function loadAll() {
    try { await Promise.all([loadTasks(), loadAvailability()]); await refreshSchedule(); }
    catch { setError('Cannot connect to the planner backend.'); }
  }

  async function deleteTask(id) { await axios.delete(`${API}/tasks/${id}`); await loadAll(); }
  useEffect(() => { loadAll(); }, []);

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-icon"><Brain size={30} /></div>
        <div>
          <p className="eyebrow">SMART INDIA HACKATHON • PROTOTYPE</p>
          <h1>Intelligent Academic Planner</h1>
          <p className="subtitle">Smart scheduling based on deadlines, priority and available study time.</p>
        </div>
      </header>
      {error && <div className="error">{error}</div>}

      <section className="stats">
        <div className="stat-card"><ListTodo/><div><span>Tasks</span><strong>{tasks.length}</strong></div></div>
        <div className="stat-card"><Clock3/><div><span>Daily capacity</span><strong>{availability}h</strong></div></div>
        <div className="stat-card"><CalendarDays/><div><span>Planning horizon</span><strong>14 days</strong></div></div>
      </section>

      <main className="grid">
        <section className="panel"><div className="panel-title"><div><h2>Add Task</h2><p>Tell the planner what you need to finish.</p></div></div><TaskForm onAdded={loadAll} api={API}/></section>
        <section className="panel"><div className="panel-title"><div><h2>Study Capacity</h2><p>Set realistic hours available each day.</p></div></div><AvailabilityForm hours={availability} onSaved={loadAll} api={API}/></section>
      </main>

      <section className="panel task-panel">
        <div className="panel-title"><div><h2>Your Tasks</h2><p>{tasks.length ? 'Current workload' : 'No tasks yet.'}</p></div>
          <button className="secondary" onClick={refreshSchedule} disabled={loading}><RefreshCw size={16}/> Refresh</button>
        </div>
        <div className="task-list">
          {tasks.map(task => <div className="task-row" key={task.id}>
            <div><strong>{task.name}</strong><span>Deadline: {task.deadline} • {task.effort}h effort</span></div>
            <div className="task-actions"><span className={`badge ${task.priority}`}>{task.priority}</span><button className="icon-btn" onClick={()=>deleteTask(task.id)}><Trash2 size={17}/></button></div>
          </div>)}
        </div>
      </section>

      <section className="panel schedule-panel">
        <div className="panel-title"><div><div className="title-with-icon"><Sparkles size={20}/><h2>Intelligent Schedule</h2></div><p>Urgency + priority determine the allocation.</p></div>
          <button className="primary" onClick={refreshSchedule} disabled={loading}><Sparkles size={16}/> Generate Schedule</button>
        </div>
        {schedule && <ScheduleView schedule={schedule}/>}
      </section>
      <footer>Academic Planner • Smart India Hackathon Prototype</footer>
    </div>
  );
}
