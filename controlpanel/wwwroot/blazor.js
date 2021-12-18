function setCookieToken(value) {
    KTCookie.setCookie("token", value);
}

function getCookieToken() {
    return KTCookie.getCookie("token");
}

async function initCalendar() {
    const { errors, data } = await fetchAppointments();

    if (errors) {
        // handle those errors like a pro
        console.error(errors);
    }

    // do something great with this precious data
    console.log(data.appointments);
    var todayDate = moment().startOf('day');
    var YM = todayDate.format('YYYY-MM');
    var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
    var TODAY = todayDate.format('YYYY-MM-DD');
    var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');

    var calendarEl = document.getElementById('kt_calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['bootstrap', 'interaction', 'dayGrid', 'timeGrid', 'list'],
        themeSystem: 'bootstrap',

        isRTL: KTUtil.isRTL(),

        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },

        height: 800,
        contentHeight: 780,
        aspectRatio: 3,  // see: https://fullcalendar.io/docs/aspectRatio

        nowIndicator: true,
        now: TODAY + 'T09:25:00', // just for demo

        views: {
            dayGridMonth: { buttonText: 'month' },
            timeGridWeek: { buttonText: 'week' },
            timeGridDay: { buttonText: 'day' }
        },

        defaultView: 'dayGridMonth',
        defaultDate: TODAY,

        editable: true,
        eventLimit: true, // allow "more" link when too many events
        navLinks: true,
        events: data.appointments.map(x => ({
            title: x.user.users_infos[0].fullname,
            start: TOMORROW,
            description: x.meetlink,
            url: x.meetlink,
            className: "fc-event-danger fc-event-solid-warning"
        })),

        eventRender: function (info) {
            var element = $(info.el);

            if (info.event.extendedProps && info.event.extendedProps.description) {
                if (element.hasClass('fc-day-grid-event')) {
                    element.data('content', info.event.extendedProps.description);
                    element.data('placement', 'top');
                    KTApp.initPopover(element);
                } else if (element.hasClass('fc-time-grid-event')) {
                    element.find('.fc-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
                } else if (element.find('.fc-list-item-title').lenght !== 0) {
                    element.find('.fc-list-item-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
                }
            }
        }
    });

    calendar.render();
}

async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(
        "https://graphql.brolake.ro/v1/graphql",
        {
            method: "POST",
            body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName
            }),
            headers: {
                Authorization: getCookieToken()
            }
        }
    );

    return await result.json();
}

const operationsDoc = `
  query appointments {
    appointments {
      user {
        users_infos {
          fullname
        }
      }
      meetlink
      datetime
    }
  }
`;

function fetchAppointments() {
    return fetchGraphQL(
        operationsDoc,
        "appointments",
        {}
    );
}