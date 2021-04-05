function createTimetable(lessons) {
    const timeTable = {
        weeks: {
            "1": {
                week_number: 1,
                days: {
                    "1": {
                        day_name: "Понеділок",
                        day_number: 1,
                        lessons: []
                    },
                    "2": {
                        day_name: "Вівторок",
                        day_number: 2,
                        lessons: []
                    },
                    "3": {
                        day_name: "Середа",
                        day_number: 3,
                        lessons: []
                    },
                    "4": {
                        day_name: "Четвер",
                        day_number: 4,
                        lessons: []
                    },
                    "5": {
                        day_name: "П’ятниця",
                        day_number: 5,
                        lessons: []
                    },
                    "6": {
                        day_name: "Субота",
                        day_number: 6,
                        lessons: []
                    },
                }
            },

            "2": {
                week_number: 2,
                days: {
                    "1": {
                        day_name: "Понеділок",
                        day_number: 1,
                        lessons: []
                    },
                    "2": {
                        day_name: "Вівторок",
                        day_number: 2,
                        lessons: []
                    },
                    "3": {
                        day_name: "Середа",
                        day_number: 3,
                        lessons: []
                    },
                    "4": {
                        day_name: "Четвер",
                        day_number: 4,
                        lessons: []
                    },
                    "5": {
                        day_name: "П’ятниця",
                        day_number: 5,
                        lessons: []
                    },
                    "6": {
                        day_name: "Субота",
                        day_number: 6,
                        lessons: []
                    },
                }
            }
        }
    };

    try {
        lessons.forEach(lesson => {
            timeTable["weeks"][lesson.lesson_week]["days"][lesson.day_number]["lessons"].push(lesson)
        });
    } catch (err){
        console.log("Lessons are empty");
        timeTable["weeks"] = null

    }
    return timeTable;
}

module.exports.createTimetable = createTimetable;