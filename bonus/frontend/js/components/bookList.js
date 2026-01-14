// frontend/js/components/bookList.js
function renderBookList(books) {
    const container = document.getElementById('book-list');
    if (!container) return;

    if (!books || books.length === 0) {
        container.innerHTML = '<p class="no-data">No books found.</p>';
        return;
    }
    
    const html = books.map(book => `
        <div class="book-card" data-id="${book.id}">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
                <p><strong>Status:</strong> 
                    <span class="status ${book.status.toLowerCase()}">${book.status}</span>
                </p>
            </div>
            <div class="actions">
                ${book.status.toLowerCase() === 'available' 
                    ? `<button class="btn-borrow" onclick="borrowBook(${book.id})">Borrow</button>`
                    : `<button class="btn-return" onclick="returnBook(${book.id})">Return</button>`
                }
                <button class="btn-edit" onclick="editBook(${book.id})">Edit</button>
                <button class="btn-delete danger" onclick="deleteBook(${book.id})">Delete</button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}