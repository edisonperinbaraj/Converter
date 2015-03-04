$(function () {
    $(".toptool").tooltip({
        position: {
            my: "center bottom-20",
            at: "center top",
            using: function (position, feedback) {
                $(this).css(position);
                $("<div>")
.addClass("arrow")
.addClass(feedback.vertical)
.addClass(feedback.horizontal)
.appendTo(this);
            }
        }
    });
});

$(function () {
    $(".bottomtool").tooltip({
        position: {
            my: "center top+20",
            at: "center bottom",
            using: function (position, feedback) {
                $(this).css(position);
                $("<div>")
.addClass("arrow")
.addClass(feedback.vertical)
.addClass(feedback.horizontal)
.appendTo(this);
            }
        }
    });
});

$(function () {
    $(".icon-pdf").tooltip({
        position: {
            my: "center bottom-20",
            at: "center top",
            using: function (position, feedback) {
                $(this).css(position);
                $("<div>")
.addClass("arrow")
.addClass(feedback.vertical)
.addClass(feedback.horizontal)
.appendTo(this);
            }
        }
    });
});

$(function () {
    $(".icon-pdf").tooltip({
        position: {
            my: "center bottom-20",
            at: "center top",
            using: function (position, feedback) {
                $(this).css(position);
                $("<div>")
.addClass("arrow")
.addClass(feedback.vertical)
.addClass(feedback.horizontal)
.appendTo(this);
            }
        }
    });
});