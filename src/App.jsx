import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'discipline-os-data-v1';

const DEFAULT_HABITS = [
  {
    id: 'wake',
    name: 'Wake Up On Time',
    xp: 20,
    completed: false,
  },
  {
    id: 'phone',
    name: 'No Phone At Night',
    xp: 15,
    completed: false,
  },
  {
    id: 'exercise',
    name: 'Exercise',
    xp: 30,
    completed: false,
  },
  {
    id: 'pins',
    name: 'Create 3 Pins',
    xp: 25,
    completed: false,
  },
  {
    id: 'blog',
    name: 'Blog Deep Work',
    xp: 50,
    completed: false,
  },
];

function loadSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return {
        habits: DEFAULT_HABITS,
        streak: 0,
      };
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to load local data', error);

    return {
      habits: DEFAULT_HABITS,
      streak: 0,
    };
  }
}

export default function DisciplineOS() {
  const savedData = loadSavedData();

  const [habits, setHabits] = useState(savedData.habits);
  const [streak, setStreak] = useState(savedData.streak);
  const [newHabit, setNewHabit] = useState('');
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(1500);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        habits,
        streak,
      })
    );
  }, [habits, streak]);

  useEffect(() => {
    let interval = null;

    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerRunning(false);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerRunning]);

  const completedXP = useMemo(() => {
    return habits
      .filter((habit) => habit.completed)
      .reduce((sum, habit) => sum + habit.xp, 0);
  }, [habits]);

  const level = Math.floor(completedXP / 100) + 1;
  const progress = Math.min((completedXP / 140) * 100, 100);

  const completedHabits = habits.filter((habit) => habit.completed).length;

  function toggleHabit(id) {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          return {
            ...habit,
            completed: !habit.completed,
          };
        }

        return habit;
      })
    );
  }

  function addHabit() {
    if (!newHabit.trim()) {
      return;
    }

    const item = {
      id: Date.now().toString(),
      name: newHabit,
      xp: 15,
      completed: false,
    };

    setHabits((prev) => [...prev, item]);
    setNewHabit('');
  }

  function resetDay() {
    setHabits((prev) =>
      prev.map((habit) => ({
        ...habit,
        completed: false,
      }))
    );
  }

  function increaseStreak() {
    setStreak((prev) => prev + 1);
  }

  function formatTime(value) {
    const mins = Math.floor(value / 60);
    const secs = value % 60;

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function installInstructions() {
    alert(
      'To install: Open Chrome menu (⋮) → Add to Home Screen or Install App.'
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 flex justify-center">
      <div className="w-full max-w-md space-y-5">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Discipline OS</h1>
              <p className="text-zinc-400 text-sm mt-1">
                Build consistency daily.
              </p>
            </div>

            <div className="bg-lime-400 text-black px-4 py-2 rounded-2xl font-bold text-lg">
              Lv {level}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-2">
            <span>Daily XP</span>
            <span>{completedXP}/140</span>
          </div>

          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-5">
            <button
              onClick={installInstructions}
              className="w-full bg-lime-400 text-black py-4 rounded-2xl font-bold text-lg"
            >
              Install On Phone
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-zinc-800 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold">{streak}</div>
              <div className="text-xs text-zinc-400 mt-1">
                Wake Streak
              </div>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold">{completedHabits}</div>
              <div className="text-xs text-zinc-400 mt-1">
                Habits Done
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-lime-500/10 to-emerald-500/5 border border-lime-500/20 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Morning Activation</h2>
              <p className="text-zinc-400 text-sm">5:45 AM Routine</p>
            </div>

            <button
              onClick={increaseStreak}
              className="bg-lime-400 text-black px-4 py-2 rounded-xl text-sm font-bold"
            >
              +1 Streak
            </button>
          </div>

          <div className="space-y-3">
            {[
              'Place alarm far away',
              'Stand up immediately',
              'Wash face',
              'Drink water',
              'Start movement',
            ].map((step, index) => (
              <div
                key={step}
                className="bg-zinc-900/80 rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-lime-400 text-black flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>

                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Daily Habits</h2>

            <button
              onClick={resetDay}
              className="bg-zinc-800 px-3 py-2 rounded-xl text-sm"
            >
              Reset
            </button>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`w-full rounded-2xl p-4 flex items-center justify-between border transition-all duration-300 ${
                  habit.completed
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-zinc-800 border-zinc-700'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">{habit.name}</div>

                  <div className="text-xs text-zinc-400 mt-1">
                    +{habit.xp} XP
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full border-2 ${
                    habit.completed
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-zinc-500'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Add custom habit"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none"
            />

            <button
              onClick={addHabit}
              className="bg-lime-400 text-black px-5 rounded-2xl font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold">Focus Timer</h2>

              <p className="text-zinc-400 text-sm">
                Blog Deep Work Session
              </p>
            </div>
          </div>

          <div className="bg-zinc-800 rounded-3xl p-6 text-center">
            <div className="text-6xl font-bold tracking-wide mb-6">
              {formatTime(seconds)}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setTimerRunning((prev) => !prev)}
                className="bg-lime-400 text-black px-6 py-3 rounded-2xl font-bold"
              >
                {timerRunning ? 'Pause' : 'Start'}
              </button>

              <button
                onClick={() => {
                  setTimerRunning(false);
                  setSeconds(1500);
                }}
                className="bg-zinc-700 px-6 py-3 rounded-2xl"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-10">
          <h2 className="text-xl font-semibold mb-4">Workout Split</h2>

          <div className="space-y-3">
            {[
              {
                day: 'Monday',
                type: 'Push',
              },
              {
                day: 'Tuesday',
                type: 'Pull',
              },
              {
                day: 'Wednesday',
                type: 'Legs',
              },
              {
                day: 'Friday',
                type: 'Full Body',
              },
            ].map((item) => (
              <div
                key={item.day}
                className="bg-zinc-800 rounded-2xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{item.day}</div>

                  <div className="text-sm text-zinc-400 mt-1">
                    {item.type}
                  </div>
                </div>

                <button className="bg-zinc-700 px-4 py-2 rounded-xl text-sm">
                  Track
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
