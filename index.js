//--Page to navigate WHEN CLICKED MENUE ITEM
//page: from HTML CLICK Example /page:/01/demos/index.html
function loadPage(page) {

    //--Get Reference for the HTML ELEMENT BY ITS ID
    //--contentFrame is iframe element type
    let iframeElemnt = document.getElementById("contentFrame");

    //--Give the IFRAME the HTML ADDRESS TO LOAD
    iframeElemnt.src = page;

    // Close sidebar on mobile
    document.getElementById("sidebar").classList.remove("show");
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}