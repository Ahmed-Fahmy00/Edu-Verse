let currentPostImage = null;

function handleImagePreview(input) {
  const preview = document.getElementById('image-preview');
  const removeBtn = document.getElementById('remove-image-btn');
  preview.innerHTML = '';
  
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentPostImage = e.target.result;
      preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width:100%;border-radius:8px;box-shadow:var(--shadow)">`;
      removeBtn.style.display = 'inline-flex';
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    currentPostImage = null;
    removeBtn.style.display = 'none';
  }
}

function removeImage() {
  document.getElementById('post-image').value = '';
  document.getElementById('image-preview').innerHTML = '';
  document.getElementById('remove-image-btn').style.display = 'none';
  currentPostImage = null;
}

async function createPost() {
  const title = document.getElementById('post-title').value;
  const body = document.getElementById('post-body').value;
  const type = document.getElementById('post-type').value;
  
  if (!title || !body) {
    alert('Please fill in all fields');
    return;
  }
  
  try {
    const postData = {
      senderId: currentUser._id,
      courseId: currentCourse._id,
      title,
      body,
      type,
      image: currentPostImage // Include image data
    };
    
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    
    if (response.ok) {
      document.getElementById('post-title').value = '';
      document.getElementById('post-body').value = '';
      removeImage();
      loadPosts();
    }
  } catch (err) {
    alert('Failed to create post: ' + err.message);
  }
}

async function loadPosts() {
  try {
    const response = await fetch(`${API_URL}/courses/${currentCourse._id}/posts`);
    const posts = await response.json();
    const list = document.getElementById('posts-list');
    
    list.innerHTML = posts.map(post => {
      const isOwnPost = post.sender.id === currentUser._id;
      return `
      <div class="post-card" onclick="openPost('${post._id}')">
        <div class="post-header">
          <div class="user-avatar">${post.sender.name.charAt(0)}</div>
          <div class="post-meta">
            <div class="post-author">${post.sender.name}</div>
            <div class="post-date">${new Date(post.createdAt).toLocaleDateString()}</div>
          </div>
          <span class="post-type ${post.type}">${post.type}</span>
          ${isOwnPost ? `<button class="btn-delete-post" onclick="deletePost(event, '${post._id}')" title="Delete post">🗑️</button>` : ''}
        </div>
        <div class="post-title">${post.title}</div>
        <div class="post-body">${post.body.substring(0, 150)}${post.body.length > 150 ? '...' : ''}</div>
        ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ''}
        <div class="post-stats">
          <span>💬 Comments</span>
          <span>👍 Reactions</span>
          ${post.type === 'question' ? `<span>${post.answered ? '✅ Answered' : '❓ Unanswered'}</span>` : ''}
        </div>
      </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading posts:', err);
  }
}

async function openPost(postId) {
  try {
    const postsResponse = await fetch(`${API_URL}/courses/${currentCourse._id}/posts`);
    const posts = await postsResponse.json();
    currentPost = posts.find(p => p._id === postId);
    
    const isOwnPost = currentPost.sender.id === currentUser._id;
    const detail = document.getElementById('post-detail');
    detail.innerHTML = `
      <div class="post-header">
        <div class="user-avatar">${currentPost.sender.name.charAt(0)}</div>
        <div class="post-meta">
          <div class="post-author">${currentPost.sender.name}</div>
          <div class="post-date">${new Date(currentPost.createdAt).toLocaleDateString()}</div>
        </div>
        <span class="post-type ${currentPost.type}">${currentPost.type}</span>
        ${isOwnPost ? `<button class="btn-delete-post" onclick="deletePostFromModal('${currentPost._id}')" title="Delete post">🗑️</button>` : ''}
      </div>
      <div class="post-title">${currentPost.title}</div>
      <div class="post-body">${currentPost.body}</div>
      ${currentPost.image ? `<img src="${currentPost.image}" class="post-image" alt="Post image">` : ''}
    `;
    
    document.getElementById('post-modal').classList.add('active');
    loadComments(postId);
    loadReactions(postId);
  } catch (err) {
    console.error('Error opening post:', err);
  }
}

async function loadChats() {
  if (!currentUser || !currentUser._id) return;
  try {
    const response = await fetch(`${API_URL}/users/${currentUser._id}/chats`);
    const chats = await response.json();
    const list = document.getElementById('chats-list');
    
    list.innerHTML = chats.map(chat => {
      const otherUser = chat.user1.id === currentUser._id ? chat.user2 : chat.user1;
      return `
        <div class="chat-item" onclick="openChat('${otherUser.id}','${otherUser.name}',event)">
          <div class="user-avatar">${otherUser.name.charAt(0)}</div>
          <div style="flex:1">
            <div style="font-weight:600">${otherUser.name}</div>
            <div style="font-size:0.85rem;color:var(--gray)">${chat.lastMessage}</div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading chats:', err);
  }
}

async function loadNotifications() {
  if (!currentUser || !currentUser._id) return;
  try {
    const postsRes = await fetch(`${API_URL}/courses?enrolled=${currentUser._id}`);
    const courses = await postsRes.json();
    let allPosts = [];
    
    for (const course of courses) {
      const response = await fetch(`${API_URL}/courses/${course._id}/posts`);
      const posts = await response.json();
      allPosts = allPosts.concat(posts.map(p => ({ ...p, courseName: course.name })));
    }
    
    const recentPosts = allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
    const notificationsList = document.getElementById('notifications-list');
    
    if (recentPosts.length === 0) {
      notificationsList.innerHTML = '<div class="notification-item"><div class="notification-content"><div class="notification-title">No new notifications</div><div class="notification-time">Check back later</div></div></div>';
      return;
    }
    
    notificationsList.innerHTML = recentPosts.map(post => {
      const timeAgo = getTimeAgo(new Date(post.createdAt));
      const icon = post.type === 'question' ? '❓' : post.type === 'announcement' ? '📢' : '💭';
      return `
        <div class="notification-item" onclick="openPostFromNotification('${post._id}','${post.courseId}')">
          <span class="notification-icon">${icon}</span>
          <div class="notification-content">
            <div class="notification-title">New ${post.type} in ${post.courseName}</div>
            <div class="notification-time">${timeAgo}</div>
          </div>
        </div>
      `;
    }).join('');
    
    if (recentPosts.length > 0) {
      document.getElementById('notification-dot').style.display = 'block';
    }
  } catch (err) {
    console.error('Error loading notifications:', err);
  }
}

function downloadFile(fileName, fileData) {
  if (!fileData || fileData === '#') {
    alert('File data not available. This is a demo file.');
    return;
  }
  
  const link = document.createElement('a');
  link.href = fileData;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function loadFiles() {
  const uploadCard = document.getElementById('upload-file-card');
  if (currentUser.role === 'instructor' || currentUser.role === 'ta') {
    uploadCard.style.display = 'block';
  } else {
    uploadCard.style.display = 'none';
  }
  
  try {
    const response = await fetch(`${API_URL}/courses/${currentCourse._id}/files`);
    const files = await response.json();
    const filesList = document.getElementById('files-list');
    
    if (files.length === 0) {
      filesList.innerHTML = '<p style="color:var(--gray);padding:2rem;text-align:center">No files uploaded yet.</p>';
      return;
    }
    
    filesList.innerHTML = files.map(file => {
      const icon = file.fileType === 'pdf' ? '📄' : file.fileType === 'image' ? '🖼️' : '📎';
      const uploadedBy = file.uploadedBy ? `${file.uploadedBy.name} (${file.uploadedBy.role})` : 'instructor';
      const date = new Date(file.createdAt).toLocaleDateString();
      
      return `
        <div class="file-item">
          <div class="file-icon">${icon}</div>
          <div class="file-details">
            <div class="file-name">${file.fileName}</div>
            <div class="file-meta">Uploaded by ${uploadedBy} • ${date}</div>
          </div>
          <button class="btn-download" onclick='downloadFile("${file.fileName}", "${file.fileData}")'>Download</button>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading files:', err);
  }
}

function handleFileSelect(input) {
  const fileInfo = document.getElementById('file-info');
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    fileInfo.innerHTML = `<strong>${file.name}</strong> (${sizeMB} MB)`;
  } else {
    fileInfo.innerHTML = '';
  }
}

async function uploadFile() {
  const title = document.getElementById('file-title').value;
  const fileInput = document.getElementById('course-file');
  
  if (!title || !fileInput.files[0]) {
    alert('Please provide a file name and select a file');
    return;
  }
  
  const file = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = async function(e) {
    try {
      const fileData = e.target.result;
      const fileType = file.type.includes('pdf') ? 'pdf' : 
                      file.type.includes('image') ? 'image' : 
                      file.type.includes('word') ? 'word' : 'other';
      
      const response = await fetch(`${API_URL}/courses/${currentCourse._id}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          fileName: title,
          fileData: fileData,
          fileType: fileType
        })
      });
      
      if (response.ok) {
        alert('File uploaded successfully!');
        document.getElementById('file-title').value = '';
        fileInput.value = '';
        document.getElementById('file-info').innerHTML = '';
        loadFiles();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload file');
      }
    } catch (err) {
      alert('Failed to upload file: ' + err.message);
    }
  };
  
  reader.readAsDataURL(file);
}


function toggleCoursesDropdown(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropdown = document.querySelector('.nav-dropdown');
  dropdown.classList.toggle('open');
  
  if (dropdown.classList.contains('open')) {
    loadSidebarCourses();
  }
}

async function loadSidebarCourses() {
  try {
    const response = await fetch(`${API_URL}/courses?enrolled=${currentUser._id}`);
    const courses = await response.json();
    const list = document.getElementById('sidebar-courses-list');
    
    if (courses.length === 0) {
      list.innerHTML = '<div style="padding:0.75rem;color:var(--gray);font-size:0.85rem">No enrolled courses</div>';
      return;
    }
    
    // Show only first 5 courses
    const displayCourses = courses.slice(0, 5);
    const hasMore = courses.length > 5;
    
    list.innerHTML = displayCourses.map(course => `
      <div class="sidebar-course-item" onclick="openCourseFromSidebar('${course._id}')">
        <span>📚</span>
        <span>${course.name}</span>
      </div>
    `).join('');
    
    // Add "More Courses" button if there are more than 5 courses
    if (hasMore) {
      list.innerHTML += `
        <div class="sidebar-course-item more-courses-btn" onclick="showAllCoursesPage(event)">
          <span>➕</span>
          <span>More Courses (${courses.length - 5})</span>
        </div>
      `;
    }
  } catch (err) {
    console.error('Error loading sidebar courses:', err);
  }
}

function openCourseFromSidebar(courseId) {
  document.querySelector('.nav-dropdown').classList.remove('open');
  openCourse(courseId);
}

function showAllCoursesPage(e) {
  e.stopPropagation();
  document.querySelector('.nav-dropdown').classList.remove('open');
  switchView('my-courses');
}

async function deletePost(event, postId) {
  event.stopPropagation();
  
  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser._id })
    });
    
    if (response.ok) {
      loadPosts();
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to delete post');
    }
  } catch (err) {
    alert('Failed to delete post: ' + err.message);
  }
}

async function deletePostFromModal(postId) {
  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser._id })
    });
    
    if (response.ok) {
      closePostModal();
      loadPosts();
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to delete post');
    }
  } catch (err) {
    alert('Failed to delete post: ' + err.message);
  }
}


// Message Attachment Functions
let currentMessageAttachment = null;

function toggleAttachmentMenu() {
  const menu = document.getElementById('attachment-menu');
  menu.classList.toggle('active');
}

function selectMessageImage() {
  const menu = document.getElementById('attachment-menu');
  menu.classList.remove('active');
  document.getElementById('message-image-input').click();
}

function selectMessageFile() {
  const menu = document.getElementById('attachment-menu');
  menu.classList.remove('active');
  document.getElementById('message-file-input').click();
}

function handleMessageImage(input) {
  const preview = document.getElementById('message-attachment-preview');
  
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentMessageAttachment = {
        type: 'image',
        data: e.target.result,
        name: input.files[0].name
      };
      
      preview.innerHTML = `
        <img src="${e.target.result}" alt="Preview">
        <button class="btn-remove-attachment" onclick="removeMessageAttachment()">Remove</button>
      `;
      preview.classList.add('active');
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function handleMessageFile(input) {
  const preview = document.getElementById('message-attachment-preview');
  
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      currentMessageAttachment = {
        type: 'file',
        data: e.target.result,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2)
      };
      
      preview.innerHTML = `
        <div class="attachment-info">
          <span>📄</span>
          <div>
            <strong>${file.name}</strong>
            <div style="font-size:0.85rem;color:var(--gray)">${currentMessageAttachment.size} MB</div>
          </div>
        </div>
        <button class="btn-remove-attachment" onclick="removeMessageAttachment()">Remove</button>
      `;
      preview.classList.add('active');
    };
    reader.readAsDataURL(file);
  }
}

function removeMessageAttachment() {
  currentMessageAttachment = null;
  document.getElementById('message-attachment-preview').classList.remove('active');
  document.getElementById('message-image-input').value = '';
  document.getElementById('message-file-input').value = '';
}

// Override sendMessage to include attachments and replies - MUST run after page load
setTimeout(() => {
  window.sendMessage = async function() {
    console.log('NEW sendMessage called with attachment:', currentMessageAttachment);
    const text = document.getElementById('message-text').value;
    if ((!text || text.trim() === '') && !currentMessageAttachment) return;
    if (!currentChat) return;
    
    try {
      // Get reply data if available
      const replyData = window.getReplyData ? window.getReplyData() : null;
      console.log('Reply data from getReplyData:', replyData);
      
      const messageData = {
        senderId: currentUser._id,
        receiverId: currentChat.userId,
        text: text || '',
        attachment: currentMessageAttachment,
        replyTo: replyData ? {
          text: replyData.text,
          sender: replyData.sender,
          hasImage: replyData.hasImage || false,
          hasFile: replyData.hasFile || false,
          fileName: replyData.fileName || null
        } : null
      };
      
      console.log('Sending message with data:', messageData);
      console.log('ReplyTo data:', messageData.replyTo);
      
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      
      if (response.ok) {
        console.log('Message sent successfully');
        document.getElementById('message-text').value = '';
        removeMessageAttachment();
        await window.loadMessages(currentChat.userId);
        await loadChats();
      } else {
        console.error('Failed to send message:', await response.text());
      }
    } catch (err) {
      console.error('Send message error:', err);
      alert('Failed to send message: ' + err.message);
    }
  };
  console.log('sendMessage function overridden');
}, 1000);

// Override loadMessages to display attachments and replies - MUST run after page load
setTimeout(() => {
  window.loadMessages = async function(otherUserId) {
    console.log('NEW loadMessages called');
    try {
      const response = await fetch(`${API_URL}/messages/${currentUser._id}/${otherUserId}`);
      const messages = await response.json();
      console.log('Loaded messages:', messages);
      const list = document.getElementById('messages-list');
      
      list.innerHTML = messages.map(msg => {
        const isSent = msg.senderId === currentUser._id;
        let attachmentHTML = '';
        let replyHTML = '';
        
        // Add reply indicator if message is a reply (WhatsApp style)
        if (msg.replyTo) {
          console.log('Message has replyTo:', msg.replyTo);
          
          // Truncate long text
          const maxLength = 50;
          const text = msg.replyTo.text || 'Message';
          const replyContent = text.length > maxLength 
            ? text.substring(0, maxLength) + '...' 
            : text;
          
          replyHTML = `
            <div class="message-reply-indicator">
              <div class="message-reply-indicator-label">↩️ ${msg.replyTo.sender}</div>
              <div class="message-reply-indicator-text">${replyContent}</div>
            </div>
          `;
        }
        
        if (msg.attachment) {
          console.log('Message has attachment:', msg.attachment);
          if (msg.attachment.type === 'image') {
            attachmentHTML = `
              <div class="message-attachment">
                <img src="${msg.attachment.data}" alt="${msg.attachment.name}" onclick="window.open('${msg.attachment.data}', '_blank')">
              </div>
            `;
          } else if (msg.attachment.type === 'file') {
            attachmentHTML = `
              <div class="message-file" onclick="downloadMessageFile('${msg.attachment.name}', '${msg.attachment.data}')">
                <span>📄</span>
                <div>
                  <strong>${msg.attachment.name}</strong>
                  <div style="font-size:0.85rem;opacity:0.8">${msg.attachment.size} MB</div>
                </div>
              </div>
            `;
          }
        }
        
        return `
          <div class="message ${isSent ? 'sent' : 'received'}" data-message-id="${msg._id}">
            <div class="message-bubble">
              ${replyHTML}
              ${msg.text ? `<div>${msg.text}</div>` : ''}
              ${attachmentHTML}
              <div class="message-time">${new Date(msg.createdAt).toLocaleTimeString()}</div>
            </div>
          </div>
        `;
      }).join('');
      
      list.scrollTop = list.scrollHeight;
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };
  console.log('loadMessages function overridden');
}, 1000);

function downloadMessageFile(fileName, fileData) {
  const link = document.createElement('a');
  link.href = fileData;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Close attachment menu when clicking outside
document.addEventListener('click', function(e) {
  const menu = document.getElementById('attachment-menu');
  const btn = document.querySelector('.btn-attachment');
  
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('active');
  }
});


// Password Toggle Function
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const isPassword = input.type === 'password';
  
  input.type = isPassword ? 'text' : 'password';
  button.classList.toggle('active');
  
  if (isPassword) {
    button.innerHTML = '<span class="hide-icon">🙈</span>';
  } else {
    button.innerHTML = '<span class="show-icon">👁️</span>';
  }
}

// Handle Role Change for Level Field
function handleRoleChange() {
  const role = document.getElementById('signup-role').value;
  const levelGroup = document.getElementById('level-group');
  const levelInput = document.getElementById('signup-level');
  const label = levelGroup.querySelector('label');
  
  if (role === 'student') {
    // Level is required for students
    levelInput.required = true;
    label.innerHTML = 'Level <span class="required-indicator">*</span>';
    levelGroup.style.display = 'block';
  } else {
    // Level is optional for TA and Instructor
    levelInput.required = false;
    label.innerHTML = 'Level <span class="optional-indicator">(optional)</span>';
    levelGroup.style.display = 'block';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Set initial state for level field
  if (document.getElementById('signup-role')) {
    handleRoleChange();
  }
});
