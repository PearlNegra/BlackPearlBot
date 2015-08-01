/*
 *               [BCS-2]
 *   Cause #1 just wasn't good enough
 *
 * Coded by Matheus Avellar ("Beta Tester")
 * Help with ideas from "DCV"
 *
 * Most of the stuff here is probably not
 * the most efficient. But it works. So who cares.
 *
 * FAQ @ [https://matheusavellar.github.io/bcs]
 *
 */

"use strict";

const BCS_DIR = "https://rawgit.com/MatheusAvellar/BCS/master/resources/";

$.getScript(BCS_DIR + "commands.js");
$.getScript(BCS_DIR + "menu.js");
$.getScript(BCS_DIR + "getUserInfo.js");
$.getScript(BCS_DIR + "badWordsList.js");
$.getScript(BCS_DIR + "gifs.js");

$("head").append(
"<link "
+    " rel='stylesheet' "
+    " type='text/css' "
+    " href='" + BCS_DIR + "styleSheet.css'"
+ ">"
);

var _console = {
    log: function () {
        var params = Array.prototype.slice.call(arguments, 1);
        if (arguments[0].length < 1000) {
            arguments[0] = JSON.stringify(arguments[0]);
            params.unshift("%cBCS%c ~ " + arguments[0],
                "color: #00bee8; font-weight: bold; font-size: 13px;",
                "color: black;");
            console.info.apply(console, params);
        }
    }
}

var bcs = {
    v: {
        "stage": "Alpha v",
        "ultra": "2",
        "major": "3",
        "minor": "7",
        "patch": "2",
        "legal": "",
        "_": function() {
            return [bcs.v.ultra, bcs.v.major, bcs.v.minor, bcs.v.patch].join('.');
        }
    },
    b: 4820534,
    u: API.getUser(),
    VIP: function() {  return bcs.b == bcs.u.id;  },
    c: function (msg) {  API.sendChat(msg);  },
    l: function (msg) {  API.chatLog(msg);  },
    settings: {
        /* Auto */
        autowoot: false,
        autograb: false,
        automeh: false,
        autojoin: false,
        autoleave: false,
        /* Logs */
        wootlog: false,
        grablog: false,
        mehlog: false,
        trafficlog: false,
        /* Misc */
        djupdates: false,
        afkmsg: false,
        unemojify: false,
        lockdown: false
    },
    plugCode: {
        IDs: {
            setRole: []
        },
        plugMessage: void(0),
        sendChat: void(0),
        sendChatObj: void(0),
        init: function () {
            bcs.plugCode.all = require.s.contexts._.defined;
            for (var i in bcs.plugCode.all) {
                if (typeof bcs.plugCode.all[i] != "undefined") {
                    if (bcs.plugCode.all[i].sendChat
                     && bcs.plugCode.all[i].imgRegex) {
                        bcs.plugCode.IDs.sendChat = i;
                        continue;
                    } else if (bcs.plugCode.all[i]["_events"] && bcs.plugCode.all[i]["_events"]["change:gRole"]) {
                        bcs.plugCode.IDs.setRole.push(i);
                    }
                    for (var j in bcs.plugCode.all[i]) {
                        if (j == "plugMessage") {
                            bcs.plugCode.IDs.plugMessage = i;
                            bcs.plugCode.plugMessage = bcs.plugCode.all[i][j];
                            continue;
                        }
                    }
                }
            }
            bcs.plugCode.sendChatObj = require(bcs.plugCode.IDs.sendChat);
            if (!bcs.plugCode.sendChatObj._sendChat) {
                bcs.plugCode.sendChatObj._sendChat = bcs.plugCode.sendChatObj.sendChat;
            }
            bcs.plugCode.sendChatObj.sendChat = function(message) {
                if (bcs.settings.unemojify) {
                    message = message.split(":)").join(":‌)")
                                    .split(":(").join(":‌(")
                                    .split(":D").join(":‌D")
                                    .split(":O").join(":‌O");
                }
                return bcs.plugCode.sendChatObj._sendChat.apply(this, [message]);
            }
        }
    },
    main: {
        init: function() {
            /* Gets plug code shortcut */
            bcs.plugCode.init();

            /* Hooks all events */
            bcs.main.events.hook();

            /* Starts old footer events */
            bcs.main.utils.oldFooter.init();

            /* Runs percentage on XP bar script */
            bcs.main.utils.percentage();

            /* Changes YT / SC max length on search to 256 characters */
            $("#search-input-field").attr({"maxlength": 256});

            /* Scrollable volume slider */
            $("#volume > .slider").on("mousewheel", function(e) {
                if (e.originalEvent.wheelDelta == 120) {
                    API.setVolume(API.getVolume() + 4);
                } else {
                    API.setVolume(API.getVolume() - 4);
                }
            });

            /* Popup chat bugs everything, so might as well remove everything */
            $("#chat-popout-button").on("click", function() {  $(".bcs-log").remove();  });

            /* Guests and Level 1s are people too */
            $("#header-panel-bar").removeClass("level-1");
            $("body").removeClass("is-guest");
            $("#footer-user .signup, #walkthrough, .wt-cover").remove();
            $("#app").attr("class", "");

            /* "The Spotify-ify" - Gorgeous Time Remaining Visualizer */
            $("div#now-playing-bar").prepend(
                "<div id='spotifyify-holder'>"
            +       "<div id='spotifyify-bar'></div>"
            +   "</div>");

            /* The following alters the looks of Author / Title */
            $("#now-playing-media .bar-value")[0].innerHTML =
                    $("#now-playing-media .bar-value")[0].innerHTML.split("</span> - ").join("</span>");

            /* Removes ignore button from rollover, adds staff */
            $("#audience, #dj-booth, .app-right").on("click", function() {
                $("#user-rollover").removeClass("can-ignore").addClass("can-staff");
            });

            /* */
            bcs.main.utils.points.sync();

            bcs.main.addChat(
                "BCS - "
                + bcs.v.stage
                + bcs.v._()
                + bcs.v.legal// TODO: Change this to <details>
                + "<div class='authors'>"
                    + "<br />"
                    + "<p>"
                       + "Coded by <i class='icon icon-chat-ambassador bcs-flip'></i> <a class='bcs-styles-gRole3' title='4820534' href='https://plug.dj/@/beta-tester' target='_blank'>Beta Tester</a><br />"
                       + "Help with ideas from <i class='icon icon-chat-subscriber'></i> <a class='bcs-styles-subscriber' title='3639711' href='https://plug.dj/@/dcv' target='_blank'>DCV</a><br />"
                       + "Initial addChat() from <i class='icon icon-chat-ambassador'></i> <a class='bcs-styles-gRole3' title='3420957' href='https://plug.dj/@/igor' target='_blank'>Igor</a>"
                    + "</p>"
                + "</div>",
                "_1",
                "init");
            $("div.bcs-log._1 .init").on("click", function() {
                $("div.bcs-log._1 .init .authors").toggleClass("visible");
            });
        },
        utils: {
            ajax: {
                delete: {
                    chat: function(_cid) {
                        $.ajax({
                            type: "DELETE",
                            contentType: "application/json",
                            url: "https://plug.dj/_/chat/" + _cid
                        });
                    },
                    waitList: function() {
                        $.ajax({
                            type: "DELETE",
                            contentType: "application/json",
                            url: "https://plug.dj/_/booth"
                        });
                    }
                },
                post: {
                    woot: function(_hid) {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "https://plug.dj/_/votes",
                            data: '{"direction": "1","historyID": "' + _hid + '"}'
                        }).done(function(msg) {
                            _console.log("@bcs.main.utils.ajax.post.woot [Status: " + JSON.stringify(msg.status) + "]");
                        });
                    },
                    meh: function(_hid) {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "https://plug.dj/_/votes",
                            data: '{"direction": "-1","historyID": "' + _hid + '"}'
                        }).done(function(msg) {
                            _console.log("@bcs.main.utils.ajax.post.meh [" + JSON.stringify(msg) + "]");
                        });
                    },
                    ban: function(_id, _dur) {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "https://plug.dj/_/bans/add",
                            data: '{"userID":' + _id + ',"reason":1,"duration":"' + _dur + '"}'
                        }).done(function(msg) {
                            _console.log("@bcs.main.utils.ajax.post.ban [" + JSON.stringify(msg) + "]");
                        });
                    },
                    mute: function(_id, _dur) {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "https://plug.dj/_/mutes",
                            data: '{"userID":'+ _id +',"reason":1,"duration":"' + _dur + '"}'
                        }).done(function(msg) {
                            _console.log("@bcs.main.utils.ajax.post.mute [" + JSON.stringify(msg) + "]");
                        });
                    },
                    staff: function(_id, _roleID) {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "https://plug.dj/_/staff/update",
                            data: '{"userID": ' + _id + ', "roleID": ' + _roleID + '}'
                        });
                    },
                    waitList: function() {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "https://plug.dj/_/booth"
                        });
                    },
                    grab: function(_playlist) {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "https://plug.dj/_/grabs",
                            data: '{"historyID": "' + bcs.main.utils.ajax.get.aux.historyID
                                + '", "playlistID": ' + _playlist + '}'
                        });
                    },
                    friend: function(_id) {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "https://plug.dj/_/friends",
                            data: '{"id": ' + _id + '}'
                        });
                    }
                },
                get: {
                    aux: {
                        historyID: "",
                        friendsList: [],
                        staffList: [],
                        user: "",
                        playlistIDs: []
                    },
                    historyID: function(_arg) {
                        $.ajax({
                            type: "GET",
                            contentType: "application/json",
                            url: "https://plug.dj/_/rooms/state",
                        }).done(function(msg) {
                            bcs.main.utils.ajax.get.aux.historyID = msg.data[0].playback.historyID;
                            if (_arg) {  (_arg)();  }
                        });
                    },
                    friends: function() {
                        $.ajax({
                            type: "GET",
                            contentType: "application/json",
                            url: "https://plug.dj/_/friends"
                        }).done(function(msg) {
                            bcs.main.utils.ajax.get.aux.friendsList = msg.data;
                        });
                    },
                    staff: function() {
                        $.ajax({
                            type: "GET",
                            contentType: "application/json",
                            url: "https://plug.dj/_/staff"
                        }).done(function(msg) {
                            bcs.main.utils.ajax.get.aux.staffList = msg.data;
                        });
                    },
                    playlists: function() {
                        $.ajax({
                            type: "GET",
                            contentType: "application/json",
                            url: "https://plug.dj/_/playlists"
                        }).done(function(msg) {
                            bcs.main.utils.ajax.get.aux.playlistIDs = msg.data;
                        });
                    },
                    user: function(_id) {
                        $.ajax({
                            type: "GET",
                            contentType: "application/json",
                            url: "https://plug.dj/_/users/" + id
                        }).done(function(user) {
                            bcs.main.utils.ajax.get.aux.user = msg.data;
                        });
                    }
                }
            },
            afkList: [],
            volume: function() {
                /* Fix for the volume bug */
                var currentVolume = $("#volume span").text().split('%')[0];
                var tempVolume = currentVolume != 0 ? 0 : 1;
                API.setVolume(tempVolume);
                setTimeout(function() {
                    API.setVolume(currentVolume);
                },1500);
            },
            percentage: function() {
                /* Removes previous percentages */
                $("div#footer-user .bcs-percentage").remove();

                var _width = $("div#footer-user .progress").attr("style");
                var _percentage = _width.substring(6, _width.indexOf('%') + 1).trim();
                $("div#footer-user .bar").append(
                    "<div class='bcs-percentage'>"
                    +   _percentage
                    +"</div>");
            },
            woot: function() {
                var _bAjax = bcs.main.utils.ajax;
                _bAjax.get.historyID(_bAjax.post.woot(_bAjax.get.aux.historyID));
            },
            meh: function() {
                var _bAjax = bcs.main.utils.ajax;
                _bAjax.get.historyID(_bAjax.post.meh(_bAjax.get.aux.historyID));
            },
            noperms: function() {
                bcs.main.addChat("lol u aint got the perms m8");
            },
            clearchat: function(_self) {
                if (!_self) {
                    if (bcs.u.role >= 2 || bcs.u.gRole >= 3) {
                        var _messageElements = $(".cm.message, .cm.emote, .cm.mention");
                        for (var i = 0; i < _messageElements.length; i++) {
                            for (var j = 0; j < _messageElements[i].classList.length; j++) {
                                if (!_messageElements[i].classList[j].indexOf("message")
                                ||  !_messageElements[i].classList[j].indexOf("emote")
                                ||  !_messageElements[i].classList[j].indexOf("mention")) {
                                    bcs.main.utils.ajax.delete.chat(_messageElements[i].getAttribute("data-cid"));
                                }
                            }
                        }
                        $(".cm.system:contains('Yes, delete it')").remove();
                    } else {

                    }
                } else {
                    if (bcs.u.role >= 2 && bcs.u.gRole < 3) {
                        var _messageElements = ".cm[data-cid^=" + bcs.u.id + "]";
                        for (var i in $(_messageElements)) {
                            if (!$($(_messageElements)[i]).attr("data-cid")) {  continue;  }
                            bcs.main.utils.ajax.delete.chat($($(_messageElements)[i]).attr("data-cid"));
                        }
                        //CHECK//
                        logged = [];
                    } else {
                        bcs.main.utils.noperms;
                    }
                }
            },
            scrollChat: function() {
                $("#chat-messages")[0].scrollTop = $("#chat-messages")[0].scrollHeight;
            },
            oldFooter: {
                toggle: function(_arg) {
                    var _footerButtons =
                        $("#footer-user .badge,"
                        + "#footer-user .store,"
                        + "#footer-user .profile,"
                        + "#footer-user .settings");

                    if (_arg == "hide" || $("#footer-user .badge").css("display") == "block") {
                        _footerButtons.hide();
                        $("#footer-user .info").removeClass("open");
                    } else {
                        _footerButtons.show();
                        $("#footer-user .info").addClass("open");
                    }
                },
                init: function() {
                    // So much jQuery :'D
                    $("#footer-user .bar").mouseenter(function() {
                        $("#footer-user .bcs-percentage")
                            .removeClass("isActive")
                            .addClass("isNotActive");
                        $("#footer-user .bar .value")
                            .addClass("isActive")
                            .removeClass("isNotActive");
                    });
                    $("#footer-user .bar").mouseleave(function() {
                        $("#footer-user .bcs-percentage")
                            .addClass("isActive")
                            .removeClass("isNotActive");
                        $("#footer-user .bar .value")
                            .removeClass("isActive")
                            .addClass("isNotActive");
                    });
                    $("#footer-user .info .meta .level .label").text("Lv.");

                    $("#footer-user .button").hover(function() {
                        $("#tooltip").remove();
                    });
                    $("#footer-user .badge").append("<div class='nothing'></div><span>My Badges</span>");
                    $("#footer-user .store").append("<div class='nothing'></div><span>Shop</span>");
                    $("#footer-user .profile").append("<div class='nothing'></div><span>My Profile</span>");
                    $("#footer-user .settings").append("<div class='nothing'></div><span>Settings</span>");
                    $("#footer-user .info").on("click", bcs.main.utils.oldFooter.toggle);
                    $("#footer-user .button").on("click", bcs.main.utils.oldFooter.toggle("hide"));
                    $("#app").on("click", function(e) {
                        if (!$(e.target).closest("#footer-user .info").length){
                            bcs.main.utils.oldFooter.toggle("hide");
                        }
                    });
                }
            },
            settings: {
                get: function() {
                    if (JSON.parse(localStorage.getItem("bcsSettings"))) {
                        bcs.settings = JSON.parse(localStorage.getItem("bcsSettings"));
                        for (var i in bcs.settings) {
                            if (bcs.settings[i] == true) {
                                _toggleSetting(i);
                            }
                        }
                    } else {
                        localStorage.setItem("bcsSettings", JSON.stringify(bcs.settings));
                    }
                },
                set: function() {
                    localStorage.setItem("bcsSettings", JSON.stringify(bcs.settings));
                }
            },
            points: {
                tick: void(0),
                sync: function() {
                    bcs.main.utils.points.prev.xp = API.getUser().xp;
                    bcs.main.utils.points.prev.pp = API.getUser().pp;
                    bcs.main.utils.points.tick = setTimeout(function() {  bcs.main.utils.points.foo();  }, 300000);
                },
                foo: function() {
                    var _xp = bcs.main.utils.points.prev.xp > 0 ? API.getUser().xp - bcs.main.utils.points.prev.xp : 0;
                    var _pp = bcs.main.utils.points.prev.pp > 0 ? API.getUser().pp - bcs.main.utils.points.prev.pp : 0;
                    bcs.main.utils.points.sync();

                    if (_xp > 0 || _pp > 0) {
                        var d = new Date();
                        var h = d.getHours();
                        var m = d.getMinutes();
                        var s = d.getSeconds();
                        if (h < 10) {  h = "0" + h;  }
                        if (m < 10) {  m = "0" + m;  }
                        if (s < 10) {  s = "0" + s;  }

                        var _earned;
                        if (_xp > 0 && _pp == 0) {       _earned = "+ " + _xp + " <b>XP</b>";  }
                        else if (_pp > 0 && _xp == 0) {  _earned = "+ " + _pp + " <b>PP</b>";  }
                        else if (_xp > 0 && _pp > 0) {
                            _earned = "+ " + _xp + " <b>XP</b> | + " + _pp + " <b>PP</b>";
                        }

                        bcs.main.addChat(
                            "<span>"
                            +    "<b>You just earned some points!</b><br />"
                            +    "<a class='bcs-timestamp'>"
                            +        _earned
                            +        " | " + h + ":" + m + ":" + s
                            +    "</a>"
                            +"</span>",
                            "bcs-pts-log");

                        _console.log("@bcs.main.utils.points.foo "
                            +    "[XP +" + _xp + " | PP +" + _pp + "]");
                    } else {
                        _console.log("@bcs.main.utils.points.foo [No points earned]");
                    }
                },
                prev: {
                    xp: 0,
                    pp: 0
                }
            },
            error: function(_message) {
                var d = new Date();
                var h = d.getHours();
                var m = d.getMinutes();
                var s = d.getSeconds();
                if (h < 10) {  h = "0" + h;  }
                if (m < 10) {  m = "0" + m;  }
                if (s < 10) {  s = "0" + s;  }
                bcs.main.addChat(
                    "<span>"
                    +    "<b>" + _message + "</b><br />"
                    +    "<a class='bcs-timestamp'>" + h + ":" + m + ":" + s + "</a>"
                    +"</span>"
                , "bcs-error-log");
            },
            isValidSong: function() {
                if (API.getMedia()) {
                    const _format = API.getMedia().format;
                    const _cid = API.getMedia().cid;
                    if (_format == 1){
                        $.getJSON(
                             "https://www.googleapis.com/youtube/v3/videos"
                             + "?id=" + _cid
                             + "&key=AIzaSyDcfWu9cGaDnTjPKhg_dy9mUh6H7i4ePZ0"
                             + "&part=snippet"
                             + "&callback=?",
                            function (_track){
                                if (typeof(_track.items[0]) == "undefined"){
                                    return bcs.main.utils.error("This song might be unavailable!");
                                }
                            }
                        );
                    } else {
                        const checkSong = SC.get("/tracks/" + _cid, function (_track){
                            if (typeof _track.title === "undefined"){
                                return bcs.main.utils.error("This song might be unavailable!");
                            }
                        });
                    }
                }
            },
            ran: function() {
                return "bcs-" + (~~(Math.random() * 1e8)).toString(16);
            },
            rem: function(_id) {
                if ($('#' + _id).parent().attr("id") != "chat-messages") {
                    $('#' + _id).parent().hover(function() {
                        $('#' + _id).css({"display":"block"});
                    }, function() {
                        $('#' + _id).css({"display":"none"});
                    });

                    $('#' + _id).on("click", function() {
                        $('#' + _id).parent().remove();
                    });
                }
            },
            canRespond: true
        },
        addChat: function(_text, _class1, _class2) {
            if (!_class1 || _class1 == "undefined") {  _class1 = "";  }
            if (!_class2 || _class2 == "undefined") {  _class2 = "";  }

            var _scroll = $("#chat-messages")[0].scrollTop > $("#chat-messages")[0].scrollHeight - $("#chat-messages").height() - 28;
            
            var _r = bcs.main.utils.ran();

            $("#chat-messages").append(
                "<div class='bcs-log " + _class1 + "'>"
                +    "<div class='delete-button bcs-rem' id='" + _r + "'>Remove</div>"
                +    "<div class='" + _class2 + "'>" + _text + "</div>"
                +"</div>");

            bcs.main.utils.rem(_r);

            if (_scroll) {
                $("#chat-messages")[0].scrollTop = $("#chat-messages")[0].scrollHeight;
            }
            if ($("#chat-messages").children().length > 512) {  $("#chat-messages").children().first().remove();  }
        },
        events: {
            hook: function() {
                API.on(API.CHAT,             bcs.main.events.onChat);
                API.on(API.VOTE_UPDATE,      bcs.main.events.onVote);
                API.on(API.GRAB_UPDATE,      bcs.main.events.onVote);
                API.on(API.USER_JOIN,        bcs.main.events.onJoin);
                API.on(API.ADVANCE,          bcs.main.events.onAdvance);
                API.on(API.WAIT_LIST_UPDATE, bcs.main.events.onWaitListUpdate);
                API.on(API.USER_LEAVE,       bcs.main.events.onLeave);
                API.on(API.CHAT_COMMAND,     bcs.main.events.onCommand);
            },
            unhook: function() {
                API.off(API.CHAT,            bcs.main.events.onChat);
                API.off(API.VOTE_UPDATE,     bcs.main.events.onVote);
                API.off(API.GRAB_UPDATE,     bcs.main.events.onVote);
                API.off(API.USER_JOIN,       bcs.main.events.onJoin);
                API.off(API.ADVANCE,         bcs.main.events.onAdvance);
                API.off(API.WAIT_LIST_UPDATE,bcs.main.events.onWaitListUpdate);
                API.off(API.USER_LEAVE,      bcs.main.events.onLeave);
                API.off(API.CHAT_COMMAND,    bcs.main.events.onCommand);
            },
            onChat: function(data) {
                var t = data.type;
                if (t == "message" || t == "emote" || t == "mention") {
                    var _cid = data.cid;
                    var _msg = data.message;
                    var _time = data.timestamp;
                    var _user;
                    for (var i = 0, u = API.getUsers(); i < u.length; i++) {
                        if (u[i].username == data.un) {
                            _user = u[i];
                            break;
                        }
                    }
                    
                    if (bcs.settings.lockdown && !_user.role && !_user.gRole
                    || bcs.settings.superlockdown && !_user.gRole) {
                        bcs.main.utils.ajax.delete.chat(_cid);
                    } else {
                        //CHECK// Do with others
                        _console.log("@bcs.main.events.onChat "
                            + "[" + _time + "] "
                            + "[" + _cid + "] "
                            + "[" + _user.id + "] "
                            + "[" + _user.username + "] "
                            + _msg
                        );

                        setTimeout(function() {
                            if (bcs.settings.afkmsg) {
                                $("div#chat-input").addClass("bcs-afk");
                                if (bcs.main.utils.afkList.length > 0) {
                                    $("div#bcs-afk-notif").css({"display":"block"}).text(bcs.main.utils.afkList.length);
                                } else {
                                    $("div#bcs-afk-notif").css({"display":"none"});
                                }
                            } else {
                                $("div#chat-input").removeClass("bcs-afk");
                            }
                        }, 500);

                        if (t == "mention" && bcs.settings.afkmsg) {
                            if (bcs.VIP() && bcs.main.utils.canRespond) {
                                bcs.c(
                                    "[AFK] @"
                                    + _user.username
                                    + " \"Beta is busy right now\", says Beta, explaining the situation"
                                );
                                bcs.main.utils.canRespond = false;
                            } else if (bcs.main.utils.canRespond) {
                                bcs.c(
                                    "[AFK] @"
                                    + _user.username
                                    + " I'm busy at the moment! Sorry!"
                                );
                                bcs.main.utils.canRespond = false;
                            }

                            bcs.main.utils.afkList.push({
                                "cid": _cid,
                                "user": _user.username,
                                "id": _user.id,
                                "time": _time,
                                "message": _msg
                            });

                            setTimeout(function() {
                                bcs.main.utils.canRespond = true;
                            }, 120000);
                        }

                        if (_user.id == bcs.u.id
                        && bcs.u.role >= 2
                        || _user.id == bcs.u.id
                        && bcs.u.gRole >= 3) {
                            _console.log("@bcs.main.events.onChat Appended [Delete Button]");
                            $("#chat-messages > .cm[data-cid='" + _cid + "']").prepend(
                                "<div class='delete-button'>Delete</div>"
                            );
                            $("#chat-messages > .cm[data-cid='" + _cid + "'] .delete-button").on("click", function() {
                                bcs.main.utils.ajax.delete.chat(_cid);
                                $("#chat-messages > .cm[data-cid='" + _cid + "'] .delete-button").remove();
                            });
                        }

                        $("#chat-messages > .cm[data-cid='" + _cid + "'] .from").append(
                            "<span class='bcs-chat-info'> Lv. <a class='bcs-chat-lv'>" + _user.level + "</a></span>"
                            + "<span class='bcs-chat-info'> ID: <a class='bcs-chat-id'>" + _user.id + "</a></span>");

                        $("#chat-messages > .cm[data-cid='" + _cid + "']").hover(function() {
                            $("#chat-messages > .cm[data-cid='" + _cid + "'] .from .bcs-chat-info").css({
                                "opacity":"1"
                            });

                            $("#chat-messages > .cm[data-cid='" + _cid + "'] .delete-button").css({
                                "display":"block"
                            });
                        }, function() {
                            $("#chat-messages > .cm[data-cid='" + _cid + "'] .from .bcs-chat-info").css({
                                "opacity":"0.2"
                            });

                            $("#chat-messages > .cm[data-cid='" + _cid + "'] .delete-button").css({
                                "display":"none"
                            });
                        });

                        const _path = "#chat-messages > .cm .text.cid-" + _cid;
                        const _h = $(_path)[0].innerHTML;
                        var _msgBW = _msg;
                        for (var i = 0; i < badWords.length; i++) {
                            _msgBW = _msgBW.replace(
                                new RegExp("\\b" + badWords[i] + "(er|ing|ed|s|in)?\\b", "ig"),
                                "<a class='bcs-bw-word'>\$&</a>"
                            );
                            $(_path)[0].innerHTML = _h.replace(_msg, _msgBW);
                            $(_path).parent().addClass("bcs-bw-msg");
                        }

                        // BOOTLEG INLINE IMAGES HYPE //
                        //CHECK//
                        const _extensions = [".png", ".gif", ".jpg", ".jpeg", ".webm"];

                        var _messageContent = $(
                            $(".cid-" + _cid + " a")[$("div#chat-messages .cid-" + _cid + " a").length - 1]
                        ).text();

                        var _hasNotBeenChecked = _msg.indexOf(_messageContent) != -1;

                        for (var i = 0; i < _extensions.length; i++) {
                            const _isImage = _messageContent.indexOf(_extensions[i]) != -1;

                            if (_messageContent != "" && _hasNotBeenChecked && _isImage) {

                                var _imageLink = $(
                                    $("div#chat-messages .cid-" + _cid + " a")
                                        [$("div#chat-messages .cid-" + _cid + " a").length - 1]
                                ).text();

                                _imageLink = _imageLink
                                    .replace("http", "https")
                                    .replace("httpss", "https")
                                    .replace(".gifv", ".gif")
                                    .replace(".webm", ".gif");

                                $.ajax({
                                    type: "GET",
                                    contentType: "application/json",
                                    url: _imageLink,
                                    success: function(msg) {
                                        _console.log("@bcs.main.events.onChat " + JSON.stringify(msg));
                                        var _willScroll = "";
                                        var _chat = $("#chat-messages");
                                        if (_chat[0].scrollTop > _chat[0].scrollHeight - _chat.height() - 28) {
                                            _willScroll = "onload='setTimeout("
                                                    +       "function() {"
                                                    +           "bcs.main.utils.scrollChat();"
                                                    +       "}, 500);' ";
                                        }
                                        var _message = $("div#chat-messages .cid-" + _cid + " a");
                                        $(_message[_message.length - 1]).append(
                                                "<br />"
                                                +   "<img "
                                                +     _willScroll
                                                +     "class='bcs-chat-image' "
                                                +     "src='" + _imageLink + "' "
                                                +   "/>"
                                                +"<br />");
                                    },
                                    error: function(msg) {
                                        _console.log("@bcs.main.events.onChat " + JSON.stringify(msg));
                                    }
                                });
                                break;
                            }
                        }
                    }
                }
            },
            onVote: function(data) {
                var d = new Date();
                var h = d.getHours();
                var m = d.getMinutes();
                var s = d.getSeconds();
                if (h < 10) {  h = "0" + h;  }
                if (m < 10) {  m = "0" + m;  }
                if (s < 10) {  s = "0" + s;  }
                var userName = data.user.username.split('<').join("&lt;").split('>').join("&gt;");
                if (bcs.settings.mehlog && data.vote == -1) {
                    bcs.main.addChat(
                    "<div>"
                    +    "<i class='icon icon-meh'></i>"
                    +    "<span class='bcs-vote-log' username='" + userName + "'>"
                    +        "<b>" + userName + "</b> meh'ed this"
                    +        "<br />"
                    +        "<a class='bcs-timestamp'>ID " + data.user.id + " | " + h + ":" + m + ":" + s + "</a>"
                    +    "</span>"
                    +"</div>", "bcs-meh-log");
                } else if (bcs.settings.wootlog && data.vote == 1) {
                    bcs.main.addChat(
                    "<div>"
                    +    "<i class='icon icon-woot'></i>"
                    +    "<span class='bcs-vote-log' username='" + userName + "'>"
                    +        "<b>" + userName + "</b> woot'ed this"
                    +        "<br />"
                    +        "<a class='bcs-timestamp'>ID " + data.user.id + " | " + h + ":" + m + ":" + s + "</a>"
                    +    "</span>"
                    +"</div>", "bcs-woot-log");
                } else if (bcs.settings.grablog && !data.vote) {
                    bcs.main.addChat(
                    "<div>"
                    +    "<i class='icon icon-grab'></i>"
                    +    "<span class='bcs-vote-log' username='" + userName + "'>"
                    +        "<b>" + userName + "</b> grabbed this"
                    +        "<br />"
                    +        "<a class='bcs-timestamp'>ID " + data.user.id + " | " + h + ":" + m + ":" + s + "</a>"
                    +    "</span>"
                    +"</div>","bcs-grab-log");
                }
            },
            onJoin: function(data) {
                if (bcs.settings.trafficlog) {
                    var _user = {
                        username: data.username.split('<').join("&lt;").split('>').join("&gt;"),
                        color: data.friend ? "#B6A2FF" : "#0699DD",
                        intro: data.friend ? "Your friend " : "",
                        id: data.id,
                        level: data.level,
                        role: "",
                        gRole: ""
                    }
                    var _class = data.friend ? "bcs-friendJoin-log" : "bcs-userJoin-log";

                    var d = new Date();
                    var h = d.getHours();
                    var m = d.getMinutes();
                    var s = d.getSeconds();
                    if (h < 10) {  h = "0" + h;  }
                    if (m < 10) {  m = "0" + m;  }
                    if (s < 10) {  s = "0" + s;  }

                    var _bcs_tmp = "<a class='bcs-timestamp'>";

                    switch (data.role) {
                        case 0:
                            _user.role = ""; break;
                        case 1:
                            _user.role = _bcs_tmp
                            + " | <a class='bcs-styles-lRole'>RDJ</a> " + _bcs_tmp + " (1)</a>";     break;
                        case 2:
                            _user.role = _bcs_tmp
                            + " | <a class='bcs-styles-lRole'>Bouncer</a> " + _bcs_tmp + " (2)</a>"; break;
                        case 3:
                            _user.role = _bcs_tmp
                            + " | <a class='bcs-styles-lRole'>Manager</a> " + _bcs_tmp + " (3)</a>"; break;
                        case 4:
                            _user.role = _bcs_tmp
                            + " | <a class='bcs-styles-lRole'>CoHost</a> " + _bcs_tmp + " (4)</a>";  break;
                        case 5:
                            _user.role = _bcs_tmp
                            + " | <a class='bcs-styles-lRole'>Host</a> " + _bcs_tmp + " (5)</a>";    break;
                    }

                    switch (data.gRole) {
                        case 3:
                            _user.gRole = _bcs_tmp
                            + " | <a class='bcs-styles-gRole3'>BA</a> " + _bcs_tmp + " (3)</a>";    break;
                        case 5:
                            _user.gRole = _bcs_tmp
                            + " | <a class='bcs-styles-gRole5'>Admin</a> " + _bcs_tmp + " (5)</a>"; break;
                        default:
                            _user.gRole = ""; break;
                    }

                    bcs.main.addChat(
                        "<span>"
                        +    _user.intro
                        +    "<b>"
                        +        _user.username
                        +    "</b> joined </a><br />"
                        +    "<a class='bcs-timestamp'>"
                        +        "<b>ID</b> " +        _user.id
                        +        " | " + h + ":" + m + ":" + s
                        +        " | <b>Level</b> " + _user.level
                        +"</span> "
                        + _user.role + " "
                        + _user.gRole, _class);
                }
            },
            onLeave: function(data) {
                if (bcs.settings.trafficlog) {
                    var _user = {
                        username: data.username.split('<').join("&lt;").split('>').join("&gt;"),
                        color: data.friend ? "#B6A2FF" : "#39589A",
                        intro: data.friend ? "Your friend " : "",
                        id: data.id,
                        level: data.level,
                        role: "",
                        gRole: ""
                    }
                    var _class = data.friend ? "bcs-friendLeave-log" : "bcs-userLeave-log";

                    var d = new Date();
                    var h = d.getHours();
                    var m = d.getMinutes();
                    var s = d.getSeconds();
                    if (h < 10) {  h = "0" + h;  }
                    if (m < 10) {  m = "0" + m;  }
                    if (s < 10) {  s = "0" + s;  }

                    var _bcs_tmp = "<a class='bcs-timestamp'>";

                    switch (data.role) {
                        case 0:
                            _user.role = ""; break;
                        case 1:
                            _user.role = _bcs_tmp
                            + " | <a class='bcs-styles-lRole'>RDJ</a> " + _bcs_tmp + " (1)</a>";     break;
                        case 2:
                            _user.role = _bcs_tmp
                            + " | <a class='bcs-styles-lRole'>Bouncer</a> " + _bcs_tmp + " (2)</a>"; break;
                        case 3:
                            _user.role = _bcs_tmp
                            + " | <a class='bcs-styles-lRole'>Manager</a> " + _bcs_tmp + " (3)</a>"; break;
                        case 4:
                            _user.role = _bcs_tmp
                            + " | <a class='bcs-styles-lRole'>CoHost</a> " + _bcs_tmp + " (4)</a>";  break;
                        case 5:
                            _user.role = _bcs_tmp
                            + " | <a class='bcs-styles-lRole'>Host</a> " + _bcs_tmp + " (5)</a>";    break;
                    }

                    switch (data.gRole) {
                        case 3:
                            _user.gRole = _bcs_tmp
                            + " | <a class='bcs-styles-gRole3'>BA</a> " + _bcs_tmp + " (3)</a>";    break;
                        case 5:
                            _user.gRole = _bcs_tmp
                            + " | <a class='bcs-styles-gRole5'>Admin</a> " + _bcs_tmp + " (5)</a>"; break;
                        default:
                            _user.gRole = ""; break;
                    }

                    bcs.main.addChat(
                        "<span>"
                        +    _user.intro
                        +    "<b>"
                        +        _user.username
                        +    "</b> left </a><br />"
                        +    "<a class='bcs-timestamp'>"
                        +        "<b>ID</b> " +        _user.id
                        +        " | " + h + ":" + m + ":" + s
                        +        " | <b>Level</b> " + _user.level
                        +"</span> "
                        + _user.role + " "
                        + _user.gRole, _class);
                }
            },
            onAdvance: function(data) {
                bcs.main.utils.volume();
                bcs.main.utils.percentage();
                bcs.main.utils.ajax.get.historyID();
                bcs.main.utils.ajax.get.staff();
                bcs.main.utils.ajax.get.playlists();
                bcs.main.events.onWaitListUpdate();
                var currentSong = API.getMedia();
                $("#now-playing-media .bar-value")[0].innerHTML =
                    $("#now-playing-media .bar-value")[0].innerHTML.split("</span> - ").join("</span>");

                setTimeout(function() {
                    $("div#spotifyify-bar").addClass("reset");
                    setTimeout(function() {
                        var _timeRemaining = API.getTimeRemaining() - 1;
                        $("div#spotifyify-bar").removeClass("reset").css({
                            "transition": "width " + _timeRemaining + "s linear",
                            "width": "100%"
                        });
                    }, 100);

                    if (bcs.settings.autowoot) {
                        bcs.main.utils.woot();
                    } else if (bcs.settings.automeh) {
                        bcs.main.utils.meh();
                    }

                    if (bcs.settings.autograb) {
                        for (var i = 0; i < bcs.main.utils.ajax.get.aux.playlistIDs.length; i++) {
                            if (bcs.main.utils.ajax.get.aux.playlistIDs[i].active) {
                                bcs.main.utils.ajax.post.grab(
                                    bcs.main.utils.ajax.get.aux.playlistIDs[i].id
                                );
                                break;
                            }
                        }
                    }
                    bcs.main.utils.isValidSong();
                }, 1750);

                var d = new Date();
                var h = d.getHours();
                var m = d.getMinutes();
                var s = d.getSeconds();
                if (h < 10) {  h = "0" + h;  }
                if (m < 10) {  m = "0" + m;  }
                if (s < 10) {  s = "0" + s;  }

                if (bcs.settings.djupdates) {
                    var _logLength = $(".cm.log").length;
                    bcs.l(" ");
                    for (var i = _logLength; i < $(".cm.log").length; i++) {
                        // Yes, this is pretty stupid. But whatever. Script is mine, get rekt :L
                        $(".cm.log")[i].remove();
                    }

                    bcs.main.addChat(
                        "<div class='item positive'>"
                        +     "<i class='icon icon-history-positive'></i>"
                        +     "<span>" + data.lastPlay.score.positive + "</span>"
                        + "</div>"
                        + "<div class='item grabs'>"
                        +     "<i class='icon icon-history-grabs'></i>"
                        +     "<span>" + data.lastPlay.score.grabs + "</span>"
                        + "</div>"
                        + "<div class='item negative'>"
                        +     "<i class='icon icon-history-negative'></i>"
                        +     "<span>" + data.lastPlay.score.negative + "</span>"
                        + "</div>"
                        + "<div class='item listeners'>"
                        +     "<i class='icon icon-history-listeners'></i>"
                        +     "<span>" + API.getUsers().length + "</span>"
                        + "</div>"
                        + "<br />", "", "bcs-lastplay");

                    setTimeout(function() {
                        for (var i = 0, l = API.getHistory().length; i < l; i++) {
                            if (API.getHistory()[i].media.cid == currentSong.cid && i != 0) { //CHECK//
                                var previous = API.getHistory()[i];
                                var pos = i + 1;
                                var stats = previous.user.username + " (ID " + previous.user.id + ")";
                                _console.warn(
                                    "Song in History | Played by " + stats
                                    + "<br />(History position " + pos + ")<br />[" + previous.media.title + "]"
                                );
                                badoop.play();//CHECK//
                                bcs.main.addChat(
                                    "<a style='color:#ff3535; font-weight:bold;'>Song in History</a><br />Played by "
                                    + stats + " - (History position " + pos + ")"
                                    + "<br />[" + previous.media.title + "]","#D04545",true);
                                break;
                            }
                        }
                    }, 250);
                    var hoursLong = "";
                    var minutesLong = Math.floor(currentSong.duration / 60);
                    var secondsLong = currentSong.duration % 60;

                    if (minutesLong >= 60){
                        hoursLong = Math.floor(minutesLong / 60);
                        minutesLong = minutesLong % 60;
                    };
                    if (hoursLong != "") {  hoursLong = hoursLong + ":";  };
                    if (secondsLong < 10) {  secondsLong = "0" + secondsLong;  }
                    if (minutesLong < 10) {  minutesLong = "0" + minutesLong;  }
                    var actuallength = hoursLong + minutesLong + ":" + secondsLong;
                    if (bcs.settings.djupdates) {
                        if (currentSong.duration > 480) {
                            //CHECK//
                            badoop.play();
                            bcs.main.addChat(
                                "<b><a style='color:#ff3535;'>Song is over 8 minutes</a></b><br />"
                                + " Song length: " + actuallength,"#D04545",true);
                        }
                    }
                    //CHECK//
                    bcs.main.addChat(
                        "<a class='bcs-now-playing-heading'>Now playing:</a>"
                        + "<a class='bcs-now-playing-body'>" + data.media.title + " - " + data.media.author + "</a>"
                        + "<a class='bcs-now-playing-heading'>Song length:</a> "
                        + "<a class='bcs-now-playing-body'>" + actuallength + "</a>"
                        + "<a class='bcs-now-playing-heading'>Current DJ:</a> "
                        + "<a class='bcs-now-playing-body'>" + data.dj.username + " (ID " + data.dj.id + ")" + "</a>",
                        "", "bcs-now-playing");
                }
            },
            onWaitListUpdate: function() {
                if (bcs.settings.autojoin) {
                    var dj = API.getDJ();
                    if (API.getWaitListPosition() <= -1 && dj.username != bcs.u.username) {
                        bcs.main.utils.ajax.post.waitList();
                        setTimeout(function(){
                            if (API.getWaitListPosition() <= -1 && dj.username != bcs.u.username) {
                                bcs.main.utils.ajax.post.waitList();
                            }
                        },100);
                        setTimeout(function(){
                            if (API.getWaitListPosition() <= -1 && dj.username != bcs.u.username) {
                                bcs.main.utils.ajax.post.waitList();
                            }
                        },250);
                    }
                } else if (bcs.settings.autoleave) {
                    if (API.getWaitListPosition() != -1) {
                        bcs.main.utils.ajax["delete"].waitList();
                    }
                }
            },
            onCommand: function(data) {
                var command = data.substring(1).split(' ');

                if (typeof command[2] != "undefined") {
                    for (var k = 2; k < command.length; k++) {
                        command[1] = command[1] + " " + command[k];
                    }
                }

                if (typeof command[1] == "undefined") {
                    command[1] = "";
                }

                _console.log("@bcs.main.events.onCommand [COMMAND] " + command[0] + " || [ARGUMENT] " + command[1]);

                for (var i = 0, listSize = _commands.list.length; i < listSize; i++) {
                    for (var j = 0, cmdSize = _commands.list[i].cmd.length; j < cmdSize; j++) {
                        if (command[0] == _commands.list[i].cmd[j]) {
                            _commands.list[i].run(command[1], command[0]);
                        }
                    }
                }
            }
        }
    }
}

bcs.main.init();
