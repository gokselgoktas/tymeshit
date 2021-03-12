var ILLUSTRATION = {
    x: 0.0,
    y: 0.0,

    scale: 1.0,
};

var ANIMATION_CONTROLLER = {
    anchorRotation: Math.PI * 0.1,

    shadowTranslation: 50.0,

    pupilRotation: 0.0,
    mouthScale: 0.8,

    cloudTranslation: 500.0,

    emoji: '🥱',
}

$.fn.getTextMetrics = function (text, fontSize = '16px') {
    if (typeof $.fn.getTextMetrics.element === typeof undefined) {
        $.fn.getTextMetrics.element = $('<span class="typography">').hide().appendTo(document.body);
    }

    $.fn.getTextMetrics.element.text(text || this.val() || this.text()).css('font-size', fontSize || '16px');

    return {
        fontSize: fontSize,

        width: $.fn.getTextMetrics.element.width(),
        height: $.fn.getTextMetrics.element.height(),
    };
}

$.fn.fitText = function (textMetrics) {
    if (typeof textMetrics === typeof undefined) {
        textMetrics = this.getTextMetrics();
    }

    const x = this.width() / textMetrics.width;
    const y = this.height() / textMetrics.height;

    const selector = ($(window).width() - 576.0) / 992.0;
    const weight = interpolate(0.85, 0.75, saturate(selector));

    const scalar = Math.min(x, y) * weight;

    const css = `calc(${textMetrics.fontSize} * ${scalar})`;

    return this.css('font-size', css);
}

function clamp(value, minimum, maximum) {
    return Math.min(Math.max(minimum, value), maximum);
}

function saturate(value) {
    return clamp(value, 0.0, 1.0);
}

function interpolate(from, to, offset) {
    return from * (1.0 - offset) + to * offset;
}

function getPixelColor(context, x, y) {
    let imageData = context.getImageData(x, y, 1, 1);
    let data = imageData.data;

    return `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
}

function adjustContentHeight() {
    const header = $('header');
    const content = $('content');

    const css = `calc(100vh - ${2.0 * Math.ceil(header.height())}px)`;

    content.height(css);
}

function adjustDisplaySize() {
    $('#container .month').fitText();
    $('#container .year').fitText();
}

function adjustCanvasSize() {
    const canvas = $('canvas')[0];

    const width = $(window).innerWidth();
    const height = $(window).innerHeight();

    canvas.width = width;
    canvas.height = height;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
}

function setDisplayData(month, year) {
    const fields = {
        month: $('#container .month'),
        year: $('#container .year'),
    };

    const date = new Date();

    if (typeof month !== typeof undefined) {
        date.setMonth(month);
    } else {
        $('#side-panel .month').val(date.getMonth());
    }

    if (typeof year !== typeof undefined) {
        date.setFullYear(year);
    } else {
        $('#side-panel .year').val(date.getFullYear());
    }

    const displayData = {
        month: date.toLocaleDateString('default', { month: 'long' }),
        year: date.getFullYear(),
    };

    fields.month.text(displayData.month);
    fields.year.text(displayData.year);

    fields.month.fitText();
    fields.year.fitText();
}

function createClearLoop() {
    const canvas = $('canvas');
    const context = canvas[0].getContext('2d');

    const clear = () => {
        context.clearRect(0, 0, canvas.width(), canvas.height());

        requestAnimationFrame(clear);
    }

    clear();
}

function generateRandomCourse(particle) {
    const angle = anime.random(0.0, 360.0) * Math.PI / 180;

    const distance = anime.random(45.0, 180.0);
    const radius = [-1.0, 1.0][anime.random(0, 1)] * distance;

    return {
        x: particle.x + radius * Math.cos(angle),
        y: particle.y + radius * Math.sin(angle)
    }
}

function createParticle(x, y) {
    const colors = ['#ff1461', '#18ff92', '#5a87ff', '#fbf38c'];

    var particle = {
        x: x,
        y: y,

        radius: anime.random(16.0, 32.0),

        color: colors[anime.random(0, colors.length - 1)],
    };

    particle.course = generateRandomCourse(particle);

    particle.render = (context) => {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0.0, 2.0 * Math.PI, true);

        context.fillStyle = particle.color;
        context.fill();
    }

    return particle;
}

function createInteractions() {
    anime.set('.pile-of-poo', { translateX: '-50%' });

    const jump = anime({
        targets: '.pile-of-poo',

        autoplay: false,
        loop: true,

        scaleY: [
            { value: 0.9, duration: 170.0 },
            { value: 1.0, duration: 170.0, delay: 120.0 }
        ],

        translateY: [
            { value: -20.0, duration: 170.0, delay: 170.0 },
            { value: 0.0, duration: 170.0, delay: 220.0 }
        ],

        easing: 'linear',

        loopComplete: function (instance) {
            if (instance.shouldPauseOnLoopCompletion === true) {
                instance.pause();
                instance.shouldPauseOnLoopCompletion = false;
            }
        }
    });

    const movement = anime({
        targets: ILLUSTRATION,

        duration: 500.0,
        delay: 250.0,

        autplay: false,
        loop: false,

        x: [500.0, 0.0],

        easing: 'easeInOutQuint',
    });

    $('.navbar-brand').hover(
        () => { jump.shouldPauseOnLoopCompletion = false; jump.play() },
        () => { jump.shouldPauseOnLoopCompletion = true; }
    );

    const sidePanel = $('#side-panel');
    const container = $('#container');

    const toggleSidePanel = () => {
        sidePanel.toggleClass('pushed-into-view');
        container.toggleClass('pushed-aside');

        movement.reverse();
        movement.play();
    }

    $('.navbar-brand').click(
        () => {
            toggleSidePanel();
            jump.shouldPauseOnLoopCompletion = true;
        }
    );

    const canvas = $('canvas');
    const context = canvas[0].getContext('2d');

    const spawnParticles = (eventData) => {
        const x = eventData.clientX || eventData.touches[0].clientX;
        const y = eventData.clientY || eventData.touches[0].clientY;

        const particles = [];

        for (var i = 0; i < anime.random(25, 50); ++i) {
            particles.push(createParticle(x, y));
        }

        anime({
            targets: particles,

            duration: anime.random(1200.0, 1800.0),

            x: (particle) => { return particle.course.x; },
            y: (particle) => { return particle.course.y; },

            radius: 0.0,

            easing: 'easeOutExpo',

            update: (animation) => {
                for (var i = 0; i < animation.animatables.length; ++i) {
                    animation.animatables[i].target.render(context);
                }
            },

            complete: (animation) => {
                animation.remove();
            }
        });
    }

    $('.navbar-brand').mousedown((eventData) => {
        spawnParticles(eventData);
    });

    let isCloudAnimationPlaying = false;

    const spawnCloud = () => {
        anime.set(ANIMATION_CONTROLLER, { cloudTranslation: 500.0, emoji: '🥱' })

        anime({
            targets: ANIMATION_CONTROLLER,

            keyframes: [
                {
                    cloudTranslation: -160.0,
                    emoji: '🥱',

                    easing: 'easeOutExpo',
                    duration: 500.0,
                },

                {
                    cloudTranslation: -160.0,
                    emoji: '📋',

                    duration: 500.0,
                },

                {
                    cloudTranslation: -160.0,
                    emoji: '👍',

                    duration: 500.0,
                },

                {
                    cloudTranslation: -160.0,
                    emoji: '👋',

                    duration: 250.0,
                },

                {
                    cloudTranslation: 500.0,
                    emoji: '👋',

                    easing: 'easeInExpo',
                    duration: 500.0,
                },
            ],

            begin: () => {
                isCloudAnimationPlaying = true;
            },

            complete: (animation) => {
                animation.remove();
                isCloudAnimationPlaying = false;
            }
        });
    }

    $(document).mousedown((eventData) => {
        if (isCloudAnimationPlaying === true) {
            return;
        }

        let x = eventData.clientX || eventData.touches[0].clientX;
        let y = eventData.clientY || eventData.touches[0].clientY;

        const width = $(document).width();
        const height = $(document).height();

        x = x - width + 130.0 * ILLUSTRATION.scale;
        y = y - height + 120.0 * ILLUSTRATION.scale;

        const radius = 125.0 * ILLUSTRATION.scale;

        if (Math.sqrt(x * x + y * y) < radius) {
            spawnParticles(eventData);
            spawnCloud();
        }
    });

    const month = $('#side-panel .month');
    const year = $('#side-panel .year');

    const fakery = $('#side-panel .fakery');
    const smiley = $('#side-panel .emoji.smiley');

    month.on('input change', function () {
        setDisplayData($(this).val(), year.val());
    });

    year.on('input change', function () {
        setDisplayData(month.val(), $(this).val());
    });

    fakery.on('input change', function () {
        const smilies = ['😇', '🤭', '😅', '🙂', '😐', '🤫', '😏', '😉', '😜', '😈']

        smiley.text(smilies[$(this).val()]);
    });

    const submit = $('#side-panel button');

    submit.mousedown((eventData) => {
        spawnParticles(eventData);

        toggleSidePanel();
    });
}

function createIllustration() {
    const scene = new Zdog.Anchor();

    const shadow = new Zdog.Ellipse({
        addTo: scene,

        diameter: 100.0,

        stroke: false,
        fill: true,

        color: '#863027',

        translate: { x: 50.0, y: 100.0 },
        rotate: { x: Math.PI * 0.6 },
    });

    const anchor = new Zdog.Anchor({
        addTo: scene,

        translate: { y: 100.0 },
        rotate: { z: Math.PI * 0.1 },
    });

    const body = new Zdog.Group({
        addTo: anchor,

        translate: { x: -70.0, y: -170.0 },
    });

    new Zdog.Shape({
        addTo: body,

        path: [
            { x: 0.0, y: 45.0 },
            { x: 45.0, y: 45.0 },
            { x: 70.0, y: 0.0 },
            { x: 95.0, y: 45.0 },
            { x: 140.0, y: 45.0 },
            { x: 105.0, y: 80.0 },
            { x: 120.0, y: 130.0 },
            { x: 70.0, y: 105.0 },
            { x: 20.0, y: 130.0 },
            { x: 35.0, y: 80.0 },
            { x: 0.0, y: 45.0 },
        ],

        stroke: 40.0,
        color: '#ffff77',
    });

    new Zdog.Rect({
        addTo: body,

        width: 40.0,
        height: 50.0,

        stroke: 40.0,
        color: '#ffff77',

        translate: { x: 70.0, y: 70.0 },
    });

    const eyes = new Zdog.Group({
        addTo: body,

        translate: { x: 70.0, y: 72.5, z: 20.0 },
    });

    const leftEye = new Zdog.Ellipse({
        addTo: eyes,

        diameter: 5.0,

        stroke: 15.0,
        color: 'hsl(0.0, 0%, 0%)',

        translate: { x: -32.5 },
    });

    leftEye.copy({
        translate: { x: 32.5 },
    });

    const leftPupil = new Zdog.Anchor({
        addTo: eyes,

        translate: { x: -32.5, z: 0.5 },
    });

    new Zdog.Ellipse({
        addTo: leftPupil,

        diameter: 1.0,

        stroke: 5.0,
        color: 'hsl(0.0, 100%, 100%)',

        translate: { x: -3.5 },
    });

    const rightPupil = leftPupil.copyGraph({
        translate: { x: 32.5, z: 0.5 },
    });

    const mouth = new Zdog.Anchor({
        addTo: body,

        translate: { x: 70.0, y: 95.0, z: 20.0 },
        scale: 0.8,
    });

    new Zdog.Shape({
        addTo: mouth,

        path: [
            { x: -8.0, y: 0.0 },
            { x: 8.0, y: 0.0 },
            {
                arc: [
                    { x: 4.0, y: 6.0 },
                    { x: 0.0, y: 6.0 },
                ],
            },
            {
                arc: [
                    { x: -4.0, y: 6.0 },
                    { x: -8.0, y: 0.0 },
                ],
            },
        ],

        stroke: 10.0,
        color: 'hsl(358, 100%, 65%)',
    });

    const cloud = new Zdog.Anchor({
        addTo: scene,
    });

    const blob = new Zdog.Shape({
        addTo: cloud,

        stroke: 120.0,
        color: '#f5f5f3',

        translate: { x: 0.0, y: -120.0, z: -150.0 },
    });

    blob.copy({
        addTo: blob,

        stroke: 96.0,
        color: '#fafaf8',

        translate: { x: -30.0, y: 10.0, z: 10.0 },
    });

    blob.copy({
        addTo: blob,

        stroke: 70.0,
        color: '#fafaf8',

        translate: { x: 50.0, y: 10.0 },
    });

    blob.copy({
        addTo: blob,

        stroke: 96.0,
        color: '#f5f5f3',

        translate: { x: 0.0, z: 20.0 },
    });

    const canvas = $('canvas');
    const context = canvas[0].getContext('2d');

    const render = () => {
        context.save();

        const width = $(window).width();
        const height = $(window).height();

        ILLUSTRATION.scale = 0.5 + 0.5 * clamp(width - 991.98, 0.0, 1.0);

        context.translate(ILLUSTRATION.x + width - 130.0 * ILLUSTRATION.scale,
            ILLUSTRATION.y + height - 130.0 * ILLUSTRATION.scale);

        context.scale(ILLUSTRATION.scale, ILLUSTRATION.scale);

        context.lineJoin = 'round';
        context.lineCap = 'round';

        scene.renderGraphCanvas(context);

        context.font = '50px sans-serif';
        context.textBaseline = 'middle';

        context.fillStyle = 'rgba(255, 255, 255, 0.625)';
        context.fillText(ANIMATION_CONTROLLER.emoji.substr(0, 2), ANIMATION_CONTROLLER.cloudTranslation - 30.0, -115.0);

        context.restore();
    }

    scene.updateGraph();

    const timeline = anime.timeline({
        duration: 1100.0,
        loop: true,

        easing: 'easeInOutQuint',
        direction: 'alternate',

        update: () => {
            anchor.rotate.z = ANIMATION_CONTROLLER.anchorRotation;
            anchor.rotate.y = ANIMATION_CONTROLLER.anchorRotation * 0.25;

            shadow.translate.x = ANIMATION_CONTROLLER.shadowTranslation;

            leftPupil.rotate.z = ANIMATION_CONTROLLER.pupilRotation;
            rightPupil.rotate.z = ANIMATION_CONTROLLER.pupilRotation;

            mouth.scale = ANIMATION_CONTROLLER.mouthScale;

            cloud.translate.x = ANIMATION_CONTROLLER.cloudTranslation;

            scene.updateGraph();
            render();
        }
    });

    timeline.add({
        targets: ANIMATION_CONTROLLER,

        anchorRotation: -Math.PI * 0.1,

        easing: 'easeInOutQuint',
    });

    timeline.add({
        targets: ANIMATION_CONTROLLER,

        delay: 20.0,

        shadowTranslation: -50.0,
    }, 0);

    timeline.add({
        targets: ANIMATION_CONTROLLER,

        duration: 300.0,

        mouthScale: 1.2,
    }, '-=800');

    timeline.add({
        targets: ANIMATION_CONTROLLER,

        duration: 900.0,

        pupilRotation: Math.PI * 0.5,
    }, '-=1000');
}

$(document).ready(() => {
    adjustContentHeight();
    adjustCanvasSize();

    setDisplayData();

    createClearLoop();
    createInteractions();

    createIllustration();
});

$(window).resize(() => {
    adjustContentHeight();
    adjustDisplaySize();
    adjustCanvasSize();
});
