const kinveyBaseUrl = 'https://baas.kinvey.com/';
const kinveyAppKey = 'kid_BJA28I_Ge';
const kinveyAppSecret = '29232684959d43e99b51f83a146be1a5';
const kinveyAuthHeaders = {
    'Authorization': "Basic " +
    btoa(kinveyAppKey + ":" + kinveyAppSecret),
};

function saveAuthInSession(userInfo) {
    sessionStorage.setItem("username", userInfo.username);
    sessionStorage.setItem("authToken", userInfo._kmd.authtoken);
    sessionStorage.setItem("userId", userInfo._id);
    $('#loggedInUser').text("Welcome, " + userInfo.username + "!");
}

function kinveyUserAuthHeaders() {
    return {
        'Authorization': "Kinvey " + sessionStorage.getItem('authToken')
    };
}

function loginUser () {
    event.preventDefault();
    let userData = {
        username: $('#formLogin input[name=username]').val(),
        password:$('#formLogin input[name=passwd]').val()
    };

    $.ajax({
        method:'POST',
        url: kinveyBaseUrl + 'user/' + kinveyAppKey + '/login',
        data: JSON.stringify(userData),
        contentType: "application/json",
        headers: kinveyAuthHeaders,
        success: loginUserSuccess,
        error: handleAjaxError
    });
    
    function loginUserSuccess (userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        showHomeView();
        showInfo('Login successful.');
    }
}

function registerUser () {
    event.preventDefault();
    let userData = {
        username: $('#formRegister input[name=username]').val(),
        password:$('#formRegister input[name=passwd]').val()
    };

    $.ajax({
        method:'POST',
        url: kinveyBaseUrl + 'user/' + kinveyAppKey,
        data: JSON.stringify(userData),
        contentType: "application/json",
        headers: kinveyAuthHeaders,
        success: registerUserSuccess,
        error: handleAjaxError
    });

    function registerUserSuccess (userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        showHomeView();
        showInfo('Login successful.');
    }
}

function logoutUser() {
    sessionStorage.clear();
    $('#loggedInUser').text('');
    showView("viewHome");
    showHideMenuLinks();
    showInfo('Logout successful!');
}

