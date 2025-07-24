"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function EventManager() {
  // Fetch all events with registrations
  const { data: events, refetch } = api.event.list.useQuery();

  // State for event creation form
  const [eventForm, setEventForm] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    pay: "",
  });
  const createEvent = api.event.create.useMutation({
    onSuccess: () => {
      refetch();
      setEventForm({ name: "", date: "", time: "", location: "", pay: "" });
    },
  });

  // State for member registration
  const [registerName, setRegisterName] = useState("");
  const [registerEventId, setRegisterEventId] = useState<number | null>(null);
  const register = api.event.register.useMutation({
    onSuccess: () => {
      refetch();
      setRegisterName("");
      setRegisterEventId(null);
    },
  });
  const unregister = api.event.unregister.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      {/* Event Creation Form */}
      <form
        className="flex flex-col gap-2 rounded-xl bg-white/10 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          createEvent.mutate({
            name: eventForm.name,
            date: eventForm.date,
            time: eventForm.time,
            location: eventForm.location,
            pay: parseFloat(eventForm.pay),
          });
        }}
      >
        <h2 className="text-xl font-bold">Create New Event</h2>
        <input
          type="text"
          placeholder="Event Name"
          value={eventForm.name}
          onChange={(e) =>
            setEventForm((f) => ({ ...f, name: e.target.value }))
          }
          className="rounded px-2 py-1"
          required
        />
        <input
          type="date"
          value={eventForm.date}
          onChange={(e) =>
            setEventForm((f) => ({ ...f, date: e.target.value }))
          }
          className="rounded px-2 py-1"
          required
        />
        <input
          type="time"
          value={eventForm.time}
          onChange={(e) =>
            setEventForm((f) => ({ ...f, time: e.target.value }))
          }
          className="rounded px-2 py-1"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={eventForm.location}
          onChange={(e) =>
            setEventForm((f) => ({ ...f, location: e.target.value }))
          }
          className="rounded px-2 py-1"
          required
        />
        <input
          type="number"
          placeholder="Pay ($)"
          value={eventForm.pay}
          onChange={(e) => setEventForm((f) => ({ ...f, pay: e.target.value }))}
          className="rounded px-2 py-1"
          required
        />
        <button
          type="submit"
          className="mt-2 rounded bg-green-600 px-4 py-2 text-white"
          disabled={createEvent.isPending}
        >
          {createEvent.isPending ? "Creating..." : "Create Event"}
        </button>
      </form>

      {/* Event List and Registration */}
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Upcoming Events</h2>
        {events?.length === 0 && <p>No events yet.</p>}
        {events?.map((event) => (
          <div key={event.id} className="rounded-xl bg-white/10 p-4">
            <div className="mb-2">
              <span className="font-semibold">{event.name}</span> |{" "}
              {new Date(event.date).toLocaleDateString()} {event.time} |{" "}
              {event.location} | ${event.pay.toFixed(2)}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Registered Members:</span>
              <ul className="ml-6 list-disc">
                {event.registrations.map((reg: any) => (
                  <li key={reg.id} className="flex items-center gap-2">
                    {reg.memberName}
                    <button
                      className="text-xs text-red-500 hover:underline"
                      onClick={() =>
                        unregister.mutate({
                          eventId: event.id,
                          memberName: reg.memberName,
                        })
                      }
                      disabled={unregister.isPending}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <form
              className="mt-2 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                register.mutate({
                  eventId: event.id,
                  memberName: registerName,
                });
              }}
            >
              <input
                type="text"
                placeholder="Your Name"
                value={registerEventId === event.id ? registerName : ""}
                onFocus={() => setRegisterEventId(event.id)}
                onChange={(e) => {
                  setRegisterEventId(event.id);
                  setRegisterName(e.target.value);
                }}
                className="rounded px-2 py-1"
                required
              />
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-1 text-white"
                disabled={register.isPending || !registerName}
              >
                {register.isPending && registerEventId === event.id
                  ? "Registering..."
                  : "Register"}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
