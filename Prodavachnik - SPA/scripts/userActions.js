

function listAds() {
    $('#ads').empty();
    showView('viewAds');

    let adsRequest = {
        method:"GET",
        url: kinveyBaseUrl + 'appdata/' + kinveyAppId + '/store/',
        headers: getKinveyUserAuthHeaders()
    };

    $.ajax(adsRequest)
        .then(showAds)
        .catch(handleAjaxError);

    function showAds(ads) {
        $('#adsIsEmpty').hide();

        let table = $(`<table>
            <tr>
                <th>Title</th>
                <th>Publisher</th>
                <th>Description</th>
                <th>Price</th>
                <th>Date Published</th>
                <th>Actions</th>
            </tr>
            </table>`);

        $('#ads').append(table);
        for(let token of ads){
            generateHTML(token,table);
        }

        function generateHTML(token,target) {
            let tr = $('<tr>');
            let links = [];

            tr.append($(`<td>${token.title}</td>
                    <td>${token.publisher}</td>
                    <td>${token.description}</td>
                    <td>${token.price}</td>
                    <td>${token.date}</td>
                `));
            if(sessionStorage.getItem('userId') == token._acl.creator){
                let delHref =$('<a href="#">').text('[Delete]');
                let editHref =$('<a href="#">').text('[Edit]');
                delHref.on('click',function () {
                    deleteAdv(token._id);
                });
                editHref.on('click',function () {
                    editAdv(token);
                });
                links.push(delHref);
                links.push(editHref);
            }
            let detailsHref =$('<a href="#">').text('[Details]');
            detailsHref.on('click',function () {
                detailsView(token);
            });

            links.push(detailsHref);
            tr.append($('<td>').append(links));
            target.append(tr);
        }
    }

}

function detailsView(item) {

    loadComments(item._id);

    function addComment(id) {
        let author = sessionStorage.getItem('username');
        let textComment = $('.commentForm input[name=commentField]').val();

        let newComment = {
            author:author,
            text:textComment,
            adv_id:id
        };

        let commentRequest = {
            method:"POST",
            url: kinveyBaseUrl + 'appdata/' + kinveyAppId + '/comments/',
            headers: getKinveyUserAuthHeaders(),
            contentType: 'application/json',
            data: JSON.stringify(newComment)
        };

        $.ajax(commentRequest)
            .then(function () {
                showInfo("Comment added successful!");
                $('.commentForm input').val('');
                loadComments(item._id);

            })
            .catch(handleAjaxError);
    }

    function loadComments(id) {
        let request = {
            method:"GET",
            url: kinveyBaseUrl + `appdata/${kinveyAppId}/comments/?query={"adv_id":"${id}"}`,
            headers: getKinveyUserAuthHeaders()
        };

        $.ajax(request)
            .then(function (data) {
                if(data.length==0){
                    return
                }else
                    showComments(data)
            })
            .catch(handleAjaxError);
    }

    function showComments(data) {
        let targer = $("#listComments");
        targer.empty();
        targer.append($('<h1>').text('Comments:'));
        for(let comment of data){
            let div = $('<div>').addClass('comment')
                .append($('<p>').text("Author: " + comment.author))
                .append($('<p>').text("Text: " + comment.text));
            $(targer).append(div);
        }

    }

    $('#detailsView').empty();
    showView('detailsView');
    let btn = $(' <input type="button" value="Submit">').on('click',function () {
        addComment(item._id)
    });
    let commentForm = $(`<div>
          <form>
            <label for="comment">Comment: </label>
            <input type="text"  name="commentField">
          </form>
        </div>`).addClass('commentForm');
    commentForm.append(btn);
    commentForm.css('display','none');

    let html = $('<div>');

    html.append(
        $('<img>').attr('src',item.image),
        $(`<p>Title:</p>`),
        $(`<p><b>${item.title}</b></p>`),
        $(`<p>Description:</p>`),
        $(`<p><b>${item.description}</b></p>`),
        $(`<p>Publisher:</p>`),
        $(`<p><b>${item.publisher}</b></p>`),
        $(`<p>Date:</p>`),
        $(`<p><b>${item.date}</b></p>`),
        $('<br>'),
        $("<div>").attr('id','listComments'),
        $('<br>'),
        $('<br>'),
        commentForm,
        $('<input type="button" value="Add comment">').css('background','#00bbbb').on('click',function () {
            if(commentForm.attr('display')=='none'){
                $(commentForm).fadeIn();
                commentForm.attr('display','block');
            }else{
                $(commentForm).fadeOut();
                commentForm.attr('display','none');
            }
        })
    );

    $('#detailsView').append(html)
}


function deleteAdv(id) {
    let delRequest = {
        method: "DELETE",
        url: kinveyBaseUrl + 'appdata/' + kinveyAppId + '/store/' + id,
        headers: getKinveyUserAuthHeaders()
    };
    $.ajax(delRequest)
        .then(function () {
            listAds();
            showInfo('Deleted successful!');
        })
        .catch(handleAjaxError);
}

function editAdv(item) {

    $('#viewEditAd input[name=publisher]').val(item.publisher);
    $('#viewEditAd input[name=title]').val(item.title);
    $('#viewEditAd textarea[name=description]').val(item.description);
    $('#viewEditAd input[name=datePublished]').val(item.date);
    $('#viewEditAd input[name=price]').val(item.price);
    $('#viewEditAd input[name=id]').val(item._id);
    $('#viewEditAd input[name=image]').val(item.image);


    showView('viewEditAd');

}
function createAdv() {

    let advData = {
        title:$('#formCreateAd input[name=title]').val(),
        description:$('#formCreateAd textarea[name=description]').val(),
        publisher: sessionStorage.getItem('username'),
        date: $('#formCreateAd input[name=datePublished]').val(),
        price: $('#formCreateAd input[name=price]').val(),
        image:  $('#formCreateAd input[name=image]').val()

    };

    let createRequest = {
        method:"POST",
        url: kinveyBaseUrl + "appdata/" + kinveyAppId + "/store/",
        data: JSON.stringify(advData),
        headers: getKinveyUserAuthHeaders(),
        contentType: 'application/json'
    };

    $.ajax(createRequest)
        .then(function () {
            listAds();
            showInfo('Advertisement created successful !');
        })
        .catch(handleAjaxError);
}
function sendEdinRequest() {

    let editData = {
        title:$('#viewEditAd input[name=title]').val(),
        description:$('#viewEditAd textarea[name=description]').val(),
        publisher: sessionStorage.getItem('username'),
        date: $('#viewEditAd input[name=datePublished]').val(),
        price: $('#viewEditAd input[name=price]').val(),
        image:  $('#viewEditAd input[name=image]').val()

    };
    let editRequest = {
        method:"PUT",
        url: kinveyBaseUrl + "appdata/" + kinveyAppId + "/store/" + $('#viewEditAd input[name=id]').val(),
        data: JSON.stringify(editData),
        headers: getKinveyUserAuthHeaders(),
        contentType: 'application/json'
    };
    $.ajax(editRequest)
        .then(function () {
            listAds();
            showInfo('Edited successful!')
        })
        .catch();
}