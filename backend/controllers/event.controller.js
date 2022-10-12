
const getUpcomingEventsController = (req, res) => {
    const upcomingEvents = {
        events: [
            {
                eventID: 1,
                eventName: "CSE BBQ",
                eventDate: new Date(2022, 10, 13),
                startTime: new Date(2022, 10, 13, 12),
                endTime: new Date(2022, 10, 13, 14),
                eventDescription: "Eat CSE BBQ at UNSW",
                eventLocation: "The University of New South Wales High St Kensington NSW 2033",
                eventVenue: "UNSW Library Lawn",
                capacity: 500,
                published: true
            },
            {
                eventID: 2,
                eventName: "CSE BALL",
                eventDate: new Date(2022, 10, 18),
                startTime: new Date(2022, 10, 18, 18, 30),
                endTime: new Date(2022, 10, 19),
                eventDescription: "Dance at UNSW CSE Ball",
                eventLocation: "The University of New South Wales High St Kensington NSW 2033",
                eventVenue: "Sydney Ballroom",
                capacity: 300,
                published: true
            },
            {
                eventID: 3,
                eventName: "CSE Careers Expo",
                eventDate: new Date(2022, 10, 20),
                startTime: new Date(2022, 10, 20, 10),
                endTime: new Date(2022, 10, 20, 16),
                eventDescription: "Meet potential employers",
                eventLocation: "The University of New South Wales High St Kensington NSW 2033",
                eventVenue: "UNSW Sir John Clancy Auditorium",
                capacity: 500,
                published: true
            },
            {
                eventID: 4,
                eventName: "WAO Fridays",
                eventDate: new Date(2022, 10, 28),
                startTime: new Date(2022, 10, 28, 20),
                endTime: new Date(2022, 10, 29, 4),
                eventDescription: "Party at WAO",
                eventLocation: "330 George St, Sydney NSW 2000",
                eventVenue: "Ivy Sydney",
                capacity: 1000,
                published: true
            },
            {
                eventID: 5,
                eventName: "Moulin Rogue",
                eventDate: new Date(2022, 10, 13),
                startTime: new Date(2022, 10, 13, 18),
                endTime: new Date(2022, 10, 31, 21, 30),
                eventDescription: "Come see the musical Moulin Rogue",
                eventLocation: "55 Pirrama Rd, Pyrmont NSW 2009",
                eventVenue: "Sydney Lyric Theatre",
                capacity: 700,
                published: true
            },
            {
                eventID: 6,
                eventName: "Vivid Sydney",
                eventDate: new Date(2022, 11, 1),
                startTime: new Date(2022, 11, 1, 19),
                endTime: new Date(2022, 11, 13, 23, 30),
                eventDescription: "See lights at night around Sydney",
                eventLocation: "George St, Sydney NSW 2000",
                eventVenue: "Sydney CBD",
                capacity: 10000,
                published: true
            }
        ]
    }
    res.status(200).json(upcomingEvents)
}

const getAllEventsController = (req, res) => {
    const allEvents = {
        events: [
            {
                eventID: 1,
                eventName: "CSE BBQ",
                eventDate: new Date(2022, 10, 13),
                startTime: new Date(2022, 10, 13, 12),
                endTime: new Date(2022, 10, 13, 14),
                eventDescription: "Eat CSE BBQ at UNSW",
                eventLocation: "The University of New South Wales High St Kensington NSW 2033",
                eventVenue: "UNSW Library Lawn",
                capacity: 500,
                published: true
            },
            {
                eventID: 2,
                eventName: "CSE BALL",
                eventDate: new Date(2022, 10, 18),
                startTime: new Date(2022, 10, 18, 18, 30),
                endTime: new Date(2022, 10, 19),
                eventDescription: "Dance at UNSW CSE Ball",
                eventLocation: "The University of New South Wales High St Kensington NSW 2033",
                eventVenue: "Sydney Ballroom",
                capacity: 300,
                published: true
            },
            {
                eventID: 3,
                eventName: "CSE Careers Expo",
                eventDate: new Date(2022, 10, 20),
                startTime: new Date(2022, 10, 20, 10),
                endTime: new Date(2022, 10, 20, 16),
                eventDescription: "Meet potential employers",
                eventLocation: "The University of New South Wales High St Kensington NSW 2033",
                eventVenue: "UNSW Sir John Clancy Auditorium",
                capacity: 500,
                published: true
            },
            {
                eventID: 4,
                eventName: "WAO Fridays",
                eventDate: new Date(2022, 10, 28),
                startTime: new Date(2022, 10, 28, 20),
                endTime: new Date(2022, 10, 29, 4),
                eventDescription: "Party at WAO",
                eventLocation: "330 George St, Sydney NSW 2000",
                eventVenue: "Ivy Sydney",
                capacity: 1000,
                published: true
            },
            {
                eventID: 5,
                eventName: "Moulin Rogue",
                eventDate: new Date(2022, 10, 13),
                startTime: new Date(2022, 10, 13, 18),
                endTime: new Date(2022, 10, 31, 21, 30),
                eventDescription: "Come see the musical Moulin Rogue",
                eventLocation: "55 Pirrama Rd, Pyrmont NSW 2009",
                eventVenue: "Sydney Lyric Theatre",
                capacity: 700,
                published: true
            },
            {
                eventID: 6,
                eventName: "Vivid Sydney",
                eventDate: new Date(2022, 11, 1),
                startTime: new Date(2022, 11, 1, 19),
                endTime: new Date(2022, 11, 13, 23, 30),
                eventDescription: "See lights at night around Sydney",
                eventLocation: "George St, Sydney NSW 2000",
                eventVenue: "Sydney CBD",
                capacity: 10000,
                published: true
            },
            {
                eventID: 7,
                eventName: "CSE BBQ",
                eventDate: new Date(2022, 10, 13),
                startTime: new Date(2022, 10, 13, 12),
                endTime: new Date(2022, 10, 13, 14),
                eventDescription: "Eat CSE BBQ at UNSW",
                eventLocation: "The University of New South Wales High St Kensington NSW 2033",
                eventVenue: "UNSW Library Lawn",
                capacity: 500,
                published: true
            },
            {
                eventID: 8,
                eventName: "CSE BALL",
                eventDate: new Date(2022, 10, 18),
                startTime: new Date(2022, 10, 18, 18, 30),
                endTime: new Date(2022, 10, 19),
                eventDescription: "Dance at UNSW CSE Ball",
                eventLocation: "The University of New South Wales High St Kensington NSW 2033",
                eventVenue: "Sydney Ballroom",
                capacity: 300,
                published: true
            },
            {
                eventID: 9,
                eventName: "CSE Careers Expo",
                eventDate: new Date(2022, 10, 20),
                startTime: new Date(2022, 10, 20, 10),
                endTime: new Date(2022, 10, 20, 16),
                eventDescription: "Meet potential employers",
                eventLocation: "The University of New South Wales High St Kensington NSW 2033",
                eventVenue: "UNSW Sir John Clancy Auditorium",
                capacity: 500,
                published: true
            },
            {
                eventID: 10,
                eventName: "WAO Fridays",
                eventDate: new Date(2022, 10, 28),
                startTime: new Date(2022, 10, 28, 20),
                endTime: new Date(2022, 10, 29, 4),
                eventDescription: "Party at WAO",
                eventLocation: "330 George St, Sydney NSW 2000",
                eventVenue: "Ivy Sydney",
                capacity: 1000,
                published: true
            },
            {
                eventID: 11,
                eventName: "Moulin Rogue",
                eventDate: new Date(2022, 10, 13),
                startTime: new Date(2022, 10, 13, 18),
                endTime: new Date(2022, 10, 31, 21, 30),
                eventDescription: "Come see the musical Moulin Rogue",
                eventLocation: "55 Pirrama Rd, Pyrmont NSW 2009",
                eventVenue: "Sydney Lyric Theatre",
                capacity: 700,
                published: true
            },
            {
                eventID: 12,
                eventName: "Vivid Sydney",
                eventDate: new Date(2022, 11, 1),
                startTime: new Date(2022, 11, 1, 19),
                endTime: new Date(2022, 11, 13, 23, 30),
                eventDescription: "See lights at night around Sydney",
                eventLocation: "George St, Sydney NSW 2000",
                eventVenue: "Sydney CBD",
                capacity: 10000,
                published: true
            }
        ]
    }
    res.status(200).json(allEvents)
}

export {
    getUpcomingEventsController,
    getAllEventsController
}