import React,{useState} from 'react';
import axios from 'axios';

export default function AvailabilityForm({hours,onSaved,api}) {
  const [value,setValue]=useState(hours); const [saving,setSaving]=useState(false);
  async function save(e){e.preventDefault();setSaving(true);try{await axios.post(`${api}/availability`,{hours_per_day:Number(value)});await onSaved();}finally{setSaving(false);}}
  return <form className="form" onSubmit={save}><label>Available study hours / day<div className="range-row"><input type="range" min="0.5" max="12" step="0.5" value={value} onChange={e=>setValue(e.target.value)}/><strong>{value}h</strong></div></label><button className="primary full" disabled={saving}>{saving?'Saving...':'Save Capacity'}</button></form>;
}
