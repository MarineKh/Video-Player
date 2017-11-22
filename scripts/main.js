'use strict';

$(document).ready(function() {

    let $video = $('<video>'),
        $vidcontainer = $('.vidcontainer').attr('id', 'myvid'),
        $videoList = $('.vids'),
        $playListUL = $('<ul>'),
        $liArr = [];

    $vidcontainer.append($video);
    $videoList.append($playListUL);

    $.each(playlist, function(key) {
        $liArr[key] = $('<li>');

        $playListUL.append($liArr);
        let $key = playlist[key];

        $.each($key.file, function(keyInside) {
            $liArr[key] .attr({'data-val': $key.file[keyInside], 'class': 'link'})
                .text($key.name);
        });
    });
    $video.attr({
        'src': playlist[0].file.fullHD
    });

    $(".videolist li").click(function(event) {
        // change video source
        $video.attr({
            "src": $(this).attr("data-val"),
            "autoplay": "autoplay"
        });
        $(".vids li").removeClass("playing");
        $(this).addClass("playing");

        btnPlay.addClass('paused');

        // adjust prev button state
        if ($(".link:first").hasClass("playing")) {
            $prevBtn.addClass("disabled");
        }
        else {
            $prevBtn.removeClass("disabled");
        }

        // adjust next button state
        if ($(".link:last").hasClass("playing")) {
            $nextBtn.addClass("disabled");
        }
        else {
            $nextBtn.removeClass("disabled");
        }
        event.preventDefault();
    });

    let firstLink = $(".link:first"),
        btnPlay = $('.btnPlay'),
        $prevBtn = $(".prevvid"),
        $nextBtn = $(".nextvid"),
        $progress = $('.progress');

        $video.click( function() { playpause(); } );
        btnPlay.click( function() { playpause(); } );

    let playpause = function() {
        if($video[0].paused || $video[0].ended) {
            btnPlay.addClass('paused');
            $video[0].play();
        }
        else {
            btnPlay.removeClass('paused');
            $video[0].pause();
        }
    };
    firstLink.addClass("playing");

    //previous video button
    $prevBtn.click(function(){
        $video.attr("src", $(".playing").prev().attr('data-val'));

        $video[0].play();
        $(".playing").prev().addClass("playing");
        $(".playing:last").removeClass("playing");
        btnPlay.addClass('paused');
        $(".nextvid").removeClass("disabled");
        if ($(".link:first").hasClass("playing")) {
            $(this).addClass("disabled");
        } else {
            $(this).removeClass("disabled");
        }
    });

    $nextBtn.click(function() { nextTrack(); });
    $video.on('ended', function() { nextTrack(); }); ///  pause chi anum verjum

    //next video button

    let nextTrack = function () {
        $video.attr("src", $(".playing").next().attr('data-val'));

        $video[0].play();
        $(".playing").next().addClass("playing");
        $(".playing:first").removeClass("playing");
        btnPlay.addClass('paused');
        $prevBtn.removeClass("disabled");
        if ($(".link:last").hasClass("playing")) {
            $nextBtn.addClass("disabled");
            $video.on('ended', function() {
                if($(".link:last").next().length === 0) {
                    $video[0].pause();
                    btnPlay.removeClass('paused');
                    // $(".link:last").addClass("playing")
                }
            });
        } else {
            $nextBtn.removeClass("disabled");
        }
    };

    //sound button clicked
    let $sound = $('.sound'),
        $volumeBar = $('.volumeBar');
    $sound.click(function() {
        $video[0].muted = !$video[0].muted;
        $(this).toggleClass('muted');
        if($video[0].muted) {
            $volumeBar.css('width',0);
        }
        else{
            $volumeBar.css('width', $video[0].volume*100+'%');
        }
    });

    //VIDEO PROGRESS BAR
    //when video timebar clicked
    let timeDrag = false;   /* check for drag event */
    $progress.mousedown(function(e) {
        timeDrag = true;
        updatebar(e.pageX);
    });
    $(document).mouseup(function(e) {
        if(timeDrag) {
            timeDrag = false;
            updatebar(e.pageX);
        }
    });
    $(document).mousemove(function(e) {
        if(timeDrag) {
            updatebar(e.pageX);
        }
    });

    let updatebar = function(x) {

        //calculate drag position and update video currenttime
        let maxduration = $video[0].duration;
        let position = x - $progress.offset().left;
        let percentage = 100 * position / $progress.width();
        if(percentage > 100) {
            percentage = 100;
        }
        if(percentage < 0) {
            percentage = 0;
        }
        $('.timeBar').css('width',percentage+'%');
        $video[0].currentTime = maxduration * percentage / 100;
    };
    //VOLUME BAR
    //volume bar event
    let volumeDrag = false,
        $volume = $('.volume');
    $volume.mousedown(function(e) {
        volumeDrag = true;
        $video[0].muted = false;
        $sound.removeClass('muted');
        updateVolume(e.pageX);
    });
    $(document).mouseup(function(e) {
        if(volumeDrag) {
            volumeDrag = false;
            updateVolume(e.pageX);
        }
    });
    $(document).mousemove(function(e) {
        if(volumeDrag) {
            updateVolume(e.pageX);
        }
    });
    let updateVolume = function(x, vol) {
        let percentage;
        //if only volume have specificed
        //then direct update volume
        if(vol) {
            percentage = vol * 100;
        } else {
            let position = x - $volume.offset().left;
            percentage = 100 * position / $volume.width();
        }

        if(percentage > 100) {
            percentage = 100;
        }
        if(percentage < 0) {
            percentage = 0;
        }

        //update volume bar and video volume
        $volumeBar.css('width', percentage+'%');
        $video[0].volume = percentage / 100;

        //change sound icon based on volume
        if($video[0].volume === 0){
            $sound.removeClass('sound2').addClass('muted');
        } else if($video[0].volume > 0.5){
            $sound.removeClass('muted').addClass('sound2');
        } else {
            $sound.removeClass('muted').removeClass('sound2');
        }
    };
    //light bulb button clicked
    $('.btnLight').click(function() {
        $(this).toggleClass('lighton');

        //if lightoff, create an overlay
        if(!$(this).hasClass('lighton')) {
            $('body').append('<div class="overlay"></div>');
            $('.overlay').css({
                'position':'absolute',
                'width':100 + '%',
                'height':$(document).height(),
                'background':'#000',
                'opacity':0.9,
                'top':0,
                'left':0,
                'z-index':999
            });
            $('.vidcontainer').css({
                'z-index':1000
            });
        }
        //if lighton, remove overlay
        else {
            $('.overlay').remove();
        }
    });
    //speed text clicked
    let $speedcnt = $("ul.speedcnt"),
        $dropdown = $(".dropdown")
    $('.spdx50').click(function() { fastfowrd(this, 1.5); });
    $('.spdx25').click(function() { fastfowrd(this, 1.25); });
    $('.spdx1').click(function() { fastfowrd(this, 1); });
    $('.spdx050').click(function() { fastfowrd(this, 0.5); });
    let fastfowrd = function(obj, spd) {
        $('.speedcnt li').removeClass('selected');
        $(obj).addClass('selected');
        $video[0].playbackRate = spd;
        $video[0].play();
        $speedcnt.fadeOut("fast");
        btnPlay.addClass('paused');
    };
    $(".btnspeed").click( function(e) {
        // $speedcnt.slideToggle(100);
        $dropdown.hide();
        let $menuItem = $(this).next($dropdown);
        $menuItem.slideToggle(100);
        $dropdown.not($menuItem).slideUp();

        e.preventDefault();
    });

    //quality text clicked
    // let $qualitycnt = $("ul.qualitycnt"),
    //     $fullHd = $('.fullHD'),
    //     $p720 = $('.p720'),
    //     $p360 = $('.p360');
    // let map = {'fullHD': '1080aaa','720p': '720aaa','360p': '360aaa'};
    //
    // $fullHd.click(function() { changeQ(this, 'fullHD'); });
    // $p720.click(function() { changeQ(this, 'p720'); });
    // $p360.click(function() { changeQ(this, 'p360'); });
    //
    // function changeQ(obj, quality) {
    //     $.each(playlist, function(key) {
    //         let $key = playlist[key];
    //
    //         $.each($key.file, function(keyInside) {
    //             // $liArr[key].attr({'data-val': $key.file[keyInside], 'class': 'link'})
    //             //     .text($key.name);
    //             // console.log(playlist[key].file[keyInside])
    //             $video.attr('data-val', $key.file[keyInside][quality]);
    //             console.log(quality)
    //         });
    //     });
    //
    //     $video.attr('data-val', map[quality]);
    //     console.log( $video.attr('data-val'));
    //
    //     $('.qualitycnt li').removeClass('selected');
    //     $(obj).addClass('selected');
    //     $qualitycnt.fadeOut("fast");
    // }
    // $(".btnQuality").click( function(e) {
    //     // $qualitycnt.slideToggle(100);
    //      $dropdown.hide();
    //     let $menuItem = $(this).next($dropdown);
    //     $menuItem.slideToggle(100);
    //     $dropdown.not($menuItem).slideUp();
    //
    //     e.preventDefault();
    // });

    //fullscreen button clicked
    $('.btnFS').click(function() {
        if($.isFunction($video[0].webkitEnterFullscreen)) {
            $video[0].webkitEnterFullscreen();
        } else if ($.isFunction($video[0].mozRequestFullScreen)) {
            $video[0].mozRequestFullScreen();
        } else {
            alert('Your browsers doesn\'t support fullscreen');
        }
    });

    //before everything get started
    $video.on('loadedmetadata', function() {
    //set video properties
        $('.current').text(timeFormat(0));
        $('.duration').text(timeFormat($video[0].duration));
        if($video[0].muted) {
            updateVolume(0, 0);
        } else {
            updateVolume(0 , 0.7);
        }
    });

    //Time format converter - 00:00
    let timeFormat = function(seconds) {
        let m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
        let s = Math.floor(seconds - (m * 60)) < 10 ? "0" + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
        return m + ":" + s;
    };
    //display current video play time
    $video.on('timeupdate', function () {
        let currentPos = $video[0].currentTime;
        let maxduration = $video[0].duration;
        let perc = 100 * currentPos / maxduration;
        $('.timeBar').css('width', perc + '%');
        $('.current').text(timeFormat(currentPos));
    });

// //VIDEO EVENTS
    //video canplay event
    // $video.on('canplay', function() {
    //     $('.loading').fadeOut(100);
    // });

    //
    // //video canplaythrough event
    // //solve Chrome cache issue
    // let completeloaded = false;
    // $video.on('canplaythrough', function() {
    //     completeloaded = true;
    // });
    //
    // //video seeking event
    // $video.on('seeking', function() {
    //     //if video fully loaded, ignore loading screen
    //     if(!completeloaded) {
    //         $('.loading').fadeIn(200);
    //     }
    // });
    //
    // //video seeked event
    // $video.on('seeked', function() { });
    //
    // //video waiting for more data event
    // $video.on('waiting', function() {
    //     $('.loading').fadeIn(200);
    // });

//display video buffering bar
//     var startBuffer = function() {
//         var currentBuffer = vid[0].buffered.end(0);
//         var maxduration = vid[0].duration;
//         var perc = 100 * currentBuffer / maxduration;
//         $('.bufferBar').css('width',perc+'%');
//
//         if(currentBuffer < maxduration) {
//             setTimeout(startBuffer, 500);
//         }
//     };

//end
});
