var gCurrTextBoxPos;


function renderCanvas() {
    var canvas = getCanvas();
    var ctx = getCtx();
    var elCurrImg = getElCurrImg();

    canvas.width = 400;
    canvas.height = elCurrImg.naturalHeight * (400 / elCurrImg.naturalWidth);
    // setCanvas(canvas);

    var img = new Image();
    img.src = elCurrImg.src;

    // draw image
    ctx.drawImage(img, 0, 0, 400, elCurrImg.naturalHeight * (400 / elCurrImg.naturalWidth));
    setCanvasTemplate();

    var memeTxts = getMeme().txts;
    memeTxts.forEach(txt => {
        printTextOnCanvas(txt.txt, txt.pos.x, txt.pos.y);
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

    // style & position textbox
    inputTextBox.style['background-color'] = 'transparent';
    inputTextBox.style.border = '1px dashed #d4d1d1';
    inputTextBox.style.position = 'absolute';
    inputTextBox.style.top = (getMousePos(canvas, ev).y - 16.5) + 'px';
    inputTextBox.style.left = (getMousePos(canvas, ev).x - 89) + 'px';
    inputTextBox.setAttribute('autofocus', '');

    gCurrTextBoxPos = {
        x: getMousePos(canvas, ev).x,
        y: getMousePos(canvas, ev).y,
    };



    $('.on-canvas').append(coverDiv);
    $('#canvas-cover').append(inputTextBox);
    // console.log($('#canvas-cover')[0]);
}

function unCoverCanvas() {
    var textBox = document.querySelector('#floatTextBox');
    printTextOnCanvas(textBox.value, gCurrTextBoxPos.x, gCurrTextBoxPos.y);

    var canvasCover = document.querySelector('#canvas-cover');
    // document.querySelector('#canvas-cover').removeChild(textBox);
    document.querySelector('.on-canvas').removeChild(canvasCover);
    // console.log('unfocused');

}

function printTextOnCanvas(txtObj) {
    var ctx = getCtx();
    // var currColor = getCurrColor();
    // var currFont = getCurrFont();
    // var currFontSize = getCurrFontSize();

    ctx.fillStyle = txtObj.color;
    ctx.font = `${txtObj.size}px ${txtObj.font}`;
    ctx.fillText(txtObj.txt, txtObj.pos.x, txtObj.pos.y);
}

function setCurrTextBoxPosById(id) {
    getMeme().txts.find(txt => txt.id === id).pos = gCurrTextBoxPos;
}

function getCurrTextBoxPosById(id) {
    return getMeme().txts.find(txt => txt.id === id).pos;
}



/****** CANVAS SETTINGS RENDERING ******/
function openFontNav(navName) {
    $(navName).addClass('open-nav');
    if(navName === '#color-picker') $('#colorWheel').fadeIn();
}

function closeNav(navName) {
    $(navName).removeClass('open-nav');
    if(navName === '#color-picker') $('#colorWheel').fadeOut();
}

function changeFont(font, idx=0) {
    $('.font-style .text').text($(font).text());
    updateFont(font,idx)
    gCurrFont = $(font).text();
    closeNav('.nav-background');
    setPreview('font');
}

function changeFontSise(sign) {
    if (( +$('.size-val').text() >= 30  && $(sign).hasClass('plus')) || (+$('.size-val').text() <=  10 && $(sign).hasClass('minus'))) return; 
    $(sign).hasClass('plus') ? gCurrFontSize++ : gCurrFontSize--;

    $('.size-val').text(gCurrFontSize);
    setPreview('size');
}

function setPreview(prop) {
    switch(prop) {
        case 'font':
            $('.text-preview').css("font-family", gCurrFont);
            break; 
        case 'size':
            let size = gCurrFontSize / 10;
            $('.text-preview').css("font-size", size + 'rem');
            break;
        case 'color':
            $('.text-preview').css("color", gCurrColor);
            break;
    }
}

function changeColor(selectedColor) {
    gCurrColor = $(selectedColor).attr('id');
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
    let card =  $(`<div id="${img.id}" class="col-lg-3 col-md-6 col-sm-12">
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
$(window).scroll(function(){
    if ($(this).scrollTop() > 100 && $("#img").hasClass("active")) {
        // $('.scrollToTop').fadeIn();
        $("#side-nav").addClass("navbar-left");
    } else {
        // $('.scrollToTop').fadeOut();
        $("#side-nav").removeClass("navbar-left");
    }
});

//Click event to scroll to top
$('.scrollToTop').click(function(){
    $('html, body').animate({scrollTop : 0},800);
    return false;
});