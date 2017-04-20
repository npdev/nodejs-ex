var postListData = [];

$(document).ready(function() {
    populateContent();

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
            postContent += '<div>' + this.content + '</div>';
            postContent += '<a class="details" href="#" rel="' + this._id +'">Show Details</a>';
            postContent += '</article>';
        });

        $('#blogList').html(postContent);

        $('#blogList article a.details').on("click", function(){
            var id = $(this).attr('rel');
            console.log(id);
            var postContent = '';
            $.getJSON( '/api/posts/'+id, function( data ) {
                    $('#blog').text(data.title);
                    postContent += '<article>';
                    postContent += '<strong>Author: ' + data.author.firstName + '&nbsp;' + data.author.lastName + '</strong><br>';
                    postContent += '<div>' + data.content + '</div>';
                    postContent += '</article>';
                $('#blogList').html(postContent);
        });
    });
});
}
