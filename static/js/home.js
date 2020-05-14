/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/flags',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $flag = $('#flag'),
        $message = $('#message');

    // return the API
    return {
        reset: function() {
            $flag.val('');
            $message.val('').focus();
        },
        build_table: function(flags) {
            let rows = ''

            // clear the table
            $('.flags table > tbody').empty();

            // did we get a flags array?
            if (flags) {
                for (let i=0, l=flags.length; i < l; i++) {
                    rows += `<tr><td class="flag">${flags[i].flag}</td><td class="message">${flags[i].message}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $flag = $('#flag'),
        $message = $('#message');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Create our event handlers
    $('#create').click(function(e) {
        let flag = $flag.val(),
            message = $message.val();

        e.preventDefault();

        if (validate(flag, message)) {
            model.create(flag, message)
        } else {
            alert('Problem with first or last name input');
        }
    });


    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            flag,
            message;

        flag = $target
            .parent()
            .find('td.flag')
            .text();

        message = $target
            .parent()
            .find('td.message')
            .text();

        view.update_editor(flag, message);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
