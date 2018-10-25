//select image
function selectImg(id) {
    if (gCurrImg) {
        $('#' + gCurrImg.id).removeClass("selected");

        if (id === gCurrImg.id) {
            gCurrImg = undefined;
            return;
        }
    }

    gCurrImg = gImages.find(image => image.id === id);

    $('#' + id).addClass('selected');
}