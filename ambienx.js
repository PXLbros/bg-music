// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}


// http://stackoverflow.com/questions/6784927/how-to-acces-javascript-object-variables-in-prototype-function
// https://seesparkbox.com/foundry/api_patterns_for_your_open_source_javascript_plugin
// https://gomakethings.com/the-anatomy-of-a-vanilla-javascript-plugin/
// https://github.com/HubSpot/odometer/blob/master/odometer.js
// https://github.com/jquery-boilerplate/jquery-patterns
;(function() {

    // DEFINE THE NAME FOR THE PLUGIN AND CALL IT USING AN IIFE
    Ambienx = (function() {

        // MOBILE DEVICE DETECTION
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            ambienxState.isMobile = true;
        }

        /*------------------------------------*\
          AMBIENX STATE
        \*------------------------------------*/
        var ambienxState = {
            isMobile: false,
            isPlaying: false,
            isFading: false,
            isPauseUserInitiated: false
        };


        /*------------------------------------*\
          VARIABLES...
        \*------------------------------------*/
        var fadeInAudioInterval;
        var fadeOutAudioInterval;


        /*------------------------------------*\
          AMBIENX
        \*------------------------------------*/
        function Ambienx(options) {

            /*------------------------------------*\
              PRIVATE VARIABLES
            \*------------------------------------*/
            // DEFAULT OPTIONS/SETTINGS
            var defaultOptions = {
                audioSrc: '',
                audioLoop: false,
                autoPlay: false,
                enabledLoseFocus: false
            }

            // USER OPTIONS/SETTINGS
            var userOptions = options;

            // MERGE OPTIONS/SETTINGS
            var daOptions = Object.assign({}, defaultOptions, userOptions);

            // AUDIO INSTANCE
            var audio;

            /*------------------------------------*\
              PUBLIC VARIABLES
            \*------------------------------------*/


            /*------------------------------------*\
              DO STUFF
            \*------------------------------------*/
            
            // INSTANTIATE AUDIO INSTANCE
            if (daOptions.audioSrc) {
                audio = new Audio(daOptions.audioSrc);
            }

            if (daOptions.audioLoop) {
                audio.loop = true;
            } else {
                audio.loop = false;
            }

            if (daOptions.autoPlay) {
                audio.play();
            }


            /*------------------------------------*\
              WINDOW BLUR/FOCUS EVENTS
            \*------------------------------------*/
            if (daOptions.enabledLoseFocus) {
                window.onblur = function() {
                    audio.pause();    
                }

                window.onfocus = function() {

                    if (!ambienxState.isPauseUserInitiated) {
                        if (ambienxState.isPlaying) {
                            audio.play();
                        }
                    }
                    
                }
            }

            /*------------------------------------*\
              METHODS
            \*------------------------------------*/


            /*------------------------------------*\
              PRIVATE MADE PUBLIC VARIABLES
            \*------------------------------------*/
            this.daOptions = daOptions;
            this.audio = audio;

        };

        /*------------------------------------*\
          METHODS
        \*------------------------------------*/

        Ambienx.prototype.clearIntervals = function() {

            if (ambienxState.isFadng) {
                clearInterval(fadeInAudioInterval);
                clearInterval(fadeOutAudioInterval);                
            }

        }

        Ambienx.prototype.playAudio = function() {
            if (!ambienxState.isMobile) {
                this.clearIntervals();

                this.audio.volume = 1;
                this.audio.play();
                ambienxState.isPauseUserInitiated = false;
                ambienxState.isPlaying = true;
            }
        }

        Ambienx.prototype.pauseAudio = function(options) {
            this.clearIntervals();

            this.audio.pause();
            ambienxState.isPauseUserInitiated = true;
            ambienxState.isPlaying = false;

            if (options) {
                if (options.stop) {
                    this.audio.currentTime = 0;
                }
            }
        }

        // http://stackoverflow.com/questions/7451508/html5-audio-playback-with-fade-in-and-fade-out
        Ambienx.prototype.fadeInAudio = function(setVolume) {

            var self = this;

            self.playAudio();
            self.audio.volume = 0;

            fadeOutAudioInterval = setInterval(function () {

                if (self.audio.volume.toFixed(1) < setVolume) {
                    self.audio.volume += 0.1;
                }

                if (parseFloat(self.audio.volume.toFixed(1)) === setVolume) {
                    clearInterval(fadeOutAudioInterval);
                }

            }, 200);

        }


        Ambienx.prototype.fadeOutAudio = function(setVolume) {

            var self = this;

            fadeInAudioInterval = setInterval(function () {

                if (self.audio.volume.toFixed(1) > setVolume) {
                    self.audio.volume -= 0.1;
                }

                if (parseFloat(self.audio.volume.toFixed(1)) === setVolume) {
                    
                    clearInterval(fadeInAudioInterval);

                    if (setVolume === 0) {
                        self.pauseAudio();
                    }

                }

            }, 200);

        }

        Ambienx.prototype.toggleFadeAudio = function(options) {
            if (ambienxState.isPlaying) {

                var fadeOutVolume;

                if (options.fadeOutVolume) {
                    fadeOutVolume = options.fadeOutVolume;
                } else {
                    fadeOutVolume = 0;
                }
                this.fadeOutAudio(fadeOutVolume);

            } else {
                
                var fadeInVolume;

                if (options.fadeInVolume) {
                    fadeInVolume = options.fadeInVolume;
                } else {
                    fadeInVolume = 1;
                }


                this.fadeInAudio(fadeInVolume);

            }
        }




        // RETURN Ambienx SO THAT IT CAN BE INSTANTIATED WITH TNE `new` KEYWORD
        return Ambienx;

    })();


    /*------------------------------------*\
      EXPORT OPTIONS
    \*------------------------------------*/
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return Ambienx;
        });
    } else if (typeof exports !== "undefined" && exports !== null) {
        module.exports = Ambienx;
    } else {
        window.Ambienx = Ambienx;
    }



// WHAT IS THIS FOR?
}).call(this);


