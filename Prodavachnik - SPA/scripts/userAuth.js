const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppId = 'kid_HJNl-Y2Mg';
const kinveyAppSecret = 'c547c1ac7d844ab2802090bdabe7fcc4';
const kinveyAppAuthHeaders = {
    'Authorization': "Basic " +
    btoa(kinveyAppId + ":" + kinveyAppSecret),
};

function registerUser() {
    let userData = {
        username: $('#formRegister input[name=username]').val(),
        password: $('#formRegister input[name=passwd]').val()
    };

    if(userData.username != '' && userData.password != ''){

        let regRequest = {
            method: "POST",
            url: kinveyBaseUrl + 'user/' + kinveyAppId,
            data: JSON.stringify(userData),
            headers: kinveyAppAuthHeaders,
            contentType: 'application/json'
        };

        $.ajax(regRequest)
            .then(function (userInfo) {
                saveAuthInSession(userInfo);
                showHideMenuLinks();
                showHomeView();
                showInfo('User registration successful.');

            })
            .catch(handleAjaxError);
    }
    else
        showError('Invalid username or password !');

}
function loginUser() {
    let userData = {
        username: $('#formLogin input[name=username]').val(),
        password: $('#formLogin input[name=passwd]').val()
    };

    if(userData.username != '' && userData.password != ''){

        let loginRequest = {
            method: "POST",
            url: kinveyBaseUrl + 'user/' + kinveyAppId + "/login",
            data: JSON.stringify(userData),
            headers: kinveyAppAuthHeaders,
            contentType: 'application/json'
        };

        $.ajax(loginRequest)
            .then(function (userInfo) {
                saveAuthInSession(userInfo);
                showHideMenuLinks();
                showHomeView();
                showInfo('Login successful.');

            })
            .catch(handleAjaxError);
    }
    else
        showError('Invalid username or password !');

}

function logOut() {
    sessionStorage.clear();
    showHideMenuLinks();
    showHomeView();
    $('#loggedInUser').text('');
    showInfo("Logout successful!");
}

function saveAuthInSession(userInfo) {
    let userAuth = userInfo._kmd.authtoken;
    sessionStorage.setItem('authToken', userAuth);
    let userId = userInfo._id;

    let author = userInfo.username;
    sessionStorage.setItem('username', author);

    sessionStorage.setItem('userId', userId);

    $('#loggedInUser').text(
        "Welcome, " + author + "!").css('color','#00bbbb').css('display','inline-block');
}

function getKinveyUserAuthHeaders() {
    return {
        'Authorization': "Kinvey " +
        sessionStorage.getItem('authToken'),
    };
}
