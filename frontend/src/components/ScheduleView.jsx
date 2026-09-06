import React from 'react';
function prettyDate(date){return new Date(`${date}T12:00:00`).toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});}
export default function ScheduleView({schedule}) {
  const days=schedule.schedule.filter(d=>d.allocations.length);
  return <div>{days.length?<div className="schedule-grid">{days.map(day=><article className="day-card" key={day.date}><div className="day-header"><strong>{prettyDate(day.date)}</strong><span>{day.totalHours}h planned</span></div>{day.allocations.map((x,i)=><div className="allocation" key={`${day.date}-${x.taskId}-${i}`}><div><strong>{x.name}</strong><span className={`mini ${x.priority}`}>{x.priority}</span></div><b>{x.hours}h</b></div>)}</article>)}</div>:<div className="empty">No schedule could be generated.</div>}{schedule.unscheduled?.length>0&&<div className="warning"><strong>⚠ Work that does not fit:</strong> {schedule.unscheduled.map(x=>`${x.name} (${x.remaining}h)`).join(', ')}</div>}</div>;
}
