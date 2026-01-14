// frontend/js/components/bookForm.js
function showBookForm(book = null) {
    const modal = document.getElementById('book-modal');
    const modalTitle = document.getElementById('modal-title');
    const bookForm = document.getElementById('book-form');
    const bookIdInput = document.getElementById('book-id');
    
    if (book === null) {
        // Create mode
        modalTitle.textContent = 'Add New Book';
        bookForm.reset();
        bookIdInput.value = '';
    } else {
        // Edit mode - pre-fill data
        modalTitle.textContent = 'Edit Book';
        bookIdInput.value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.isbn;
    }
    
    modal.style.display = 'flex';
}

function hideBookForm() {
    const modal = document.getElementById('book-modal');
    modal.style.display = 'none';
}