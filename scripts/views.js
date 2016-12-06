function showHideMenuLinks() {
    if (sessionStorage.getItem("authToken")) {
        $('#menu a').hide();
        $('#linkHome').show();
        $('#linkListAds').show();
        $('#linkCreateAd').show();
        $('#linkLogout').show();
        $('#loggedInUser').show();
    } else {
        $('#menu a').hide();
        $('#linkHome').show();
        $('#linkLogin').show();
        $('#linkRegister').show();
    }
}

function showView(viewName) {
    // Hide all views and show the selected view only
    $('main > section').hide();
    $('#' + viewName).show();
}

function showHomeView () {
    showView('viewHome');
}

function showLoginView () {
    showView('viewLogin');
    $('#formLogin').trigger('reset');
}

function showRegisterView () {
    $('#formRegister').trigger('reset');
    showView('viewRegister');
}

function showCreateAdView () {
    $('#formCreateAd').trigger('reset');
    showView('viewCreateAd');
}




