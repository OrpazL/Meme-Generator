function startSearch(e) {
    e.preventDefault();

    const regex = new RegExp(escapeRegex($('.search').val()), 'gi');
    let images = findImages(regex);
    // console.log(options);
    createList(images);
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function findImages(regex) {
    return getImgs().filter(img => img.keywords.find(keyword => regex.test(keyword)) !== undefined );
}