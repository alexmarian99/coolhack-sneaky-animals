function setCookieToken(value) {
    KTCookie.setCookie("token", value);
}

function getCookieToken() {
    return KTCookie.getCookie("token");
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

const appointmentDoc = `
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
        appointmentDoc,
        "appointments",
        {}
    );
}

const doctorsDoc = `
  query DoctorsTable {
    doctors {
      user {
        users_infos {
          fullname
        }
        doctors {
          specializations
        }
      }
    }
  }
`;

function fetchDoctorsTable() {
    return fetchGraphQL(
        doctorsDoc,
        "DoctorsTable",
        {}
    );
}

const paymentsDoc = `
  query MyQuery {
    payments {
      description
      value
      status
    }
  }
`;

function fetchPayments() {
    return fetchGraphQL(
        paymentsDoc,
        "MyQuery",
        {}
    );
}

const prescriptionsDoc = `
  query Prescriptions {
    prescriptions {
      user {
        users_infos {
          fullname
        }
      }
      text
    }
  }
`;

function fetchPrescriptions() {
    return fetchGraphQL(
        prescriptionsDoc,
        "Prescriptions",
        {}
    );
}

const reviewsDoc = `
  query reviews {
    reviews {
      userByUserid {
        users_infos {
          fullname
        }
      }
      user {
        users_infos {
          fullname
        }
      }
      text
      stars
    }
  }
`;

function fetchReviews() {
    return fetchGraphQL(
        reviewsDoc,
        "reviews",
        {}
    );
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

async function initDoctors() {
    const { errors, data } = await fetchDoctorsTable();

    if (errors) {
        // handle those errors like a pro
        console.error(errors);
    }

    // do something great with this precious data
    console.log(data.doctors);


    var datatable = $('#kt_datatable').KTDatatable({
        // datasource definition
        data: {
            type: 'local',
            source: data.doctors.map(x => ({
                FullName: x.user.users_infos[0].fullname,
                Specialization: x.user.doctors[0].specializations
            })),
            pageSize: 10,
        },

        // layout definition
        layout: {
            scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
            footer: false // display/hide footer
        },

        // column sorting
        sortable: true,

        pagination: true,

        search: {
            input: $('#kt_datatable_search_query'),
            key: 'generalSearch'
        },

        // columns definition
        columns: [{
            field: 'FullName',
            title: 'Full Name',
        }, {
            field: 'Specialization',
            title: 'Specialization',
        }],

    });
}

async function initPayments() {
    const { errors, data } = await fetchPayments();

    if (errors) {
        // handle those errors like a pro
        console.error(errors);
    }

    // do something great with this precious data
    console.log(data.payments);


    var datatable = $('#kt_datatable').KTDatatable({
        // datasource definition
        data: {
            type: 'local',
            source: data.payments.map(x => ({
                Description: x.description,
                Value: x.value,
                Status: x.status
            })),
            pageSize: 10,
        },

        // layout definition
        layout: {
            scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
            footer: false // display/hide footer
        },

        // column sorting
        sortable: true,

        pagination: true,

        search: {
            input: $('#kt_datatable_search_query'),
            key: 'generalSearch'
        },

        // columns definition
        columns: [{
            field: 'Description',
            title: 'Description',
        }, {
            field: 'Value',
            title: 'Value',
        },
        {
            field: 'Status',
            title: 'Status',
        },
        {
            field: 'Actions',
            title: 'Actions',
            sortable: false,
            width: 125,
            autoHide: false,
            overflow: 'visible',
            template: function () {
                return '\
                        <a href="https://pay.vivawallet.com/brolake" type="button" class="btn btn-success">Pay now</a>';
            },
        }],

    });
}

async function initPrescriptions() {
    const { errors, data } = await fetchPrescriptions();

    if (errors) {
        // handle those errors like a pro
        console.error(errors);
    }

    // do something great with this precious data
    console.log(data.prescriptions);

    var datatable = $('#kt_datatable').KTDatatable({
        // datasource definition
        data: {
            type: 'local',
            source: data.prescriptions.map(x => ({
                FullName: x.user.users_infos[0].fullname,
                Text: x.text
            })),
            pageSize: 10,
        },

        // layout definition
        layout: {
            scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
            footer: false // display/hide footer
        },

        // column sorting
        sortable: true,

        pagination: true,

        search: {
            input: $('#kt_datatable_search_query'),
            key: 'generalSearch'
        },

        // columns definition
        columns: [{
            field: 'FullName',
            title: 'Full Name',
        }, {
            field: 'Text',
            title: 'Text',
        }],

    });
}

async function initReviews() {
    const { errors, data } = await fetchReviews();

    if (errors) {
        // handle those errors like a pro
        console.error(errors);
    }

    // do something great with this precious data
    console.log(data.reviews);

    var datatable = $('#kt_datatable').KTDatatable({
        // datasource definition
        data: {
            type: 'local',
            source: data.reviews.map(x => ({
                ClientFullName: x.userByUserid.users_infos[0].fullname,
                DoctorFullName: x.user.users_infos[0].fullname,
                Text: x.text,
                Stars: x.stars
            })),
            pageSize: 10,
        },

        // layout definition
        layout: {
            scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
            footer: false // display/hide footer
        },

        // column sorting
        sortable: true,

        pagination: true,

        search: {
            input: $('#kt_datatable_search_query'),
            key: 'generalSearch'
        },

        // columns definition
        columns: [{
            field: 'ClientFullName',
            title: 'Client Full Name',
        }, {
            field: 'DoctorFullName',
            title: 'Doctor Full Name',
        },
        {
            field: 'Text',
            title: 'Text',
        },
        {
            field: 'Rating',
            title: 'Rating',
            sortable: false,
            width: 125,
            autoHide: false,
            overflow: 'visible',
            template: function (row) {
                    return '<div class="progress">\
                        <div class="progress-bar bg-success" role ="progressbar" style="width: ' + (row.Stars * 20) + '%" aria-valuenow="' + (row.Stars * 20) + '" aria-valuemin="0" aria-valuemax="100"></div>\
    <div class="progress-bar bg-danger" role="progressbar" style="width: ' + (100 - row.Stars * 20) + '%" aria-valuenow="' + (100 - row.Stars * 20) + '" aria-valuemin="0" aria-valuemax="100"></div>\
</div>';
            },
        }
        ],

    });
}