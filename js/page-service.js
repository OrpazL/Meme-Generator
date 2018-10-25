var gNextId = 1;
var gImages = [
    {id: gNextId++, url: './img/meme-imgs/1.jpg', keywords: ['happy', 'mountain', 'women', 'gress']},
    {id: gNextId++, url: './img/meme-imgs/2.jpg', keywords: ['happy', 'trump', 'funny', 'engry' , 'usa']},
    {id: gNextId++, url: './img/meme-imgs/3.jpg', keywords: ['happy', 'pets', 'dog', 'puppy', 'cute']},
    {id: gNextId++, url: './img/meme-imgs/4.jpg', keywords: ['happy', 'pets', 'kids', 'dog', 'baby', 'bed']},
    {id: gNextId++, url: './img/meme-imgs/5.jpg', keywords: ['happy', 'funny', 'kids', 'baby', 'cute']},
    {id: gNextId++, url: './img/meme-imgs/6.jpg', keywords: ['happy', 'pets', 'cat', 'sleep']},
    {id: gNextId++, url: './img/meme-imgs/7.jpg', keywords: ['happy', 'funny', 'listening']},
    {id: gNextId++, url: './img/meme-imgs/8.jpg', keywords: ['happy', 'funny', 'kids', 'baby', 'engry']},
    {id: gNextId++, url: './img/meme-imgs/9.jpg', keywords: ['happy', 'funny', 'you']},
    {id: gNextId++, url: './img/meme-imgs/10.jpg', keywords: ['happy', 'funny']},
    {id: gNextId++, url: './img/meme-imgs/11.jpg', keywords: ['happy', 'funny', 'movie']},
    {id: gNextId++, url: './img/meme-imgs/12.jpg', keywords: ['happy', 'funny', 'movie']},
    {id: gNextId++, url: './img/meme-imgs/13.jpg', keywords: ['happy', 'funny', 'kids', 'baby']},
    {id: gNextId++, url: './img/meme-imgs/14.jpg', keywords: ['happy', 'trump', 'funny']},
    {id: gNextId++, url: './img/meme-imgs/15.jpg', keywords: ['happy', 'funny', 'kids', 'baby']},
    {id: gNextId++, url: './img/meme-imgs/16.jpg', keywords: ['happy', 'pets', 'funny', 'dog']},
    {id: gNextId++, url: './img/meme-imgs/17.jpg', keywords: ['happy', 'funny', 'obama']},
    {id: gNextId++, url: './img/meme-imgs/18.jpg', keywords: ['happy', 'funny', 'love']},
    {id: gNextId++, url: './img/meme-imgs/19.jpg', keywords: ['happy', 'funny', 'movie']},
    {id: gNextId++, url: './img/meme-imgs/20.jpg', keywords: ['happy', 'funny']},
    {id: gNextId++, url: './img/meme-imgs/21.jpg', keywords: ['happy', 'funny', 'movie']},
    {id: gNextId++, url: './img/meme-imgs/22.jpg', keywords: ['happy', 'funny', 'movie']},
    {id: gNextId++, url: './img/meme-imgs/23.jpg', keywords: ['happy', 'funny', 'movie']},
    {id: gNextId++, url: './img/meme-imgs/24.jpg', keywords: ['happy', 'putin']},
    {id: gNextId++, url: './img/meme-imgs/25.jpg', keywords: ['happy', 'movie', 'toy']}
];
// var gMeme;
var gMeme = {
    id: 'blank',
    txts: [
        {
            id: makeId(),
            txt: '',
            font: 'sans-serif',
            size: 16,
            color: 'black',
            pos: {
                x: 20,
                y: 50,
            }
        },
    ],
};

function getElCurrImg() {
    var currMemeObj = getMeme();
    var imgObj;
    if (currMemeObj.id === 'blank') {
        imgObj = getBlankImg();
    } else {
        imgObj = getImgById(currMemeObj.id);
    }
    var elImg = $(`img[src="${imgObj.url}"]`);
    // console.log('elImg:',currMemeObj);
    return elImg[0];
}

function getImgById(id) {
    return gImages.find(img => img.id === id);
}

function setMemeById(id) {
    gMeme = gImages.find(img => img.id === id);
}

function getImgs() {
    return gImages;
}

function getMeme() {
    return gMeme;
}

function getBlankImg() {
    return {
        id: 'blank',
        url: './img/blank300x300.jpg',
        keywords: ['blank']
    };
}

function setMemeTxtById(id,txt = gMeme.txts[getCurrTxtIdxById(id)].txt,font = getCurrFontById(id),size = getCurrFontSizeById(id),color = getCurrColorById(id),pos = getCurrTextBoxPosById(id)) {
    gMeme.txts[getCurrTxtIdxById(id)] = {
        id,
        txt,
        font,
        size,
        color,
        pos,
    };
}
function createMemeTxt(txt = '',font = 'sans-serif',size = gMeme.txts[gMeme.txts.length - 1].size ,color = 'black',pos = {x: 20, y: 50}) {
    gMeme.txts.push({
        id: makeId(),
        txt,
        font,
        size,
        color,
        pos,
    });
}

function getCurrTxtIdxById(id) {
    return gMeme.txts.findIndex(txt => txt.id === id);
}

function getCurrTxtById(id) {
    return gMeme.txts.find(txt => txt.id === id);
}

function getCurrColorById(id) {
    return gMeme.txts.find(txt => txt.id === id).color;
}

function getCurrFontSizeById(id) {
    return gMeme.txts.find(txt => txt.id === id).size;
}

function getCurrFontById(id) {
    return gMeme.txts.find(txt => txt.id === id).font;
}



function getMousePos(canvas, ev) {
    var rect = canvas.getBoundingClientRect();
    
    return {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top
    };
}