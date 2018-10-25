//select image
function selectImg(id) {
    var currImg = getMeme();
    if (currImg) {
        $('#' + currImg.id).removeClass("selected");

        if (id === currImg.id) {
            currImg = undefined;
            return;
        } else {
            currImg.id = id
        }
    }

    // currImg = gImages.find(image => image.id === id);

    $('#' + id).addClass('selected');
}