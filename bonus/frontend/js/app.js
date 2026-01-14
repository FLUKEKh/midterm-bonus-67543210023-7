// frontend/js/app.js
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Library Management System - Client');
    setupEventListeners();
    await loadBooks();
});

function setupEventListeners() {
    // 1. ปุ่มเพิ่มหนังสือ (ID ใน HTML คือ add-btn)
    const addBtn = document.getElementById('add-btn');
    if (addBtn) addBtn.addEventListener('click', () => showBookForm());

    // 2. ปุ่มยกเลิก/ปิด Modal
    const cancelBtn = document.getElementById('cancel-btn');
    const closeSpan = document.querySelector('.close');
    if (cancelBtn) cancelBtn.addEventListener('click', () => hideBookForm());
    if (closeSpan) closeSpan.addEventListener('click', () => hideBookForm());

    // 3. ระบบ Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filterType = e.target.getAttribute('data-filter');
            currentFilter = filterType;
            loadBooks(filterType === 'all' ? null : filterType);
        });
    });

    // 4. การส่งฟอร์ม
    const bookForm = document.getElementById('book-form');
    if (bookForm) bookForm.addEventListener('submit', handleFormSubmit);
}

// --- ฟังก์ชันจัดการ Modal ---
function showBookForm(book = null) {
    const modal = document.getElementById('book-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('book-form');
    
    if (book) {
        modalTitle.textContent = 'Edit Book';
        document.getElementById('book-id').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.isbn;
    } else {
        modalTitle.textContent = 'Add New Book';
        form.reset();
        document.getElementById('book-id').value = '';
    }
    modal.style.display = 'block';
}

function hideBookForm() {
    const modal = document.getElementById('book-modal');
    if (modal) modal.style.display = 'none';
}

// --- ฟังก์ชันจัดการข้อมูล ---
async function loadBooks(status = null) {
    try {
        showLoading();
        const result = await api.getAllBooks(status);
        updateStatistics(result.statistics);
        renderBookList(result.books);
        hideLoading();
    } catch (error) {
        console.error('Error loading books:', error);
        hideLoading();
    }
}

async function borrowBook(id) {
    if (!confirm('Borrow this book?')) return;
    try {
        await api.borrowBook(id);
        await loadBooks(currentFilter === 'all' ? null : currentFilter);
    } catch (error) { alert('Error borrowing book'); }
}

async function returnBook(id) {
    if (!confirm('Return this book?')) return;
    try {
        await api.returnBook(id);
        await loadBooks(currentFilter === 'all' ? null : currentFilter);
    } catch (error) { alert('Error returning book'); }
}

async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
        await api.deleteBook(id);
        await loadBooks(currentFilter === 'all' ? null : currentFilter);
    } catch (error) { alert('Error deleting book'); }
}

async function editBook(id) {
    try {
        const book = await api.getBookById(id);
        showBookForm(book);
    } catch (error) { alert('Error loading book'); }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    try {
        const bookId = document.getElementById('book-id').value;
        const bookData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            isbn: document.getElementById('isbn').value
        };
        
        if (bookId) await api.updateBook(bookId, bookData);
        else await api.createBook(bookData);
        
        hideBookForm();
        await loadBooks(currentFilter === 'all' ? null : currentFilter);
    } catch (error) { alert('Error saving book: ' + error.message); }
}

function updateStatistics(stats) {
    document.getElementById('stat-available').textContent = stats.available;
    document.getElementById('stat-borrowed').textContent = stats.borrowed;
    document.getElementById('stat-total').textContent = stats.total;
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('book-list').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('book-list').style.display = 'grid';
}