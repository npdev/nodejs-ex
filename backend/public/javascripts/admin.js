var postListData = [];

$(document).ready(function() {
    populateContent();

    // Add Post
    $('button#add').on("click", function(){
        // Super basic validation - increase errorCount variable if any fields are blank
        var errorCount = 0;
        $('#addPost input').each(function(index, val) {
            if($(this).val() === '') { errorCount++; }
        });

        // Check and make sure errorCount's still at zero
        if(errorCount === 0) {
            var newPost = {
                'title': $('input#inputTitle').val(),
                'firstName': $('input#inputAuthorFirstName').val(),
                'lastName': $('input#inputAuthorLastName').val(),
                'content': $('textarea#inputContent').val(),
            };
            console.log(newPost);
            // Use AJAX to post the object to our adduser service
            $.ajax({
                type: 'POST',
                data: newPost,
                url: '/api/admin/addpost',
            }).done(function( response ) {

                // Check for successful (blank) response
                if (response.msg === '') {
                    // Clear the form inputs
                    $('#addPost fieldset input').val('');
                    // Update the table
                    populateContent();
                }
                else {
                    // If something goes wrong, alert the error message that our service returned
                    alert('Error: ' + response.msg);
                }
            });
        }
        else {
            // If errorCount is more than 0, error out
            alert('Please fill in all fields');
            return false;
        }
    });

});

// Fill table with data
function populateContent() {

    // Empty content string
    var postContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/api/posts', function( data ) {

        postListData = data;

        $.each(data, function(){
            postContent += '<article>';
            postContent += '<h2>' + this.title + '</h2>';
            postContent += '<a class="edit" href="#" rel="' + this._id +'">Edit</a>';
            postContent += '</article>';
        });

        $('#blogList').html(postContent);
});
}
