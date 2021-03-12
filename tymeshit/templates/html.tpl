<!DOCTYPE html>
<html lang="en" class="h-100">

<head>
    <meta charset="utf-8">

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="Bestest and noicest tymeshit managme'nt ting evar">
    <meta name="author" content="Tymeshit Pipol">

    <link rel="canonical" href="{{uri}}">
    <link rel="preconnect" href="https://fonts.gstatic.com">

    <link rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💩</text></svg>">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css" rel="stylesheet"
        crossorigin="anonymous">

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,700;1,700&display=swap"
        rel="stylesheet">

    <link href="{{uri}}static-data/css?{{nonce}}" rel="stylesheet">

    <title>Tymeshit</title>
</head>

<body class="min-vw-100 min-vh-100 m-0 p-0 overflow-hidden">
    <div id="side-panel" class="d-block position-fixed top-0 h-100 m-0">
        <div class="container-fluid">
            <div class="row">
                <h1>C<i class="bi bi-gear-fill"></i>nfiguration</h1>
            </div>

            <div class="row">
                <div class="col col-xs-4 col-md-4 col-lg-4 m-0 p-0">
                    <label for="month-2c7b26"><span class="emoji calendar">📅</span>Month</label>
                </div>

                <div class="col col-xs-8 col-md-8 col-lg-8 m-0 p-0">
                    <input id="month-2c7b" class="month" type="range" min="0" max="11" step="1">
                </div>
            </div>

            <div class="row">
                <div class="col col-xs-4 col-md-4 col-lg-4 m-0 p-0">
                    <label for="year-8bae"><span class="emoji calendar">📅</span>Year</label>
                </div>

                <div class="col col-xs-8 col-md-8 col-lg-8 m-0 p-0">
                    <input id="year-8bae" class="year" type="range" min="{{minimum_year_value}}"
                        max="{{maximum_year_value}}" step="1">
                </div>
            </div>

            <div class="vertical-space"></div>

            <div class="row">
                <div class="col col-xs-4 col-md-4 col-lg-4 m-0 p-0">
                    <label for="fakery-8c4e"><span class="emoji smiley">🙂</span>Fakery</i>
                </div>

                <div class="col col-xs-8 col-md-8 col-lg-8 m-0 p-0">
                    <input id="fakery-8c4e" class="fakery" type="range" min="0" max="9" step="1" value="3">
                </div>
            </div>

            <div class="vertical-space"></div>

            <div class="row">
                <div class="col col-xs-12 col-md-12 col-lg-12 m-0 p-0 text-end">
                    <button type="submit" class="btn btn-lg"><span class="emoji check-mark">✔️</span></button>
                </div>
            </div>
        </div>
    </div>

    <div id="container" class="container-fluid m-0 p-3">
        <header class="m-0 p-0">
            <nav class="navbar navbar-dark m-0 p-0">
                <div class="container-fluid m-0 p-0">
                    <button class="navbar-brand navbar-toggler m-0 p-0 border-0 shadow-none" href="{{uri}}">
                        <h1><span class="time">{{time_emoji}}</span><span class="pile-of-poo">💩</span></h1>
                    </button>
                </div>
            </nav>
        </header>

        <content class="container-fluid d-flex m-0 p-0">
            <div class="col col-xs-12 col-md-12 col-lg-12 m-0 p-0">
                <div class="row row-xs-6 row-md-6 row-lg-6 h-50 m-0 p-0">
                    <span class="month m-0 p-0 text-center typography"></span>
                </div>

                <div class="row row-xs-6 row-md-6 row-lg-6 h-50 m-0 p-0">
                    <span class="year m-0 p-0 text-center typography"></span>
                </div>
            </div>
        </content>
    </div>

    <canvas class="position-absolute top-0 left-0 w-100 h-100"></canvas>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0"
        crossorigin="anonymous"></script>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

    <script src="https://unpkg.com/zdog@1/dist/zdog.dist.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>

    <script src="{{uri}}static-data/js?{{nonce}}"></script>
</body>

</html>
