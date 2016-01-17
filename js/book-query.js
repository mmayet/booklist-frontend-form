jQuery(document).ready(function($) {
  var $thumbnail_img  = $('#book-select-thumbnail-img');
  var $thumbnail  = $('#book-select-thumbnail');
  var $title      = $('#book-select-title');
  var $author     = $('#book-select-author');
  var $desc       = $('#book-select-description');
  var $isbn       = $('#book-select-isbn');
  var $bookUrl    = $('#book-select-url');

  // Allows some fields to be editable.
  addEditability($('#book-select-title-label'), $title, 'readonly');
  addEditability($('#book-select-author-label'), $author, 'readonly');
  addEditability($('#book-select-description-label'), $desc, 'readonly');
  addEditability($('#book-select-thumbnail-label'), $thumbnail, 'hidden');
  addEditability($('#book-select-isbn-label'), $isbn, 'readonly');
  addEditability($('#book-select-url-label'), $bookUrl, 'readonly');
  
  // Makes a labeled field editable.
  function addEditability($label, $field, disabledAttr) {

    var disabled = $field.attr(disabledAttr) != true;
    var editText = '[edit]';
    var doneText = '[done]';
    var $editLink = $(document.createElement('a'));

    // Set default edit link text.
    $editLink.text(disabled ? editText : doneText);

    $editLink.click(function(evt) {
      evt.preventDefault();

      // Toggle edit link state and update link text.
      disabled = !disabled;
      this.innerHTML = disabled ? editText : doneText;

      // Toggle editing for the given field.
      $field.attr(disabledAttr, disabled)
      if (!disabled) { 
        this.style.color = 'red';
        this.style.fontWeight = 'bold';
        $field.focus(); 
      } else {
        this.style.color = '';
        this.style.fontWeight = '';
      }

    });

    // Edit link needs to go after the label.
    $editLink
      .addClass('edit-link')
      .appendTo($label.find('p'));

  }

  // Event handler for updating thumbnail image to match thumbnail field.
  $thumbnail.focusout(function(evt) {
    $thumbnail_img.attr('src', this.value);
  });

  $("#book-search-text").select2({
      placeholder: "Search for a book",
      minimumInputLength: 3,
      ajax: {
          url: "https://www.googleapis.com/books/v1/volumes",
          dataType: 'jsonp',
          quietMillis: 100,
          data: function (term, page) { // page is the one-based page number tracked by Select2
              return {
                  q: term, //search term
                  maxResults: 10, // page size
                  startIndex: page // page number
              };
          },
          results: function (data, page) {
              var more = (page * 10) < data.totalItems; // whether or not there are more results available
   
              // notice we return the value of more so Select2 knows if more results can be loaded
              return {results: data.items, more: more};
          }
      },
      formatResult:  function(book) {
          var markup = "<table class='book-result'><tr>";
          if (book.volumeInfo.imageLinks !== undefined && book.volumeInfo.imageLinks.smallThumbnail !== undefined) {
              markup += "<td class='book-image'><img src='" + book.volumeInfo.imageLinks.smallThumbnail + "'/></td>";
          }
          markup += "<td class='book-info'><div class='book-title'>" + book.volumeInfo.title + "</div>";

          if (book.volumeInfo.authors !== undefined) {
              markup += "<div class='book-authors'>" + book.volumeInfo.authors + "</div>";
          }
          markup += "</td></tr></table>";
          return markup;
      }, // omitted for brevity, see the source of this page
      formatSelection: function(book) {
          return book.volumeInfo.title;
      }, // omitted for brevity, see the source of this page
      dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
      escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
  });

  $("#book-search-text").on("select2-selecting",function(data) {
    $thumbnail_img.attr('src', data.object.volumeInfo.imageLinks.thumbnail);
    $thumbnail.val(data.object.volumeInfo.imageLinks.thumbnail);
    $title.val(data.object.volumeInfo.title);
    $author.val(data.object.volumeInfo.authors.join(', '));
    $desc.text(data.object.volumeInfo.description);
    $isbn.val(data.object.volumeInfo.industryIdentifiers[0].identifier);
    $bookUrl.val(data.object.volumeInfo.infoLink);
  });

});