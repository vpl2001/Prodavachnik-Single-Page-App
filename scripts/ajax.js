function createAdd () {
    let currentUser = sessionStorage.getItem('username');

    let addData = {
        title: $('#formCreateAd input[name=title]').val(),
        description: $('#formCreateAd textarea[name=description]').val(),
        publisher: currentUser,
        data: $('#formCreateAd input[name=datePublished]').val(),
        price: Math.round($('#formCreateAd input[name=price]').val()*100)/100,
        image: $('#formCreateAd input[name=image]').val()
    };

    $.ajax({
        method: 'POST',
        url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/adds',
        headers: kinveyUserAuthHeaders(),
        data: addData,
        success: createAddSuccess,
        error: handleAjaxError
    });

    function createAddSuccess() {
        showInfo('Add created successfully!');
        listAdds();
    }
}


function listAdds() {
    showView('viewAds');
    $('#ads').empty();

    $.ajax({
        method: 'GET',
        url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/adds',
        headers: kinveyUserAuthHeaders(),
        success: successListBooks,
        error: handleAjaxError
    });

    function successListBooks (adds) {
        
        let table = $(`<table id="t">
                <tr>
                    <th>Title</th>
                    <th>Publisher</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Date Published</th>
                    <th>Actions</th>
                </tr>
                </table>`);

        for (let ad of adds) {
            let tr = $('<tr>');
            displayRowOfTable(tr, ad);
            tr.appendTo(table);
        }

        $('#t tr').css('text-align', 'center');
        $('#ads').append(table);
        
        function displayRowOfTable(tr, ad) {
            let detailsLink = $(`<a href="#">[Read more...]</a>`).click(function () {
                displayAdFullDetails(ad._id);
            });

            let links = [detailsLink];

            if (ad._acl.creator == sessionStorage.getItem('userId')) {
                let deleteLink = $('<a href="#">[Delete]</a>').click(function () {
                    deleteAdById(ad._id);
                });
                let editLink = $('<a href="#">[Edit]</a>').click(function () {
                    editAdById(ad._id);
                });

                links.push(" ");
                links.push(deleteLink);
                links.push(" ");
                links.push(editLink);
            }

            tr.append($('<td>').text(ad.title),
                $('<td>').text(ad.description),
                $('<td>').text(ad.publisher),
                $('<td>').text(ad.price),
                $('<td>').text(ad.data),
                $('<td>').append(links));
        }
    }
}
function deleteAdById(id) {
    $.ajax({
        method: 'DELETE',
        url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/adds/' + id,
        headers: kinveyUserAuthHeaders(),
        success: successDeleteAdds,
        error: handleAjaxError
    });

    function successDeleteAdds() {
        showInfo('Book deleted!');
        listAdds();
    }
}
function editAdById(id){
    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/adds/" + id,
        headers: kinveyUserAuthHeaders(),
        success: loadAdForEditSuccess,
        error: handleAjaxError
    });
    function loadAdForEditSuccess(ad) {
        $('#formEditAd input[name=id]').val(ad._id);
        $('#formEditAd input[name=publisher]').val(ad.publisher);
        $('#formEditAd input[name=title]').val(ad.title);
        $('#formEditAd textarea[name=description]').val(ad.description);
        $('#formEditAd input[name=datePublished]').val(ad.data);
        $('#formEditAd input[name=price]').val(ad.price);
        $('#formEditAd input[name=image]').val(ad.image);

        showView('viewEditAd');
    }
}
function editAd () {
    let adData = {
        title: $('#formEditAd input[name=title]').val(),
        description: $('#formEditAd textarea[name=description]').val(),
        publisher: $('#formEditAd input[name=publisher]').val(),
        data: $('#formEditAd input[name=datePublished]').val(),
        price: $('#formEditAd input[name=price]').val(),
        image: $('#formEditAd input[name=image]').val()
    };

    $.ajax({
        method: 'PUT',
        url: kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/adds/'+ $('#formEditAd input[name=id]').val(),
        headers: kinveyUserAuthHeaders(),
        data: adData,
        success: editAddsSuccess,
        error: handleAjaxError
    });
    function editAddsSuccess() {
        showInfo('Add edited!');
        listAdds();
    }
}
function displayAdFullDetails (id) {
    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" +
        kinveyAppKey + "/adds/" + id,
        headers: kinveyUserAuthHeaders(),
        success: displayAddSuccess,
        error: handleAjaxError
    });
    $('#viewAdDetails').empty();

    function displayAddSuccess(ad) {
        let html = $('<div>');
        html.append(
            $('<img>').attr('src', ad.image),
            $('<br>'),
            $('<label>').text('Price: '),
            $('<div>').text(ad.price),
            $('<label>').text('Title: '),
            $('<h1>').text(ad.title),
            $('<label>').text('Description: '),
            $('<p>').text(ad.description),
            $('<label>').text('Publisher: '),
            $('<div>').text(ad.publisher),
            $('<label>').text('Date: '),
            $('<div>').text(ad.data)
        );

        html.appendTo($('#viewAdDetails'));
        showView('viewAdDetails');
        let back = $('<a href="#">[Back to List]</a>').click(function () {
            listAdds();
        });
        back.appendTo($('#viewAdDetails'));
    }
}
