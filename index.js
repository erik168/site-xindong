function g( id ) {
    return document.getElementById( id );
}

function setOpacity( elem, opacity ) {
    if ( /msie/i.test( navigator.userAgent ) ) {
        elem.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity:"+
            Math.floor(opacity * 100) +")";
    } else {
        elem.style.opacity = opacity;
    }
}

function show( elem, display ) {
    elem.style.display = display || '';
}

function hide( elem ) {
    elem.style.display = 'none';
}

function Tween( option ) {
    option = option || {};
    var duration  = option.duration || 400;
    var step      = option.step || 25;
    var inProcess = 0;
    var fn = option.fn || Tween.easeIn;


    function tween( stepProcess, onfinish ) {
        if ( inProcess ) {
            return false;
        }

        var currentStep = 1;
        var interval = duration / step;
        inProcess = 1;

        function doTween() {
            if ( currentStep == step ) {
                stepProcess( fn( currentStep, step ) );
                inProcess = 0;
                onfinish && onfinish();
                return;
            }

            stepProcess( fn( currentStep, step ) );
            currentStep++;
            setTimeout( doTween, interval );
        }

        setTimeout( doTween, interval );
        return true;
    }

    
    return tween;
};

Tween.easeIn = function ( currentStep, step ) {
    return 1 - Math.pow( 1 - currentStep / step, 3 );
};

var Exhibit = function () {
    var START = 1;
    var END   = 2;
    var IOS_PREFIX     = 'ExhibitIos';
    var ANDROID_PREFIX = 'ExhibitAndroid';
    var STAY_SECOND    = 5;

    var before = START - 1;
    var current = START;

    function startNext(){
        setTimeout( next, STAY_SECOND * 1000 );
    }

    function next() {
        before = current;
        current++ ;
        if ( current > END ) {
            current = START;
        }

        var currentAndroid = g( ANDROID_PREFIX + current );
        var currentIos     = g( IOS_PREFIX + current );
        var beforeAndroid  = g( ANDROID_PREFIX + before );
        var beforeIos      = g( IOS_PREFIX + before );
        var tween = Tween();
        tween( function ( rate ) {
                show( currentAndroid );
                show( currentIos );
                setOpacity( beforeAndroid, 1 - rate );
                setOpacity( beforeIos, 1 - rate );
                setOpacity( currentAndroid, rate );
                setOpacity( currentIos, rate );
            }, function () {
                hide( beforeAndroid );
                hide( beforeIos );
                startNext();
            } );
    }

    return {
        init: function () {
            for ( var i = START; i <= END; i++ ) {
                hide( g( IOS_PREFIX + i ) );
                hide( g( ANDROID_PREFIX + i ) );
            }

            show( g( IOS_PREFIX + current ) );
            show( g( ANDROID_PREFIX + current ) );

            startNext();
        }
    };
}();

Exhibit.init();

