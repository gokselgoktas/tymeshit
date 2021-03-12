import bottle
import math
import time

from bottle import error, request, route, run, static_file, template

from calendar import Calendar
from datetime import datetime
from hashlib import sha384
from pathlib import Path
from random import Random

ROOT = Path(__file__).resolve().parent
NONCE = sha384(str(time.time()).encode("utf-8")).hexdigest()

TIME = ["\U0001f55b", "\U0001f550", "\U0001f55C", "\U0001f551", "\U0001F55D"]


def get_time_as_unicode_emoji(time):
    one_o_clock = ord("\N{CLOCK FACE ONE OCLOCK}")

    hour_offset = (time.hour - 1) % 12
    half_an_hour_offset = round(time.minute * 0.033333333333333)

    hour_offset += max(0, half_an_hour_offset - 1)
    half_an_hour_offset %= 2

    code_point = one_o_clock + hour_offset + 12 * half_an_hour_offset

    return chr(code_point)


@route("/")
def serve_html():
    date_and_time = datetime.now()

    return template(
        "html",
        uri=request.url,
        nonce=NONCE,
        time_emoji=get_time_as_unicode_emoji(date_and_time),
        minimum_year_value=date_and_time.year - 1,
        maximum_year_value=date_and_time.year + 4,
    )


@route("/static-data/css")
def serve_css():
    return static_file("tymeshit.css", root=ROOT.joinpath("static-data", "css"))


@route("/static-data/js")
def serve_js():
    return static_file("tymeshit.js", root=ROOT.joinpath("static-data", "js"))


@route(r"/static-data/svg/<filename:re:.*\.svg>")
def serve_svg(filename):
    print(filename)
    return static_file("confetti-doodles.svg", root=ROOT.joinpath("static-data", "svg"), mimetype="image/svg+xml")


if __name__ == "__main__":
    bottle.TEMPLATE_PATH = [ROOT.joinpath("templates")]

    run(host="localhost", port=8080)
