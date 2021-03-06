import React  from 'react'
import { useState, useEffect } from 'react'
import { CalanderHeader } from '../Calander-Header/CalanderHeader';
import { Day } from '../Day/Day';
import { DeleteEventModal } from '../DeleteEventModal/DeleteEventModal';
import { NewEventMiodal } from '../newEventModal/NewEventMiodal';

export const App = () => {

    const [nav, setNav] = useState(0);
    const [days, setDays] = useState([]);
    const [dateDisplay, setDateDisplay] = useState('');
    const [clicked, setClicked] = useState();
    const [events, setEvents] = useState(
        localStorage.getItem("events") ?
        JSON.parse(localStorage.getItem("events")) :
        []
    );

    const eventForDate = date => events.find(e => e.date === date)

    useEffect(()=>{
        localStorage.setItem("events", JSON.stringify(events))
    }, [events]);

    useEffect(() => {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const dt = new Date();

        if(nav !== 0){
          dt.setMonth(new Date().getMonth() + nav);
        }
        const day = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();

        const firstDayofMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month+1, 0).getDate();

        const dateString = firstDayofMonth.toLocaleDateString('en-us', {
            weekday:'long', 
            year:'numeric',
            month:'numeric',
            day: 'numeric',
        });
        setDateDisplay(`${dt.toLocaleDateString('en-us',{ month: 'long',})} ${year}`);
        const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

        const dayArr = [];

        for (let i=1; i <= paddingDays + daysInMonth; i++){
            const dayString = `${month +1 }/${i - paddingDays}/${year}`;
            if(i > paddingDays){
                dayArr.push({
                    value: i - paddingDays,
                    event: eventForDate(dayString),
                    isCurrentDay: i - paddingDays == day && nav === 0,
                    date: dayString
                })
            }
            else{
                dayArr.push({
                    value: 'padding',
                    event: null,
                    isCurrentDay: false,
                    date: ''
                })
            }
        }
        setDays(dayArr);
    }, [events, nav])

  return (
    <>
      <div id="container">
            <CalanderHeader
              dateDisplay={dateDisplay}
              onNext={()=> setNav(nav + 1)}
              onBack={()=> setNav(nav - 1)}

             />
            <div id="weekdays">
                <div>Sunday</div>
                <div>Monday</div>
                <div>Tuesday</div>
                <div>Wednesday</div>
                <div>Thursday</div>
                <div>Friday</div>
                <div>Saturday</div>
            </div>

          <div id="calendar">
          {days.map((d, index) => (
            <Day
              key={index}
              day={d}
              onClick={() => {
                if (d.value !== 'padding') {
                  setClicked(d.date);
                }
              }}
            />
          ))}
        </div>
      </div>
      
        {
        clicked && !eventForDate(clicked) &&
        <NewEventMiodal
          onClose={() => setClicked(null)}
          onSave={title => {
            setEvents([ ...events, { title, date: clicked }]);
            setClicked(null);
          }}
        />
      }

      {
        clicked && eventForDate(clicked) &&
        <DeleteEventModal 
          eventText={eventForDate(clicked).title}
          onClose={() => setClicked(null)}
          onDelete={() => {
            setEvents(events.filter(e => e.date !== clicked))
            setClicked(null);
          }}
        
        />
      }
    </>
  )
}
