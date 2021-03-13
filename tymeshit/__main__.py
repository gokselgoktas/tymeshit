import bottle
import math
import os
import time

from bottle import error, request, route, run, static_file, template

from calendar import Calendar, monthrange
from datetime import datetime
from hashlib import sha384
from pathlib import Path
from random import Random, random

ROOT = Path(__file__).resolve().parent
NONCE = sha384(str(time.time()).encode("utf-8")).hexdigest()

TIME = ["\U0001f55b", "\U0001f550", "\U0001f55C", "\U0001f551", "\U0001F55D"]


def calculate_number_of_working_hours_in_month(month, year, fakery):
    month = int(month)

    if month not in range(1, 13):
        return None

    year = int(year)
    date_and_time = datetime.now()

    if year not in range(date_and_time.year - 1, date_and_time.year + 5):
        return None

    fakery = float(fakery)

    if fakery < 0.0 or fakery > 1.0:
        return None

    calendar = Calendar()
    number_of_working_hours = 0.0

    for day in calendar.itermonthdays2(year, month):
        if day[0] == 0 or day[1] >= 5:
            continue

        number_of_working_hours += 7.5

    return number_of_working_hours + fakery * 15


@route("/")
def serve_html():
    date_and_time = datetime.now()

    return template(
        "html",
        uri=request.url,
        nonce=NONCE,
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
    return static_file(filename, root=ROOT.joinpath("static-data", "svg"), mimetype="image/svg+xml")


@route(r"/static-data/png/<filename:re:.*\.png>")
def serve_png(filename):
    return static_file(filename, root=ROOT.joinpath("static-data", "png"), mimetype="image/png")


@route(r"/generate/inline-google-docs-string", method="POST")
def generate_inline_google_docs_string():
    month = int(request.POST.month) + 1
    year = int(request.POST.year)

    fakery = float(request.POST.fakery) * 0.1

    is_working_on_the_weekends = False  # TODO
    number_of_working_hours_required = calculate_number_of_working_hours_in_month(month, year, fakery)

    if number_of_working_hours_required is None:
        return None

    calendar = Calendar()
    data = []

    last_day_of_month = monthrange(year, month)[1]

    for day in calendar.itermonthdays2(year, month):
        if day[0] == 0:
            continue

        working_hours = round((7.5 + 7.5 * fakery * (2.0 * random() - 1.0)) * 2.0) * 0.5

        is_last_working_day = number_of_working_hours_required - working_hours <= 0
        is_month_ending_near_friday = last_day_of_month - day[0] <= 2 and day[1] == 4

        if (not is_working_on_the_weekends and day[1] >= 5) or number_of_working_hours_required == 0:
            data.append("0")
            continue
        elif is_last_working_day == True or is_month_ending_near_friday == True:
            working_hours = round(number_of_working_hours_required * 2.0) * 0.5

        data.append("{0:0.2f}".format(round(working_hours, 2)))
        number_of_working_hours_required -= working_hours

    # TODO: add data massaging support
    return '=transpose(split("{0}", ","))'.format(",".join(data))


@route(r"/generate/pdf")
def generate_pdf():
    pass


if __name__ == "__main__":
    bottle.TEMPLATE_PATH = [ROOT.joinpath("templates")]

    if "HEROKU" in os.environ:
        run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    else:
        run(host="localhost", port=8080)
