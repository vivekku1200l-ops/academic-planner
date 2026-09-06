const DAY_MS = 24 * 60 * 60 * 1000;

function daysUntil(dateStr) {
  const deadline = new Date(`${dateStr}T23:59:59`);
  return Math.max(1, Math.ceil((deadline - new Date()) / DAY_MS));
}

function priorityWeight(priority) {
  return priority === 'high' ? 3 : priority === 'medium' ? 2 : 1;
}

function computeScore(task) {
  const urgency = priorityWeight(task.priority) / daysUntil(task.deadline);
  const workload = Math.min(1, Number(task.remaining) / Math.max(1, Number(task.effort)));
  return urgency + workload * 0.15;
}

function generateSchedule(tasks, hoursPerDay = 2, horizonDays = 14) {
  const work = tasks
    .filter(t => Number(t.remaining) > 0)
    .map(t => ({ ...t, remaining: Number(t.remaining), deadline: String(t.deadline).slice(0,10) }));

  const schedule = [];

  for (let d = 0; d < horizonDays; d++) {
    const date = new Date();
    date.setHours(0,0,0,0);
    date.setDate(date.getDate() + d);

    let available = Number(hoursPerDay);
    const candidates = work
      .filter(t => t.remaining > 0 && new Date(`${t.deadline}T23:59:59`) >= date)
      .sort((a,b) => computeScore(b) - computeScore(a));

    const allocations = [];
    for (const task of candidates) {
      if (available <= 0) break;
      const hours = Math.min(available, task.remaining);
      task.remaining -= hours;
      available -= hours;
      allocations.push({
        taskId: task.id,
        name: task.name,
        hours: Number(hours.toFixed(2)),
        priority: task.priority
      });
    }

    schedule.push({
      date: date.toISOString().slice(0,10),
      allocations,
      totalHours: Number((Number(hoursPerDay) - available).toFixed(2))
    });
  }

  return {
    schedule,
    unscheduled: work
      .filter(t => t.remaining > 0)
      .map(t => ({ name: t.name, remaining: Number(t.remaining.toFixed(2)), deadline: t.deadline }))
  };
}

module.exports = { generateSchedule };
