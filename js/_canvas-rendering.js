var gCurrTextBox;



function renderCanvas() {
    var canvas = getCanvas();
    var ctx = getCtx();
    var elCurrImg = getElCurrImg();

    var staticCanvas = document.querySelector('.static-canvas');
    var staticCanvasCtx = staticCanvas.getContext('2d');

    canvas.style.position = 'absolute';
    staticCanvas.style.position = 'absolute';
    staticCanvas.style['z-index'] = 0;
    canvas.style['z-index'] = 1;
    staticCanvas.style.left = 0;
    canvas.style.left = 0;
    // staticCanvas.offsetTop = 0;

    console.log('canvas left',canvas.offsetLeft)
    canvas.width = 400;
    canvas.height = elCurrImg.naturalHeight * (400 / elCurrImg.naturalWidth);
    staticCanvas.width = 400;
    staticCanvas.height = elCurrImg.naturalHeight * (400 / elCurrImg.naturalWidth);


    var img = new Image();
    img.src = elCurrImg.src;

    // draw image
    staticCanvasCtx.drawImage(img, 0, 0, 400, elCurrImg.naturalHeight * (400 / elCurrImg.naturalWidth));
    setCanvasTemplate();

    var memeTxts = getMeme().txts;
    memeTxts.forEach(txt => {
        printTextOnCanvas(txt);
    });
}

function setCanvasTemplate() {
    const TITLE_HEIGHT = 50; // in px
    var canvas = getCanvas();
    var ctx = getCtx();

    var topTitleToggle = document.querySelector('.top-title');
    var bottomTitleToggle = document.querySelector('.bottom-title');
    var doubleTitleToggle = document.querySelector('.double-title');

    // set titles color
    ctx.fillStyle = $('.title-color').val();
    if (topTitleToggle.checked) {
        ctx.fillRect(0, 0, canvas.width, TITLE_HEIGHT);
    } else if (bottomTitleToggle.checked) {
        ctx.fillRect(0, canvas.height - TITLE_HEIGHT, canvas.width, TITLE_HEIGHT);
    } else if (doubleTitleToggle.checked) {
        ctx.fillRect(0, 0, canvas.width, TITLE_HEIGHT);
        ctx.fillRect(0, canvas.height - TITLE_HEIGHT, canvas.width, TITLE_HEIGHT);
    }

}

function clickForTextBox(ev) {
    var canvas = getCanvas();
    if (!document.querySelector('#canvas-cover')) createMemeTxt();
    gCurrTextBox = getMeme().txts[getMeme().txts.length - 1];

    gCurrTextBox.pos = {
        x: getMousePos(canvas, ev).x,
        y: getMousePos(canvas, ev).y,
    };
    // create cover div
    var coverDiv = document.createElement('div');
    coverDiv.setAttribute('id', 'canvas-cover');
    coverDiv.style.width = canvas.width + 'px';
    coverDiv.style.height = canvas.height + 'px';
    coverDiv.style.position = 'absolute';
    coverDiv.style.top = 0;

    // create floating text box
    var inputTextBox = document.createElement('input');
    inputTextBox.setAttribute('id', 'floatTextBox')
    inputTextBox.onblur = unCoverCanvas;
    console.log('inputtextbox', inputTextBox)
    inputTextBox.oninput = setTxtObjAndPrint;
    inputTextBox.onkeydown = function () {
        var key = event.keyCode || event.charCode;
        var ctx = getCtx();

        if (key == 8 || key == 46){
            gCurrTextBox.txt = inputTextBox.value;
            ctx.clearRect(gCurrTextBox.pos.x,gCurrTextBox.pos.y - gCurrTextBox.size,ctx.measureText(gCurrTextBox.txt).width,gCurrTextBox.pos.y - gCurrTextBox.size);
        }
    };
    // style & position textbox
    // inputTextBox.style = {
    //     ['background-color']: 'transparent',
    //     border: '1px dashed #d4d1d1',
    //     position: 'absolute',
    //     top: (getMousePos(canvas, ev).y - 16.5) + 'px',
    //     left: (getMousePos(canvas, ev).x - 89) + 'px'
    // }
    // inputTextBox.autofocus;

    inputTextBox.style['background-color'] = 'transparent';
    inputTextBox.style.border = '1px dashed #d4d1d1';
    inputTextBox.style.position = 'absolute';
    // inputTextBox.style['z-index'] = 3;
    inputTextBox.style.top = (getMousePos(canvas, ev).y - 16.5) + 'px';
    inputTextBox.style.left = (getMousePos(canvas, ev).x - 89) + 'px';
    // inputTextBox.setAttribute('autofocus', '');



    $('.on-canvas').append(coverDiv);
    $('#canvas-cover').append(inputTextBox);
    document.querySelector('#floatTextBox').focus();
    // console.log($('#canvas-cover')[0]);
}

function unCoverCanvas() {
    var canvasCover = document.querySelector('#canvas-cover');
    document.querySelector('.on-canvas').removeChild(canvasCover);
    // console.log('unfocus')
    if (gCurrTextBox.txt === '') {
        getMeme().txts.splice(getCurrTxtIdxById(gCurrTextBox.id), 1);
        return;
    }
}

function setTxtObjAndPrint() {
    var textBox = document.querySelector('#floatTextBox');
    setMemeTxtById(getMeme().txts[getMeme().txts.length - 1].id, textBox.value);
    gCurrTextBox = getMeme().txts[getMeme().txts.length - 1];
    printTextOnCanvas(gCurrTextBox);
}

function printTextOnCanvas(txtObj) {
    var ctx = getCtx();

    ctx.fillStyle = txtObj.color;
    ctx.font = `${txtObj.size}px ${txtObj.font}`;
    console.log('txtObj', txtObj)
    ctx.fillText(txtObj.txt, txtObj.pos.x, txtObj.pos.y);
}

function setCurrTextBoxPosById(id) {
    getMeme().txts.find(txt => txt.id === id).pos = gCurrTextBox.pos;
}

function getCurrTextBoxPosById(id) {
    return getMeme().txts.find(txt => txt.id === id).pos;
}



/****** CANVAS SETTINGS RENDERING ******/
function openFontNav(navName) {
    $(navName).addClass('open-nav');
    if (navName === '#color-picker') $('#colorWheel').fadeIn();
}

function closeNav(navName) {
    $(navName).removeClass('open-nav');
    if (navName === '#color-picker') $('#colorWheel').fadeOut();
}

function changeFont(elFont) {
    $('.font-style .text').text($(elFont).text());
    // updateFont(elFont,idx)
    gCurrTextBox.font = $(elFont).text();
    closeNav('.nav-background');
    setPreview('font');
}

function changeFontSize(sign) {
    if ((+$('.size-val').text() >= 30 && $(sign).hasClass('plus')) || (+$('.size-val').text() <= 10 && $(sign).hasClass('minus'))) return;
    $(sign).hasClass('plus') ? gCurrTextBox.size++ : gCurrTextBox.size--;

    $('.size-val').text(gCurrTextBox.size);
    setPreview('size');
}

function setPreview(prop) {
    switch (prop) {
        case 'font':
            $('.text-preview').css("font-family", gCurrTextBox.font);
            break;
        case 'size':
            let size = gCurrTextBox.size / 10;
            $('.text-preview').css("font-size", size + 'rem');
            break;
        case 'color':
            $('.text-preview').css("color", gCurrTextBox.color);
            break;
    }
}

function changeColor(selectedColor) {
    gCurrTextBox.color = $(selectedColor).attr('id');
    setPreview('color');
}

function setBlur() {
    $('.controllers-panel>*:not(.canvas-style)').addClass('blur-background');
}

function removeBlur() {
    $('.controllers-panel>*:not(.canvas-style)').removeClass('blur-background');
}




/******** GALLERY RENDERING ********/
function createCard(img) {
    let card = $(`<div id="${img.id}" class="col-lg-3 col-md-6 col-sm-12">
                        <div class="card bg-dark text-white">
                            <img class="card-img" src="${img.url}" alt="Card image" onclick="selectImg(${img.id});nextPage('select-text', 'template')" >
                        </div>
                    </div>`)
    card.data('id', img.id);

    $('.album__row').append(card);
}

function createList(images) {
    images.forEach(img => {
        createCard(img);
    });
}

// show side-bar
$(window).scroll(function () {
    if ($(this).scrollTop() > 100 && $("#img").hasClass("active")) {
        // $('.scrollToTop').fadeIn();
        $("#side-nav").addClass("navbar-left");
    } else {
        // $('.scrollToTop').fadeOut();
        $("#side-nav").removeClass("navbar-left");
    }
});

//Click event to scroll to top
$('.scrollToTop').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 800);
    return false;
});