import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {useNavigate} from 'react-router-dom';

// component from
// https://github.com/jquense/react-big-calendar
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

/**
 *  Functional component that renders the calendar that shows events
 *  that the user is attending/purchased. By clicking a booked time slot 
 *  in the calendar user can view the event page 
 */
const EventCalendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = React.useState([]);

  const styles = {
    height: "100vh",
    padding: "3%",
  };

  const fetchAttending = async() => {
    const response = await fetch(`http://localhost:3000/events/attending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    const eachEvent = [];
    for (const eve of json.events) {
      eachEvent.push({
        start: moment(eve.startDateTime),
        end: moment(eve.endDateTime),
        title: eve.eventName,
        eventId: eve.eventID
      })
    }
    setEvents(eachEvent);
    
  }

  React.useEffect(()=> {
    fetchAttending();
  },[]);

  const viewEvent = (e) => {
    navigate(`/event/view/${e.eventId}`)
  }
  return (
    <div className="App">
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        views={{
          month: true
        }}
        events={events}
        style={styles}
        onSelectEvent={(e)=>viewEvent(e)}
      />
    </div>
  );
  
}

export default EventCalendar;