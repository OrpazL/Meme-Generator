var gCurrTextBox;



function renderCanvas() {
    var canvas = getCanvas();
    var ctx = getCtx();
    var elCurrImg = getElCurrImg();

    if (!canvas) return;


    canvas.style.position = 'absolute';
    canvas.style['z-index'] = 1;
    canvas.style.left = 0;

    canvas.width = 400;
    canvas.height = elCurrImg.naturalHeight * (400 / elCurrImg.naturalWidth);


    var img = new Image();
    img.src = elCurrImg.src;

    // draw image
    ctx.drawImage(img, 0, 0, 400, elCurrImg.naturalHeight * (400 / elCurrImg.naturalWidth));
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
    // if (!document.querySelector('#canvas-cover')) 
    createMemeTxt();
    gCurrTextBox = getMeme().txts[getMeme().txts.length - 1];
    // gCurrTextBox = getCurrTxtById(getAttribute('data-id'));


    gCurrTextBox.pos = {
        x: getMousePos(canvas, ev).x,
        y: getMousePos(canvas, ev).y,
    };
    console.log('ev', ev);
    // create cover div
    
    // create floating text box
    var inputTextBox = document.createElement('input');
    inputTextBox.setAttribute('id', `floatTextBox-${gCurrTextBox.id}`);
    inputTextBox.setAttribute('data-id', `${gCurrTextBox.id}`);
    inputTextBox.classList.add('floatTextBox');

    var unfocusTextBox = unCoverCanvas.bind(null, `#floatTextBox-${gCurrTextBox.id}`)
    inputTextBox.onfocusout = unfocusTextBox;
    
    var oninputTextBox = setTxtObjAndPrint.bind(null, `#floatTextBox-${gCurrTextBox.id}`);
    inputTextBox.oninput = oninputTextBox;
    inputTextBox.onkeydown = function () {
        gCurrTextBox = getCurrTxtById(this.getAttribute('data-id'));
        // console.log('this',this.getAttribute('data-id'))
        var key = event.keyCode || event.charCode;
        var ctx = getCtx();
        if (key == 8 || key == 46) {
            gCurrTextBox.txt = inputTextBox.value;
            ctx.clearRect(gCurrTextBox.pos.x, gCurrTextBox.pos.y - gCurrTextBox.size, ctx.measureText(gCurrTextBox.txt).width, gCurrTextBox.pos.y - gCurrTextBox.size);
        }
    };
    inputTextBox.onclick = function (ev) {
        ev.stopPropagation();
        gCurrTextBox = getCurrTxtById(this.getAttribute('data-id'));
        this.focus();
        // console.log('elId', this.id.substring(13))
        // console.log('this', this, this.getAttribute('data-id'))
        // console.log('gcurr',gCurrTextBox)
        // debugger
        // document.querySelector(`#floatTextBox-${gCurrTextBox.id}`).focus();
        console.log('input clicked')
        setPreview('font');
        setPreview('size');
        setPreview('color');
        $('.size-val').text(gCurrTextBox.size);
        $('.text').text(gCurrTextBox.font);
    };

    inputTextBox.ondrag = function (ev) {
        gCurrTextBox = getCurrTxtById(this.getAttribute('data-id'));
        gCurrTextBox.pos.x = getMousePos(getCanvas(), ev).x;
        gCurrTextBox.pos.y = getMousePos(getCanvas(), ev).y;
        renderCanvas();
    }
    // style & position textbox
    // inputTextBox.style = {
        //     ['background-color']: 'transparent',
        //     border: '1px dashed #d4d1d1',
        //     position: 'absolute',
    //     top: (getMousePos(canvas, ev).y - 16.5) + 'px',
    //     left: (getMousePos(canvas, ev).x - 89) + 'px'
    // }
    // inputTextBox.autofocus;
    
    inputTextBox.style['z-index'] = 3;
    inputTextBox.style['background-color'] = 'transparent';
    inputTextBox.style.position = 'absolute';
    inputTextBox.style.top = ev.clientY - gCurrTextBox.size + 'px';
    inputTextBox.style.left = ev.clientX + 'px';
    inputTextBox.style.color = 'transparent';

    console.log('gCurrTextBox', gCurrTextBox);



    // $('.on-canvas').append(coverDiv);
    $('body').append(inputTextBox);

    // focus new input
    document.querySelector(`#floatTextBox-${gCurrTextBox.id}`).focus();
    // console.log($('#canvas-cover')[0]);
}

function unCoverCanvas(textBoxId) {
    var canvasCover = document.querySelector('#canvas-cover');
    // document.querySelector('.on-canvas').removeChild(canvasCover);
    var textbox = document.querySelector(textBoxId);
    // textbox.style.border = 0;

    // DELETE EMPTY TXTS
    if (gCurrTextBox.txt === '') {
        getMeme().txts.splice(getCurrTxtIdxById(gCurrTextBox.id), 1);
        return;
    }
}

function setTxtObjAndPrint(textBoxId) {
    var textBox = document.querySelector(textBoxId);
    setMemeTxtById(textBox.getAttribute('data-id'), textBox.value);
    gCurrTextBox = getMeme().txts[getCurrTxtIdxById(textBox.getAttribute('data-id'))];
    printTextOnCanvas(gCurrTextBox);
    renderCanvas();
}

function printTextOnCanvas(txtObj) {
    var ctx = getCtx();
    console.log('txtObj', txtObj);

    ctx.fillStyle = txtObj.color;
    ctx.font = `${txtObj.size}px ${txtObj.font}`;
    // console.log('txtObj', txtObj)
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
    gCurrTextBox.font = $(elFont).text();
    closeNav('.nav-background');
    setPreview('font');
    renderCanvas();
}

function changeFontSize(sign) {
    if ((+$('.size-val').text() >= 30 && $(sign).hasClass('plus')) || (+$('.size-val').text() <= 10 && $(sign).hasClass('minus'))) return;
    $(sign).hasClass('plus') ? gCurrTextBox.size++ : gCurrTextBox.size--;

    $('.size-val').text(gCurrTextBox.size);
    setPreview('size');
    renderCanvas();
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
    if (!gCurrTextBox) return;

    gCurrTextBox.color = $(selectedColor).attr('id');
    setPreview('color');
    renderCanvas();
}
//change tamplate color
function changeTColor(colorInput) {
    let color = $(colorInput).attr('id');

    $("#color-input").val(color);
    renderCanvas();
}

function openEditor() {
    $('.controllers-panel>*:not(.canvas-style)').addClass('blur-background');

    $('.canvas-style').addClass('open');
    $('.canvas-title').text('Go back')
}

function closeEditor() {
    $('.controllers-panel>*:not(.canvas-style)').removeClass('blur-background open');

    $('.canvas-style').removeClass('open');
    $('.canvas-title').text('more options')
}

function toggleEditor(canvas) {
    if ($('.canvas-style').hasClass('open')) {
        closeEditor();
    } else {
        openEditor();
    }
}

function toggleMainNav() {
    if($( window ).width() > 980 ) return;

    $('.controllers-panel').toggleClass('closed__nav');
}




/******** GALLERY RENDERING ********/
function createCard(img) {
    let card = $(`<div id="${img.id}" class="col-lg-3 col-md-4 col-sm-6">
                        <div class="card bg-dark text-white">
                            <img class="card-img" src="${img.url}" alt="Card image" onclick="selectImg(${img.id});nextPage('select-text', 'template')" >
                        </div>
                    </div>`)
    card.data('id', img.id);

    $('.album__row').append(card);
}

function createList(images) {
    $('.album__row').html('');

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

$(window).resize(function(){

    if ($(window).width() <= 960) {  
        $('.bg-video').html('');
    }
});