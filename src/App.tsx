import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

interface Event {
    id: number;
    date: string;
    description: string;
}

const App: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [date, setDate] = useState<Date | null>(null);
    const [description, setDescription] = useState<string>('');

    // LocalStorage-dan qaydlarni yuklash
    useEffect(() => {
        const storedEvents = localStorage.getItem('events');
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents)); // LocalStorage-dan ma'lumotlarni yuklash
        }
    }, []);

    // Qaydlar o'zgarganda LocalStorage-ga saqlash
    useEffect(() => {
        localStorage.setItem('events', JSON.stringify(events)); // Ma'lumotlarni LocalStorage-ga saqlash
    }, [events]);

    const addEvent = () => {
        if (date && events.filter(event => event.date === date.toLocaleDateString('en-CA')).length < 3) {
            const newEvent: Event = {
                id: events.length + 1,
                date: date.toLocaleDateString('en-CA'),
                description,
            };
            setEvents([...events, newEvent]); // Yangi qaydni qo'shish
            setDescription('');
        } else {
            alert('Bu sana uchun 3 tadan ko\'p qayd qo\'shib bo\'lmaydi.');
        }
    };

    return (
        <div className="app-container">
            <div className="card">
                <h1 className="card-title">Kalendar</h1>
                <div className="calendar-container">
                    <Calendar
                        className="calendar"
                        onChange={(value) => {
                            if (value instanceof Date) {
                                setDate(value); // Sanani tanlash
                            } else {
                                console.error('Expected a single date, but got a date range.');
                            }
                        }}
                        value={date}
                        tileContent={({ date, view }) => {
                            if (view === 'month') {
                                const eventForDay = events.filter(
                                    event => event.date === date.toLocaleDateString('en-CA') // Kalendar yacheykasiga qaydlarni ko‘rsatish
                                );
                                return (
                                    <div className="event-marker">
                                        {eventForDay.map(event => (
                                            <div key={event.id} className="event">
                                                {event.description}
                                            </div>
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </div>
                <input 
                    type="text" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Qaydni kiriting" 
                    className="input"
                />
                <button 
                    onClick={addEvent} 
                    className="button"
                >
                    Qo'shish
                </button>
            </div>
        </div>
    );
};

export default App;
