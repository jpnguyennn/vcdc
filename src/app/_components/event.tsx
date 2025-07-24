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

  const deleteEvent = api.event.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const updateEvent = api.event.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingEventId(null);
    },
  });
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    pay: "",
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-2 sm:px-0">
      {/* Event Creation Form */}
      <form
        className="flex flex-col gap-2 rounded-xl bg-white/10 p-4 shadow-md"
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
        <h2 className="mb-2 text-xl font-bold">Create New Event</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <input
            type="text"
            placeholder="Event Name"
            value={eventForm.name}
            onChange={(e) =>
              setEventForm((f) => ({ ...f, name: e.target.value }))
            }
            className="min-w-0 flex-1 rounded px-2 py-2"
            required
          />
          <input
            type="date"
            value={eventForm.date}
            onChange={(e) =>
              setEventForm((f) => ({ ...f, date: e.target.value }))
            }
            className="min-w-0 flex-1 rounded px-2 py-2"
            required
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <input
            type="time"
            value={eventForm.time}
            onChange={(e) =>
              setEventForm((f) => ({ ...f, time: e.target.value }))
            }
            className="min-w-0 flex-1 rounded px-2 py-2"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={eventForm.location}
            onChange={(e) =>
              setEventForm((f) => ({ ...f, location: e.target.value }))
            }
            className="min-w-0 flex-1 rounded px-2 py-2"
            required
          />
        </div>
        <input
          type="number"
          placeholder="Pay ($)"
          value={eventForm.pay}
          onChange={(e) => setEventForm((f) => ({ ...f, pay: e.target.value }))}
          className="w-full rounded px-2 py-2 sm:w-1/2"
          required
        />
        <button
          type="submit"
          className="mt-2 rounded bg-green-600 px-4 py-3 text-base font-semibold text-white transition active:scale-95"
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
          <div
            key={event.id}
            className="overflow-x-auto rounded-xl bg-white/10 p-4 shadow-md"
          >
            {editingEventId === event.id ? (
              <form
                className="mb-2 flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateEvent.mutate({
                    eventId: event.id,
                    name: editForm.name,
                    date: editForm.date,
                    time: editForm.time,
                    location: editForm.location,
                    pay: parseFloat(editForm.pay),
                  });
                }}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <input
                    type="text"
                    placeholder="Event Name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="min-w-0 flex-1 rounded px-2 py-2"
                    required
                  />
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, date: e.target.value }))
                    }
                    className="min-w-0 flex-1 rounded px-2 py-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <input
                    type="time"
                    value={editForm.time}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, time: e.target.value }))
                    }
                    className="min-w-0 flex-1 rounded px-2 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, location: e.target.value }))
                    }
                    className="min-w-0 flex-1 rounded px-2 py-2"
                    required
                  />
                </div>
                <input
                  type="number"
                  placeholder="Pay ($)"
                  value={editForm.pay}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, pay: e.target.value }))
                  }
                  className="w-full rounded px-2 py-2 sm:w-1/2"
                  required
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-base font-semibold text-white transition active:scale-95"
                    disabled={updateEvent.isPending}
                  >
                    {updateEvent.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="rounded bg-gray-400 px-4 py-2 text-base font-semibold text-white transition active:scale-95"
                    onClick={() => setEditingEventId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="block overflow-x-auto text-base font-semibold whitespace-nowrap">
                  {event.name} | {new Date(event.date).toLocaleDateString()}{" "}
                  {event.time} | {event.location} | ${event.pay.toFixed(2)}
                </span>
                <div className="mt-2 flex gap-2 sm:mt-0">
                  <button
                    className="rounded border border-blue-600 px-2 py-1 text-xs text-blue-600 transition hover:underline active:scale-95"
                    onClick={() => {
                      setEditingEventId(event.id);
                      setEditForm({
                        name: event.name,
                        date: (typeof event.date === "string"
                          ? event.date
                          : new Date(event.date).toISOString()
                        ).slice(0, 10),
                        time: event.time,
                        location: event.location,
                        pay: event.pay.toString(),
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="ml-0 rounded border border-red-600 px-2 py-1 text-xs text-red-600 transition hover:underline active:scale-95 sm:ml-2"
                    onClick={() => deleteEvent.mutate({ eventId: event.id })}
                    disabled={deleteEvent.isPending}
                  >
                    {deleteEvent.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
            <div className="mb-2">
              <span className="font-semibold">Registered Members:</span>
              <ul className="ml-6 list-disc">
                {event.registrations.map((reg: any) => (
                  <li key={reg.id} className="flex items-center gap-2 text-sm">
                    {reg.memberName}
                    <button
                      className="rounded px-1 py-0.5 text-xs text-red-500 transition hover:underline active:scale-95"
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
              className="mt-2 flex flex-col gap-2 sm:flex-row"
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
                className="min-w-0 flex-1 rounded px-2 py-2"
                required
              />
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-base font-semibold text-white transition active:scale-95"
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
