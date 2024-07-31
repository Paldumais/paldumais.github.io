// Theme switcher
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
}

// Blog posts
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let currentPage = 1;
const postsPerPage = 5;

function displayPosts(postsToDisplay = posts) {
    const blogPosts = document.getElementById('blog-posts');
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const pagePostsToDisplay = postsToDisplay.slice(startIndex, endIndex);
    
    pagePostsToDisplay.forEach((post) => {
        const article = document.createElement('article');
        article.innerHTML = `
            <h3>${escapeHtml(post.title)}</h3>
            <div class="post-content">${formatContent(post.content)}</div>
            <p>Published on: ${post.date}</p>
            <div class="comments"></div>
            <form class="comment-form">
                <input type="text" placeholder="Add a comment" required>
                <button type="submit">Comment</button>
            </form>
        `;
        
        const commentForm = article.querySelector('.comment-form');
        const commentsDiv = article.querySelector('.comments');
        
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const commentInput = commentForm.querySelector('input');
            const comment = commentInput.value;
            post.comments.push(comment);
            localStorage.setItem('posts', JSON.stringify(posts));
            displayComments(commentsDiv, post.comments);
            commentInput.value = '';
        });
        
        displayComments(commentsDiv, post.comments);
        
        blogPosts.appendChild(article);
    });

    // Apply syntax highlighting
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function formatContent(content) {
    // Replace ```language ... ``` with <pre><code class="language">...</code></pre>
    return content.replace(/```(\w+)?\s*([\s\S]*?)```/g, (match, language, code) => {
        return `<pre><code class="${language || ''}">${escapeHtml(code.trim())}</code></pre>`;
    });
}

function displayComments(commentsDiv, comments) {
    commentsDiv.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.textContent = comment;
        commentsDiv.appendChild(commentElement);
    });
}

// New post form
const postForm = document.getElementById('post-form');

postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const date = new Date().toLocaleDateString();
    
    const newPost = {
        title,
        content,
        date,
        comments: []
    };
    
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    currentPage = 1;
    document.getElementById('blog-posts').innerHTML = '';
    displayPosts();
    
    postForm.reset();
});

// Infinite scroll
let isLoading = false;
window.addEventListener('scroll', () => {
    if (!isLoading && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMorePosts();
    }
});

function loadMorePosts() {
    if (currentPage * postsPerPage < posts.length) {
        isLoading = true;
        document.getElementById('loading').style.display = 'block';
        setTimeout(() => {
            currentPage++;
            displayPosts();
            isLoading = false;
            document.getElementById('loading').style.display = 'none';
        }, 500);
    }
}

// Search functionality
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) || 
        post.content.toLowerCase().includes(searchTerm)
    );
    document.getElementById('blog-posts').innerHTML = '';
    currentPage = 1;
    displayPosts(filteredPosts);
}

// Initial display
displayPosts();
