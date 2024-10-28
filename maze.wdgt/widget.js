ack.module("ack.widget", function (b) {
  b.sounds = {};
  b.init = function () {
    ack.tools.background({
      paddingCallback: function (a, c, e) {
        a = a.replace("padding-", "");
        if (
          "top" === a &&
          (__settings__.scoring.show_distance ||
            __settings__.scoring.show_prize)
        )
          e = b.numToPx(b.pxToNum(e + b.pxToNum(__settings__.scoring.height)));
        $("#ack-widget-inner").css(a, e);
      },
    });
    ack.tools.background({
      supportsPadding: !1,
      element: $("#win"),
      backgroundKey: "complete.image",
      backgroundCssKey: "complete.image_css",
    });
    b.sounds.prize = new ack.tools.Audio(
      __settings__.prize.sound
    ).loadOnNextInteraction();
    b.sounds.complete = new ack.tools.Audio(
      __settings__.complete.sound
    ).loadOnNextInteraction();
    ack.ui.common.bindTap($("#win"), function () {
      $("#win").fadeOut(500);
    });
    var a = $("#board");
    $(window).resize(function () {
      var b = a.parent().height(),
        c = a.height();
      a.css("margin-top", Math.max(0, (b - c) / 2) + "px");
    });
    var g = $("<span>" + ack.lang("Restart") + "</span>");
    ack.ui.common.bindTap(g, b.reset);
    ack.ui.toolbar.addToolbarItem(g.get(0));
    if (__settings__.scoring.show_distance || __settings__.scoring.show_prize)
      ack.tools.styles.addRule(
        "#scoring",
        ack.tools.styles.generateStyle(
          "background-color",
          __settings__.scoring.bar_colour
        )
      ),
        ack.tools.styles.addRule(
          "#scoring",
          ack.tools.styles.generateStyle(
            "height",
            b.numToPx(__settings__.scoring.height)
          )
        ),
        ack.tools.styles.addRule(
          "#scoring",
          ack.tools.styles.generateStyle(
            "line-height",
            b.numToPx(__settings__.scoring.height)
          )
        ),
        ack.tools.styles.addRule("#scoring", __settings__.scoring.bar_font);
    !0 !== __settings__.scoring.show_distance &&
      $("#scoring .travelled").remove();
    !0 !== __settings__.scoring.show_prize && $("#scoring .prize").remove();
    __settings__.scoring.prize_text &&
      $("#scoring .prize .ack-lang").text(__settings__.scoring.prize_text);
    __settings__.scoring.distance_text &&
      $("#scoring .travelled .ack-lang").text(
        __settings__.scoring.distance_text
      );
    b.reset();
  };
  b.pxToNum = function (a) {
    return "string" === typeof a ? parseFloat(a.replace("px", "")) : a;
  };
  b.numToPx = function (a) {
    return "string" === typeof a && 0 < a.indexOf("px") ? a : a + "px";
  };
  b.gameComplete = function () {
    ack.book.history.markCompleted();
    $("#win").fadeIn(500, function () {
      __settings__.complete.can_share &&
        b.toImage(function (b) {
          a(b);
        });
    });
    b.sounds.complete.play(0);
  };
  b.setTravelled = function (a) {
    a = parseFloat(a);
    a = Math.round(a);
    $("#scoring .travelled .value").text(a);
  };
  b.setPrize = function (a, g) {
    g = void 0 === g ? !0 : g;
    $("#scoring .prize .value").text(a);
    g && b.sounds.prize.play(0);
  };
  b.reset = function () {
    b.setTravelled(0);
    b.setPrize(0, !1);
    $("#win").is(":visible") && $("#win").fadeOut(500);
    ack.widget.maze.init(function (a) {
      $("#board").width(a.width()).height(a.height());
      $(window).resize();
      ack.widget.prizes.init(function () {
        ack.widget.target.init(function () {
          ack.widget.player.init(function () {});
        });
      });
    });
  };
  b.toImage = function (a) {
    ack.ui.rc.hide();
    b.maze.toImage(function (g) {
      b.player.toImage(function (d) {
        b.prizes.toImage(function (b) {
          var e = $("<canvas></canvas>"),
            f = e.get(0).getContext("2d");
          e.attr({
            height: ack.widget.numToPx(ack.widget.maze.height()),
            width: ack.widget.numToPx(ack.widget.maze.width()),
          });
          f.fillStyle = __settings__.export_image_background_color;
          f.fillRect(0, 0, ack.widget.maze.width(), ack.widget.maze.height());
          $("<img />")
            .attr("src", b)
            .load(function () {
              f.drawImage(this, 0, 0);
              $("<img />")
                .attr("src", g)
                .load(function () {
                  f.drawImage(this, 0, 0);
                  $("<img />")
                    .attr("src", d)
                    .load(function () {
                      f.drawImage(this, 0, 0);
                      a(e.get(0).toDataURL());
                    });
                });
            });
        });
      });
    });
  };
  var a = function (a) {
    var b = {};
    b[ack.ui.rc.share.Formats.EMAIL] = {
      prefilledTo: (ack.comms.auth.details() || {}).email,
      prefilledSubject: ack.lang("I've completed a maze!"),
      assets: [a],
    };
    b[ack.ui.rc.share.Formats.TWITTER] = {
      prefilledMessage: ack.lang("I've completed a maze!"),
      assets: [a],
    };
    b[ack.ui.rc.share.Formats.FACEBOOK] = {
      prefilledMessage: ack.lang("I've completed a maze!"),
      assets: [a],
    };
    b[ack.ui.rc.share.Formats.EVERNOTE] = { assets: [a] };
    ack.ui.rc.share.selection(
      ack.lang("Share your maze solving skills"),
      ack.lang("Do you want to share your completed maze with friends?"),
      b,
      function (b, c) {
        var e = "",
          f = "",
          h = "";
        switch (b) {
          case ack.ui.rc.share.Formats.EMAIL:
            e = "email.send";
            f = ack.lang("All done!");
            h = ack.lang("The email has been sent");
            break;
          case ack.ui.rc.share.Formats.TWITTER:
            e = "twitter.tweet";
            f = ack.lang("All done!");
            h = ack.lang("The tweet has been sent");
            break;
          case ack.ui.rc.share.Formats.FACEBOOK:
            e = "facebook.post";
            f = ack.lang("All done!");
            h = ack.lang("Your status has been updated");
            break;
          case ack.ui.rc.share.Formats.EVERNOTE:
            (e = "evernote.save"),
              (f = ack.lang("All done!")),
              (h = ack.lang("This has been saved to your notebook"));
        }
        var g = ack.ui.loading.show();
        c.assets = [a];
        ack.comms.request(
          e,
          c,
          function () {
            ack.ui.loading.hide(g);
            ack.ui.dialog.alert(f, h);
            ack.ui.rc.hide();
          },
          function (a, b) {
            ack.ui.loading.hide(g);
            ack.ui.rc.common.serverCommsFail({ response: a, status: b });
          },
          { successAlert: { title: f, message: h } }
        );
      }
    );
  };
});
ack.module("ack.widget.prizes", function (b) {
  var a;
  b.reset = function () {
    a && a.empty();
    a = null;
  };
  b.init = function (g) {
    b.reset();
    a = $("#prizes");
    for (var d = __settings__.maze.prizes, c = 0; c < d.length; c++) {
      var e = $("<img />");
      e.attr({ src: d[c].image, "data-index": c, class: "prize" }).css({
        height: ack.widget.numToPx(d[c].height),
        width: ack.widget.numToPx(d[c].width),
        left: ack.widget.numToPx(d[c].x),
        top: ack.widget.numToPx(d[c].y),
      });
      a.append(e);
    }
    g(b);
  };
  b.intersectsPrize = function (b, d, c, e) {
    b += c / 2;
    d += e / 2;
    e = a.children().filter(":not(.claimed)");
    for (c = 0; c < e.length; c++) {
      var f = $(e[c]),
        h = __settings__.maze.prizes[parseInt(f.attr("data-index"))],
        j = ack.widget.pxToNum(h.x),
        i = ack.widget.pxToNum(h.x) + ack.widget.pxToNum(h.width),
        l = ack.widget.pxToNum(h.y),
        m = ack.widget.pxToNum(h.y) + ack.widget.pxToNum(h.height);
      if (b > j && b < i && d > l && d < m)
        return f.addClass("claimed"), f.fadeOut(200), parseInt(h.value);
    }
    return 0;
  };
  var k = function (a, b, c, e) {
    if (c >= b.length) e();
    else {
      var f = $("<img />"),
        h = $(b.get(c)),
        j = __settings__.maze.prizes[parseInt(h.attr("data-index"))];
      f.css({
        height: ack.widget.numToPx(j.height),
        width: ack.widget.numToPx(j.width),
      })
        .attr("src", j.image)
        .load(function () {
          a.drawImage(
            this,
            ack.widget.pxToNum(j.x),
            ack.widget.pxToNum(j.y),
            ack.widget.pxToNum(j.width),
            ack.widget.pxToNum(j.height)
          );
          c++;
          k(a, b, c, e);
        });
    }
  };
  b.toImage = function (b) {
    var d = $("<canvas></canvas>"),
      c = d.get(0).getContext("2d");
    d.attr({
      height: ack.widget.numToPx(ack.widget.maze.height()),
      width: ack.widget.numToPx(ack.widget.maze.width()),
    });
    var e = a.children().filter(":not(.claimed)");
    k(c, e, 0, function () {
      b(d.get(0).toDataURL());
    });
  };
});
ack.module("ack.widget.player", function (b) {
  var a = {};
  b.width = function () {
    return a.width;
  };
  b.height = function () {
    return a.height;
  };
  b.x = function () {
    return a.x;
  };
  b.y = function () {
    return a.y;
  };
  b.travelled = function () {
    return a.travelled;
  };
  b.reset = function () {
    a.tickTO && clearInterval(a.tickTO);
    a = {
      width: null,
      height: null,
      x: null,
      y: null,
      player: null,
      path: null,
      travelled: 0,
      prize: 0,
      tickTO: null,
    };
  };
  b.init = function (d) {
    b.reset();
    a.player = $("#player");
    a.path = $("#path");
    a.height = ack.widget.pxToNum(__settings__.player.height);
    a.width = ack.widget.pxToNum(__settings__.player.width);
    a.x = ack.widget.pxToNum(__settings__.maze.start.x);
    for (
      a.y = ack.widget.pxToNum(__settings__.maze.start.y);
      ack.widget.maze.intersectsWall(a.x, a.y, a.width, a.height);

    ) {
      if (20 > a.width || 20 > a.height)
        if (ack.widget.maze.intersectsWall(a.x, a.y, a.width, a.height)) {
          a.x += 2;
          a.y += 2;
          continue;
        } else break;
      a.height -= 2;
      a.width -= 2;
      a.x += 1;
      a.y += 1;
    }
    a.player.attr("src", __settings__.player.image);
    a.player.css({
      height: ack.widget.numToPx(a.height),
      width: ack.widget.numToPx(a.width),
    });
    g();
    a.path.attr({
      width: ack.widget.numToPx(ack.widget.maze.width()),
      height: ack.widget.numToPx(ack.widget.maze.height()),
    });
    a.tickTO = setInterval(k, 10);
    d(b);
  };
  var k = function () {
      if (!1 !== ack.widget.target.isAttracting()) {
        var b = ack.widget.target.x(),
          c = ack.widget.target.y();
        if (!isNaN(b) && !isNaN(c)) {
          var e = a.x,
            f = a.y,
            h = e - b,
            j = f - c,
            i = a.x,
            l = a.y,
            e = 5 < Math.abs(h) ? e + (0 < h ? -5 : 5) : b,
            f = 5 < Math.abs(j) ? f + (0 < j ? -5 : 5) : c,
            b = !1;
          ack.widget.maze.intersectsWall(e, a.y, a.width, a.height) ||
            ((a.x = e), (b = !0));
          ack.widget.maze.intersectsWall(a.x, f, a.width, a.height) ||
            ((a.y = f), (b = !0));
          if (
            b &&
            ((e = a),
            (f = a.travelled),
            (b = a.y),
            (h = c = 0),
            (c = a.x - i),
            (h = b - l),
            (b = Math.sqrt(c * c + h * h)),
            (e.travelled = f + b),
            ack.widget.setTravelled(a.travelled),
            g(),
            (e = a.x),
            (f = a.y),
            __settings__.path.draw &&
              ((b = a.path.get(0).getContext("2d")),
              b.beginPath(),
              b.moveTo(
                i + ack.widget.player.width() / 2,
                l + ack.widget.player.height() / 2
              ),
              b.lineTo(
                e + ack.widget.player.width() / 2,
                f + ack.widget.player.height() / 2
              ),
              (b.lineWidth = ack.widget.pxToNum(__settings__.path.width)),
              (b.strokeStyle = __settings__.path.colour),
              (b.lineCap = "round"),
              b.stroke()),
            ack.widget.maze.intersectsEnd(a.x, a.y, a.width, a.height) &&
              (clearInterval(a.tickTO), ack.widget.gameComplete()),
            (i = ack.widget.prizes.intersectsPrize(
              a.x,
              a.y,
              a.width,
              a.height
            )),
            0 !== i)
          )
            (a.prize += i), ack.widget.setPrize(a.prize);
        }
      }
    },
    g = function () {
      a.player.css({
        top: ack.widget.numToPx(a.y),
        left: ack.widget.numToPx(a.x),
      });
    };
  b.toImage = function (d) {
    var c = $("<canvas></canvas>"),
      e = c.get(0).getContext("2d");
    c.attr({
      height: ack.widget.numToPx(ack.widget.maze.height()),
      width: ack.widget.numToPx(ack.widget.maze.width()),
    });
    var f = a.path.get(0).toDataURL(),
      h = $("<img />"),
      g = $("<img />"),
      i = __settings__.player;
    h.attr("src", f).load(function () {
      e.drawImage(this, 0, 0);
      g.attr("src", i.image)
        .css({
          height: ack.widget.numToPx(i.height),
          width: ack.widget.numToPx(i.width),
        })
        .load(function () {
          e.drawImage(
            this,
            ack.widget.pxToNum(b.x()),
            ack.widget.pxToNum(b.y()),
            ack.widget.pxToNum(i.width),
            ack.widget.pxToNum(i.height)
          );
          d(c.get(0).toDataURL());
        });
    });
  };
});
ack.module("ack.widget.maze", function (b) {
  var a, k, g, d, c;
  b.width = function () {
    return a;
  };
  b.height = function () {
    return k;
  };
  b.reset = function () {
    d = g = k = a = null;
    c = void 0;
  };
  b.init = function (e) {
    b.reset();
    g = $("#maze");
    d = g.get(0).getContext("2d");
    c = $("#maze-end");
    c.css({
      width: ack.widget.numToPx(__settings__.maze.end.width),
      height: ack.widget.numToPx(__settings__.maze.end.height),
      top: ack.widget.numToPx(__settings__.maze.end.y),
      left: ack.widget.numToPx(__settings__.maze.end.x),
    }).attr("src", __settings__.maze.end.image);
    var f = $('<img src="' + __settings__.maze.map + '" />');
    f.css("display", "none");
    f.load(function () {
      $(document.body).append(f);
      a = f.width();
      k = f.height();
      f.remove();
      g.attr({ width: a + "px", height: k + "px" });
      d.drawImage(this, 0, 0);
      e(b);
    });
  };
  b.intersectsWall = function (a, b, c, g) {
    if (0 > a || 0 > b) return !0;
    a = d.getImageData(a, b, c, g).data;
    for (b = 0; b < 4 * c * g; b += 4) if (0 != a[b + 3]) return !0;
    return !1;
  };
  b.intersectsEnd = function (a, b, c, d) {
    var a = a + c / 2,
      b = b + d / 2,
      d = ack.widget.pxToNum(__settings__.maze.end.x),
      c =
        ack.widget.pxToNum(__settings__.maze.end.x) +
        ack.widget.pxToNum(__settings__.maze.end.width),
      g = ack.widget.pxToNum(__settings__.maze.end.y),
      l =
        ack.widget.pxToNum(__settings__.maze.end.y) +
        ack.widget.pxToNum(__settings__.maze.end.height);
    return a > d && a < c && b > g && b < l ? !0 : !1;
  };
  b.toImage = function (a) {
    var c = $("<canvas></canvas>"),
      d = c.get(0).getContext("2d");
    c.attr({
      height: ack.widget.numToPx(b.height()),
      width: ack.widget.numToPx(b.width()),
    });
    var j = g.get(0).toDataURL(),
      i = $("<img />"),
      l = $("<img />"),
      m = __settings__.maze.end;
    i.attr("src", j).load(function () {
      d.drawImage(this, 0, 0);
      l.attr("src", m.image)
        .css({
          height: ack.widget.numToPx(m.height),
          width: ack.widget.numToPx(m.width),
        })
        .load(function () {
          d.drawImage(
            this,
            ack.widget.pxToNum(m.x),
            ack.widget.pxToNum(m.y),
            ack.widget.pxToNum(m.width),
            ack.widget.pxToNum(m.height)
          );
          a(c.get(0).toDataURL());
        });
    });
  };
});
ack.module("ack.widget.target", function (b) {
  var a, k, g, d, c;
  b.x = function () {
    return a - ack.widget.player.width() / 2;
  };
  b.y = function () {
    return k - ack.widget.player.height() / 2;
  };
  b.isAttracting = function () {
    return g;
  };
  b.reset = function () {
    d &&
      (d.unbind("touchstart mousedown", e),
      d.unbind("touchmove mousemove", f),
      d.unbind("touchend mouseup", h));
    d = c = k = a = null;
    g = !1;
  };
  b.init = function (l) {
    b.reset();
    c = $("#player");
    d = $("#interaction");
    a = ack.widget.player.x() + ack.widget.player.width() / 2;
    k = ack.widget.player.y() + ack.widget.player.height() / 2;
    d.bind("touchstart mousedown", e);
    d.bind("touchmove mousemove", f);
    d.bind("touchend mouseup", h);
    l(b);
  };
  var e = function (a) {
      a.preventDefault();
      a.stopPropagation();
      if (i(a)) {
        var b = void 0,
          d = ack.widget.player.width(),
          e = ack.widget.player.height(),
          f = c.position(),
          b = b || j(a),
          a = f.left - d,
          d = f.left + c.width() + 2 * d,
          h = f.top - e,
          e = f.top + c.height() + 2 * e;
        b.x > a && b.x < d && b.y > h && b.y < e && (g = !0);
      }
    },
    f = function (b) {
      b.preventDefault();
      b.stopPropagation();
      i(b) &&
        g &&
        ((b = j(b)),
        (b.x = Math.max(0, b.x)),
        (b.x = Math.min(b.x, ack.widget.maze.width())),
        (b.y = Math.max(0, b.y)),
        (b.y = Math.min(b.y, ack.widget.maze.height())),
        (a = b.x),
        (k = b.y));
    },
    h = function (a) {
      a.preventDefault();
      a.stopPropagation();
      g = !1;
    },
    j = function (a) {
      var b = d.offset();
      if (0 <= a.type.indexOf("mouse"))
        return { x: a.pageX - b.left, y: a.pageY - b.top };
      if (0 <= a.type.indexOf("touch"))
        return {
          x: a.originalEvent.touches[0].pageX - b.left,
          y: a.originalEvent.touches[0].pageY - b.top,
        };
    },
    i = function (a) {
      return 0 <= a.type.indexOf("touch")
        ? 1 === a.originalEvent.touches.length
        : !0;
    };
});
