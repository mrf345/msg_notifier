// Dependencies: jQuery, jQuery-ui, FontAwesome

var msgNotifier = function (options={}, callback=function () {}) {
    returnMN = {} // unique object name to return
    
    returnMN.options = {
        url_hash: options.url_hash || ['msgNotifier'], // hash keyword to initiate notification with
        without_hash: options.without_hash || 'false', // to initiate msg overlay even if invalid hash
        text: options.text || ['This is the overlay msgNotifier !'],
        textClass: options.textClass || '',
        textStyle: options.textStyle || {
            'color': 'white',
            'font-family': 'Georgia, Times, serif',
            'text-shadow': '0 0 30px rgba(255,255,255,0.5)'
        },
        iconClass: options.iconClass || ['fa fa-envelope'],
        iconStyle: options.iconStyle || {
            'color': 'white',
            'text-shadow': '0 0 30px rgba(255,255,255,0.5)',
            'font-size': '800%'
        },
        buttonText: options.buttonText || '(Click or Touch to proceed)',
        buttonClass: options.buttonClass || '',
        buttonStyle: options.buttonStyle || {
            'color': 'white',
            'font-family': 'Georgia, Times, mono',
            'font-size': '140%',
            'font-stretch': 'ultra-expanded'
        },
        overlayColor: options.overlayColor || 'rgba(0,0,0,0.85)',
        overlayClass: options.overlayClass || '',
        overlayStyle: options.overlayStyle || {},
        effectDuration: options.effectDuration * 1000 || 1000
        
    }

    returnMN.getTheIndex = function () {
        var indexToReturn = returnMN.options.url_hash.indexOf(window.location.href.split('#').slice(-1)[0])
        return indexToReturn === -1 ? 0 : indexToReturn
    }

    returnMN.defaults = {
        loopButton: false,
        loopOverlay: false,
        elements: { // list of jQuery elements to be appended
            text: $('<h1>').text(returnMN.options.text[returnMN.getTheIndex()]).css(returnMN.options.textStyle).addClass('text-center'),
            button: $('<h1>').addClass(returnMN.options.buttonClass).css(returnMN.options.buttonStyle)
            .text(returnMN.options.buttonText),
            icon: $('<span>').addClass(returnMN.options.iconClass[returnMN.getTheIndex()]).css(returnMN.options.iconStyle)
        }
    }

    returnMN.defaults.elements.overlay = $('<div>')
    .addClass(returnMN.options.overlayClass)
    .css(Object.assign({
        'display': 'flex',
        'position': 'fixed',
        'opacity': '0',
        'background-color': returnMN.options.overlayColor,
        'width': '100%',
        'height': '100%',
        'top': '0',
        'bottom': '0',
        'left': '0',
        'right': '0',
        'z-index': '10',
        'flex-direction': 'column',
        'align-items': 'center',
        'justify-content': 'space-around',
        'cursor': 'pointer'
    }, returnMN.options.overlayStyle))
    .click(function () {
        returnMN.__exit__()
    })
    .append(returnMN.defaults.elements.icon)
    .append(returnMN.defaults.elements.text)
    .append(returnMN.defaults.elements.button)

    returnMN.__toggleEffect__ = function () {
        if (returnMN.defaults.loopOverlay && returnMN.defaults.loopButton) {
            clearInterval(returnMN.defaults.loopOverlay)
            clearInterval(returnMN.defaults.loopButton)
        } else {
            var toOverlayEffect = function () {
                $(returnMN.defaults.elements.overlay).animate({'opacity': '0.8'}, 1500, complete=function () {
                    $(returnMN.defaults.elements.overlay).animate({'opacity': '1'}, 1500)    
                })
            }
            var toButtonEffect = function () {
                $(returnMN.defaults.elements.button).animate({'opacity': '0.1'}, 1500, complete=function () {
                    $(returnMN.defaults.elements.button).animate({'opacity': '1'}, 1500)    
                })
            }
            returnMN.defaults.loopOverlay = setInterval(toOverlayEffect, 5000)
            returnMN.defaults.loopButton = setInterval(toButtonEffect, 5000)
            toOverlayEffect()
            toButtonEffect()
        }
    }

    returnMN.__init__ = function () {
        var todoTwice = function () {
            if (
                window.location.href.split('#')
                .slice(-1)[0] === returnMN.options.url_hash[returnMN.getTheIndex()] || returnMN.options.without_hash === 'true'
            ) {
                $('body').append(returnMN.defaults.elements.overlay)
                $(returnMN.defaults.elements.overlay).animate({'opacity': '1'}, returnMN.options.effectDuration)
                returnMN.__toggleEffect__()
            } else callback()
        }
        if (document.readyState === 'complete') todoTwice()
        else $(todoTwice)

    }

    returnMN.__exit__ = function () {
        returnMN.__toggleEffect__()
        $(returnMN.defaults.elements.overlay).animate({'opacity': '0'}, (returnMN.options.effectDuration),
        complete=function () {
            $(returnMN.defaults.elements.overlay).remove()
            callback()
        })
    }


    if(returnMN.options.without_hash === 'false') returnMN.__init__()
    return returnMN
}