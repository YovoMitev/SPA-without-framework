function showHideMenuLinks() {
    $('#menu a').hide();
    $('#linkHome').show();

    if(sessionStorage.getItem('authToken') == undefined){
        $('#linkLogin').show();
        $('#linkRegister').show();
        $('#loggedInUser').text('');

    }else{
        $('#linkListAds').show();
        $('#linkCreateAd').show();
        $('#linkLogout').show();
    }
}

function showView(view) {
    $('main > section').hide();
    $('#' + view).show();
}
function showHomeView() {
    showView('viewHome')
}

function showLoginView() {
    showView('viewLogin');
    $('#formLogin').trigger('reset');
}

function showRegisterView() {
    showView('viewRegister');
    $('#formRegister').trigger('reset');
}

function showCreateView() {
    showView('viewCreateAd');
    $('#formCreateAd').trigger('reset');

}