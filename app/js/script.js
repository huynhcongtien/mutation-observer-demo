$(function() {
    'use strict';

    // select the target node
    var target = $('#target');

    $('#change_character').click(function() {
        target[0].firstChild.nodeValue = 'Data ' + $.now();
    });

    $('#change_child_character').click(function() {
        // target.find('span').html($.now());
        target.html('<span>Span ' + $.now() + '</span><label>Label ' + $.now() + '</label>');
    });

    $('#add_element').click(function() {
        target.html('<span>Span ' + $.now() + '</span><label>Label ' + $.now() + '</label>');
    });

    $('#change_attr_foo').click(function() {
        target.attr('foo', $.now());
    });

    $('#change_attr_data').click(function() {
        target.attr('data-id', $.now());
    });

    // create an observer instance
    var observer = new MutationObserver(function (mutationRecordsList) {
        mutationRecordsList.forEach(function (mutationRecord) {
            var lbClass = '';

            switch (mutationRecord.type) {
                case 'childList':
                    lbClass = 'primary';
                    break;

                case 'characterData':
                    lbClass = 'success';
                    break;

                case 'attributes':
                    lbClass = 'info';
                    break;

                default:
                    lbClass = 'default';
                    break;
            }

            var contents = [
                'Type: <span class="label label-' + lbClass + '">' + mutationRecord.type + '</span>',
                'Target: <span class="label label-default">' + mutationRecord.target.nodeName + '</span>'
            ];

            if (typeof mutationRecord.target.id !== 'undefined') {
                contents.push('Targer id: <span class="label label-default">' + mutationRecord.target.id + '</span>');
                contents.push('Targer class: <span class="label label-default">' + mutationRecord.target.className + '</span>');
            }

            if (mutationRecord.removedNodes.length) {
                var nodeText = '';

                $.each(mutationRecord.removedNodes, function(index, node) {
                    if (node.nodeName === '#text') {
                        nodeText = node.textContent;
                    } else {
                        nodeText = node.outerText;
                    }

                    contents.push('Removed nodes <span class="label label-default">' + node.nodeName + '</span>:' + nodeText);
                });
            } else {
                contents.push('Removed nodes: <i>0</i>');
            }

            if (mutationRecord.addedNodes.length) {
                var nodeText = '';

                $.each(mutationRecord.addedNodes, function(index, node) {
                    if (typeof  node.outerText !== 'undefined') {
                        nodeText = node.outerText;
                    } else {
                        nodeText = '<i>undefined</i>';
                    }

                    contents.push('Added nodes <span class="label label-default">' + node.nodeName + '</span>:' + nodeText);
                });
            } else {
                contents.push('Added nodes: <i>0</i>');
            }

            switch (mutationRecord.type) {
                case 'attributes':
                    contents.push('Target attribute <span class="label label-default">'
                        + mutationRecord.attributeName + '</span>:'
                        + mutationRecord.target.attributes[mutationRecord.attributeName].value
                    );

                    contents.push('Old attribute value <span class="label label-default">'
                        + mutationRecord.attributeName + '</span>: ' + mutationRecord.oldValue
                    );
                    break;

                case 'characterData':
                    contents.push('Old value: ' + mutationRecord.oldValue);
                    break;
            }

            var content = '';

            contents.forEach(function(element) {
                content += '<p>' + element + '</p>';
            });

            content = '<div class="row">' + content + '</div>';

            $('.console').append(content);
            $('.console')[0].scrollTop = $('.console')[0].scrollHeight;
        });
    });

    // configuration of the observer
    var config = {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true,
        attributeFilter: ['foo', 'data-id']
    };

    // pass in the target node, as well as the observer options
    function observerInit() {
        observer.observe(target[0], config);
    }

    observerInit();

    // stop observing
    $('#stop_listen').click(function() {
        if ($(this).is(':checked')) {
            observer.disconnect();
        } else {
            observerInit();
        }
    });

});
