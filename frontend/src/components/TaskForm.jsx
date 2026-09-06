import React, { useState } from 'react';
import axios from 'axios';

export default function TaskForm({ onAdded, api }) {
  const [name,setName]=useState(''); const [deadline,setDeadline]=useState('');
  const [effort,setEffort]=useState(2); const [priority,setPriority]=useState('medium'); const [saving,setSaving]=useState(false);

  async function addTask(e) {
    e.preventDefault(); if(!name || !deadline || Number(effort)<=0) return;
    setSaving(true);
    try { await axios.post(`${api}/tasks`,{name,deadline,effort:Number(effort),priority}); setName('');setDeadline('');setEffort(2);setPriority('medium');await onAdded(); }
    finally { setSaving(false); }
  }
  return <form className="form" onSubmit={addTask}>
    <label>Task name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Physics assignment" required/></label>
    <div className="form-grid"><label>Deadline<input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} required/></label><label>Effort (hours)<input type="number" min="0.5" step="0.5" value={effort} onChange={e=>setEffort(e.target.value)} required/></label></div>
    <label>Priority<select value={priority} onChange={e=>setPriority(e.target.value)}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
    <button className="primary full" disabled={saving}>{saving?'Adding...':'Add Task'}</button>
  </form>;
}
