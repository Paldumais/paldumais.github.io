import os
import sys
import datetime
import markdown
import json
import re

POSTS_DIR = 'posts'
DRAFTS_DIR = 'drafts'
INDEX_FILE = 'index.html'

def ensure_dirs():
    for dir in [POSTS_DIR, DRAFTS_DIR]:
        if not os.path.exists(dir):
            os.makedirs(dir)

def load_posts(directory=POSTS_DIR):
    posts = []
    for filename in os.listdir(directory):
        if filename.endswith('.md'):
            with open(os.path.join(directory, filename), 'r') as f:
                content = f.read()
                metadata, content = content.split('---\n', 1)
                metadata = json.loads(metadata)
                posts.append({
                    'filename': filename,
                    'title': metadata['title'],
                    'date': metadata['date'],
                    'categories': metadata.get('categories', []),
                    'tags': metadata.get('tags', []),
                    'content': content.strip()
                })
    return sorted(posts, key=lambda x: x['date'], reverse=True)

def save_post(filename, title, content, categories, tags, directory=POSTS_DIR):
    metadata = {
        'title': title,
        'date': datetime.datetime.now().isoformat(),
        'categories': categories,
        'tags': tags
    }
    full_content = json.dumps(metadata) + '\n---\n' + content
    with open(os.path.join(directory, filename), 'w') as f:
        f.write(full_content)

def update_index_html(posts):
    with open(INDEX_FILE, 'r') as f:
        content = f.read()

    start_marker = '<!-- BLOG-POST-LIST:START -->'
    end_marker = '<!-- BLOG-POST-LIST:END -->'
    start_index = content.index(start_marker) + len(start_marker)
    end_index = content.index(end_marker)

    post_html = '\n'.join([
        f'''
        <div class="post">
            <div class="post-image" style="background-image: url('/api/placeholder/400/200');"></div>
            <div class="post-content">
                <h3>{post['title']}</h3>
                <p>{markdown.markdown(post['content'][:150])}...</p>
                <p>Categories: {', '.join(post['categories'])}</p>
                <p>Tags: {', '.join(post['tags'])}</p>
                <a href="posts/{post['filename']}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
        '''
        for post in posts[:2]  # Display only the two most recent posts
    ])

    updated_content = content[:start_index] + post_html + content[end_index:]

    with open(INDEX_FILE, 'w') as f:
        f.write(updated_content)

def create_post(is_draft=False):
    title = input("Enter post title: ")
    filename = input("Enter filename (e.g., my-post.md): ")
    categories = input("Enter categories (comma-separated): ").split(',')
    tags = input("Enter tags (comma-separated): ").split(',')
    print("Enter your post content (press Ctrl+D when finished):")
    content = sys.stdin.read().strip()

    directory = DRAFTS_DIR if is_draft else POSTS_DIR
    save_post(filename, title, content, categories, tags, directory)
    print(f"{'Draft' if is_draft else 'Post'} '{title}' has been created.")

def edit_post(is_draft=False):
    directory = DRAFTS_DIR if is_draft else POSTS_DIR
    posts = load_posts(directory)
    for i, post in enumerate(posts):
        print(f"{i+1}. {post['title']}")
    
    choice = int(input(f"Enter the number of the {'draft' if is_draft else 'post'} you want to edit: ")) - 1
    post = posts[choice]

    print(f"Editing '{post['title']}'")
    new_title = input(f"Enter new title (press Enter to keep '{post['title']}'): ") or post['title']
    new_categories = input(f"Enter new categories (comma-separated, press Enter to keep {post['categories']}): ").split(',') or post['categories']
    new_tags = input(f"Enter new tags (comma-separated, press Enter to keep {post['tags']}): ").split(',') or post['tags']
    print("Enter your updated post content (press Ctrl+D when finished):")
    new_content = sys.stdin.read().strip() or post['content']

    save_post(post['filename'], new_title, new_content, new_categories, new_tags, directory)
    print(f"{'Draft' if is_draft else 'Post'} '{new_title}' has been updated.")

def publish_draft():
    drafts = load_posts(DRAFTS_DIR)
    for i, draft in enumerate(drafts):
        print(f"{i+1}. {draft['title']}")
    
    choice = int(input("Enter the number of the draft you want to publish: ")) - 1
    draft = drafts[choice]

    save_post(draft['filename'], draft['title'], draft['content'], draft['categories'], draft['tags'], POSTS_DIR)
    os.remove(os.path.join(DRAFTS_DIR, draft['filename']))
    print(f"Draft '{draft['title']}' has been published.")

def main():
    ensure_dirs()
    
    while True:
        print("\nPaldumais Labs Post Manager")
        print("1. Create a new post")
        print("2. Create a new draft")
        print("3. Edit an existing post")
        print("4. Edit an existing draft")
        print("5. Publish a draft")
        print("6. Publish posts to index page")
        print("7. Exit")
        
        choice = input("Enter your choice (1-7): ")
        
        if choice == '1':
            create_post()
        elif choice == '2':
            create_post(is_draft=True)
        elif choice == '3':
            edit_post()
        elif choice == '4':
            edit_post(is_draft=True)
        elif choice == '5':
            publish_draft()
        elif choice == '6':
            posts = load_posts()
            update_index_html(posts)
            print("Index page has been updated with the latest posts.")
        elif choice == '7':
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
