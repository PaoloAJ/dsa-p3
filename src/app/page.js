"use client";

import React, { useState, useEffect, useRef } from "react";
import { MinHeap } from "./library/minHeap";
import { greedySchedule } from "./library/greedy";

function hasConflict(events, newEvent) {
  return events.some(
    (e) => newEvent.startTime < e.endTime && newEvent.endTime > e.startTime
  );
}

function Page() {
  const [events, setEvents] = useState([]); //all events
  const [optimal, setOptimal] = useState([]); //optimal schedule
  const [form, setForm] = useState({
    title: "",
    startTime: "",
    endTime: "",
    category: "school",
  });
  const [error, setError] = useState("");
  const heapRef = useRef(null);
  const [loading, setLoading] = useState(true);

  //random events from API
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      let arr = [];
      try {
        const res = await fetch("/api/import-csv");
        if (res.ok) {
          const data = await res.json();
          arr = data.events;
        } else {
          throw new Error("Failed to load CSV");
        }
      } catch (err) {
        setError("Failed to load events from CSV file.");
        setLoading(false);
        return;
      }
      //build MinHeap
      const heap = new MinHeap();
      arr.forEach((ev) => heap.insert(ev));
      heapRef.current = heap;
      setEvents([...arr]);
      setOptimal(greedySchedule(arr));
      setLoading(false);
    }
    fetchEvents();
  }, []);

  //event handler
  function handleAdd(e) {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      ...form,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      priority: new Date(form.startTime).getTime(),
    };
    if (newEvent.startTime >= newEvent.endTime) {
      setError("End time must be after start time");
      return;
    }
    if (hasConflict(events, newEvent)) {
      setError("Time conflict detected!");
      return;
    }
    heapRef.current.insert(newEvent);
    const updated = [...events, newEvent];
    setEvents(updated);
    setOptimal(greedySchedule(updated));
    setForm({ title: "", startTime: "", endTime: "", category: "school" });
    setError("");
  }

  //delete event handler
  function handleDelete(id) {
    //remove from events and rebuild heap
    const updated = events.filter((e) => e.id !== id);
    const heap = new MinHeap();
    updated.forEach((ev) => heap.insert(ev));
    heapRef.current = heap;
    setEvents(updated);
    setOptimal(greedySchedule(updated));
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Smart Scheduler</h1>
      <form onSubmit={handleAdd} className="mb-4 flex flex-col gap-2">
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <input
          required
          type="datetime-local"
          value={form.startTime}
          onChange={(e) =>
            setForm((f) => ({ ...f, startTime: e.target.value }))
          }
        />
        <input
          required
          type="datetime-local"
          value={form.endTime}
          onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
        />
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        >
          <option value="school">School</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Event
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
      {loading ? (
        <div className="text-center">Loading events...</div>
      ) : (
        <>
          <h2 className="font-semibold mb-2">
            Optimal (Non-Overlapping) Schedule
          </h2>
          <ul className="space-y-2">
            {optimal.map((ev) => (
              <li
                key={ev.id}
                className="border p-2 rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-bold">{ev.title}</div>
                  <div className="text-sm">
                    {new Date(ev.startTime).toLocaleString()} -{" "}
                    {new Date(ev.endTime).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{ev.category}</div>
                </div>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <h2 className="font-semibold mt-6 mb-2">
            All Events (MinHeap order)
          </h2>
          <ul className="space-y-2">
            {events
              .slice()
              .sort((a, b) => a.priority - b.priority)
              .map((ev) => (
                <li
                  key={ev.id}
                  className="border p-2 rounded flex justify-between items-center opacity-70"
                >
                  <div>
                    <div className="font-bold">{ev.title}</div>
                    <div className="text-sm">
                      {new Date(ev.startTime).toLocaleString()} -{" "}
                      {new Date(ev.endTime).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{ev.category}</div>
                  </div>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Page;
