import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'discipline-os-data-v2';
const TODAY = new Date().toISOString().slice(0, 10);

const DEFAULT_STATE = {
  habits: [
    { id: 'wake', name: 'Wake Up On Time', xp: 20, completed: false },
    { id: 'focus', name: '90 Minutes Deep Work', xp: 35, completed: false },
    { id: 'workout', name: 'Workout Session', xp: 30, completed: false },
  ],
  streak: 3,
  streakHistory: [1, 2, 2, 3, 3, 4, 3],
  lastCompletedDate: '',
  workoutLog: {
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  },
  events: [
    { id: '1', title: 'Morning routine', date: TODAY, time: '05:45' },
    { id: '2', title: 'Deep work sprint', date: TODAY, time: '08:00' },
  ],
};

function loadSavedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export default function DisciplineOS() {
  const saved = loadSavedData();
  const [habits, setHabits] = useState(saved.habits);
  const [streak, setStreak] = useState(saved.streak);
  const [streakHistory, setStreakHistory] = useState(saved.streakHistory);
  const [lastCompletedDate, setLastCompletedDate] = useState(saved.lastCompletedDate);
  const [workoutLog, setWorkoutLog] = useState(saved.workoutLog);
  const [events, setEvents] = useState(saved.events);
  const [newHabit, setNewHabit] = useState('');
  const [eventDraft, setEventDraft] = useState({ title: '', date: TODAY, time: '09:00' });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ habits, streak, streakHistory, lastCompletedDate, workoutLog, events })
    );
  }, [habits, streak, streakHistory, lastCompletedDate, workoutLog, events]);

  const completedXP = useMemo(() => habits.filter((h) => h.completed).reduce((a, h) => a + h.xp, 0), [habits]);
  const completedCount = habits.filter((h) => h.completed).length;
  const progress = Math.min((completedXP / 120) * 100, 100);
  const level = Math.floor(completedXP / 100) + 1;
  const weeklyWorkouts = Object.values(workoutLog).filter(Boolean).length;

  const sortedEvents = [...events].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  function toggleHabit(id) {
    setHabits((prev) => prev.map((habit) => (habit.id === id ? { ...habit, completed: !habit.completed } : habit)));
  }

  function addHabit() {
    if (!newHabit.trim()) return;
    setHabits((prev) => [...prev, { id: Date.now().toString(), name: newHabit.trim(), xp: 20, completed: false }]);
    setNewHabit('');
  }

  function completeDay() {
    if (lastCompletedDate === TODAY) return;
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setLastCompletedDate(TODAY);
    setStreakHistory((prev) => [...prev.slice(-6), nextStreak]);
  }

  function toggleWorkout(day) {
    setWorkoutLog((prev) => ({ ...prev, [day]: !prev[day] }));
  }

  function addEvent() {
    if (!eventDraft.title.trim()) return;
    setEvents((prev) => [...prev, { ...eventDraft, id: Date.now().toString() }]);
    setEventDraft({ title: '', date: TODAY, time: '09:00' });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-3 py-4 sm:p-6">
      <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
        <header className="premium-card animate-card p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Discipline OS Pro</h1>
              <p className="text-zinc-300 text-sm sm:text-base">Premium focus system for consistency, training, and output.</p>
            </div>
            <div className="rounded-2xl bg-lime-400 text-black px-4 py-2 font-bold text-xl self-start">Lv {level}</div>
          </div>
          <div className="mt-5">
            <div className="flex justify-between text-sm mb-2"><span>Daily XP</span><span>{completedXP}/120</span></div>
            <div className="h-3 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-lime-300 to-emerald-500 transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <article className="premium-card animate-card p-4 sm:p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">Calendar</h2><span className="text-zinc-400 text-sm">{sortedEvents.length} events</span></div>
            <div className="space-y-2 max-h-48 overflow-auto pr-1">
              {sortedEvents.map((event) => (
                <div key={event.id} className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-3 flex justify-between text-sm">
                  <span>{event.title}</span><span className="text-zinc-400">{event.date} · {event.time}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-4">
              <input className="field sm:col-span-2" placeholder="Event" value={eventDraft.title} onChange={(e) => setEventDraft((p) => ({ ...p, title: e.target.value }))} />
              <input className="field" type="date" value={eventDraft.date} onChange={(e) => setEventDraft((p) => ({ ...p, date: e.target.value }))} />
              <div className="flex gap-2"><input className="field" type="time" value={eventDraft.time} onChange={(e) => setEventDraft((p) => ({ ...p, time: e.target.value }))} /><button onClick={addEvent} className="btn">Add</button></div>
            </div>
          </article>

          <article className="premium-card animate-card p-4 sm:p-5">
            <h2 className="text-xl font-semibold mb-3">Streak Analytics</h2>
            <div className="text-4xl font-bold text-lime-300">{streak} days</div>
            <p className="text-zinc-400 text-sm">Current streak</p>
            <div className="mt-4 flex items-end gap-2 h-20">
              {streakHistory.map((v, i) => <div key={`${v}-${i}`} className="flex-1 rounded-t bg-emerald-500/70" style={{ height: `${Math.max(15, v * 12)}px` }} />)}
            </div>
            <button className="btn w-full mt-4" onClick={completeDay}>Mark Day Complete</button>
          </article>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <article className="premium-card animate-card p-4 sm:p-5">
            <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Habits</h2><span className="text-zinc-400 text-sm">{completedCount} done</span></div>
            <div className="space-y-2 mt-4">
              {habits.map((habit) => (
                <button key={habit.id} onClick={() => toggleHabit(habit.id)} className={`w-full rounded-2xl p-3 border flex items-center justify-between ${habit.completed ? 'border-emerald-400 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-900/70'}`}>
                  <span>{habit.name}</span><span className="text-xs text-zinc-400">+{habit.xp} XP</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-4"><input className="field" placeholder="Add habit" value={newHabit} onChange={(e) => setNewHabit(e.target.value)} /><button className="btn" onClick={addHabit}>Add</button></div>
          </article>

          <article className="premium-card animate-card p-4 sm:p-5">
            <h2 className="text-xl font-semibold">Workout Tracker</h2>
            <p className="text-zinc-400 text-sm">{weeklyWorkouts}/7 sessions complete this week</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
              {Object.keys(workoutLog).map((day) => (
                <button key={day} onClick={() => toggleWorkout(day)} className={`rounded-xl p-3 border text-sm ${workoutLog[day] ? 'bg-lime-400 text-black border-lime-300' : 'bg-zinc-900/70 border-zinc-700'}`}>
                  {day.slice(0, 3)} {workoutLog[day] ? '✓' : ''}
                </button>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
