function startApp() {
    sessionStorage.clear(); // Clear user auth data
    showHideMenuLinks();
    showView('viewHome');

    $('#linkHome').on('click',showHomeView);
    $('#linkLogin').on('click',showLoginView);
    $('#linkRegister').on('click',showRegisterView);
    $('#linkListAds').on('click',listAds);
    $('#linkCreateAd').on('click',showCreateView);
    $('#linkLogout').on('click',logOut);

    $('#buttonRegisterUser').on('click',registerUser);
    $('#buttonLoginUser').on('click',loginUser);
    $('#buttonCreateAd').on('click',createAdv);
    $('#buttonEditAd').on('click',sendEdinRequest);
}