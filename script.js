let nextPageToken = '';
let videoId = '';
let isLoading = false;
let searchType = 'comment';
let searchTerm;
let orderby = 'relevance';

// Select the sortOptions dropdown
const sortOptions = document.getElementById('sortOptions') == '' ? 'relevance' : document.getElementById('sortOptions');

document.getElementById('youtubeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const youtubeUrl = document.getElementById('youtubeUrl').value;
    videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
        alert('Invalid YouTube URL. Please enter a valid URL.');
        return;
    }
    searchType = 'comment';

    nextPageToken = '';
    document.getElementById('commentsSection').innerHTML = '';
    // fetchComments('', sortOptions.value);
    fetchVideoDetails();
});

document.getElementById('commentsSection').addEventListener('scroll', function() {
    if (this.scrollTop + this.clientHeight >= this.scrollHeight - 10) {
        fetchRemainingComments(searchType);
    }
});

function extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// function fetchComments() {
//     if (isLoading || !videoId) return;

//     isLoading = true;
//     let apiUrl = `fetch_comments.php?videoId=${videoId}&pageToken=${nextPageToken}&maxResults=100&order=time`;

//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             displayComments(data.items);
//             nextPageToken = data.nextPageToken || '';
//             isLoading = false;
//         })
//         .catch(error => {
//             console.error('Error fetching comments:', error);
//             isLoading = false;
//         });
// }

function displayComments(comments) {
    const commentsSection = document.getElementById('commentsSection');
    const searchGroup = document.getElementById('searchCommentContainer');

    searchGroup.style.display = 'block'; // Show the search input

    if (!comments || comments.length === 0) {
        commentsSection.innerHTML = '<p>No comments found.</p>';
        return;
    }

    comments.forEach(commentItem => {
        const topComment = commentItem.snippet.topLevelComment.snippet;
        const replies = commentItem.replies ? commentItem.replies.comments : [];
        const totalReplyCount = commentItem.snippet.totalReplyCount;

        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        // Display top-level comment with toggle button for replies
        commentDiv.innerHTML = `
            <div>
                <img src="${topComment.authorProfileImageUrl}" alt="Author Profile" style="width: 40px; height: 40px;">
                <strong>${topComment.authorDisplayName}</strong> 
                <span style="float: right; font-size: 12px; color: grey;">Updated: ${new Date(topComment.updatedAt).toLocaleString()}</span>
                <span class="hidden-icon" title="Published at: ${new Date(topComment.publishedAt).toLocaleString()}">
                    <i class="fa fa-info-circle" style="color: grey;"></i>
                </span>
                <p>${topComment.textDisplay}</p>
                <p>${formatNumbers(topComment.likeCount)}👍 likes</p>
                <button class="reply-toggle-btn reply-btn" data-comment-id="${commentItem.id}">
                    <span class="pico-color-black">Show Replies (${totalReplyCount})</span> <i class="arrow down"></i>
                </button>
                <div class="replies" id="replies-${commentItem.id}" style="display: none; margin-left: 40px;"></div>
            </div>
        `;

        commentsSection.appendChild(commentDiv);

        // Add event listener to toggle replies when button is clicked
        const replyBtn = commentDiv.querySelector('.reply-toggle-btn');
        replyBtn.addEventListener('click', () => toggleReplies(commentItem.id, replies, replyBtn, totalReplyCount));
    });

    linksAsExternal();
}


function displayVideoDetails(videoDetails) {
    const videoDetailsDiv = document.getElementById('videoDetails');
    // <div><img src="./assets/icons/android-chrome-512x512.png" alt="" style="height:20vh;width:auto;margin-right:2rem"></div>
    //       <div class="videoDetails">
    //         <h2>VideoTitle</h2>
    //         <p>Channel Name: <span></span></p>
    //         <p>Published on: <span></span></p> 
    //         <p>Published Date: <span></span></p> 
    //         <p>Views: <span></span></p>
    //         <p>Likes: <span></span></p>
    //         <p>Total Comments: <span></span></p>
    //       </div>
    // console.log(videoDetails[0].snippet.title);
    videoDetailsDiv.innerHTML = `
    <article style="display:flex;">
        <div><img src="${videoDetails[0].snippet.thumbnails.high.url}" alt="" style="height:${videoDetails[0].snippet.thumbnails.high.height}px;width:${videoDetails[0].snippet.thumbnails.high.width}px;margin-right:2rem"></div>
        <div style="margin-left:2rem" class="detailedVideo">
            <h2>${videoDetails[0].snippet.title}</h2>
            <p>Channel Name: <span>${videoDetails[0].snippet.channelTitle}</span></p>
            <p>Published on: <span>${new Date(videoDetails[0].snippet.publishedAt).toLocaleString()}</span></p> 
            <p>Views: <span>${formatNumbers(videoDetails[0].statistics.viewCount)}</span></p>
            <p>Likes: <span>${formatNumbers(videoDetails[0].statistics.likeCount)}</span></p>
            <p>Total Comments: <span>${formatNumbers(videoDetails[0].statistics.commentCount)}</span></p>
            <button class="reply-toggle-btn" data-comment-id="${videoDetails[0].id}" onclick="fetchComments('');" style="color:black">Show Comments</button>
        </div>
    </article>
    `;
}   




function toggleReplies(commentId, replies, button, totalReplyCount) {
    const repliesDiv = document.getElementById(`replies-${commentId}`);
    const isHidden = repliesDiv.style.display === 'none';

    if (isHidden) {
        repliesDiv.style.display = 'block';  // Show replies

        // Change button text to "Hide Replies"
        button.innerHTML = `<span class="pico-color-black">Hide Replies (${totalReplyCount})</span> <i class="arrow up"></i>`;

        // If replies are not already loaded, populate them
        if (repliesDiv.innerHTML === '') {
            // Show loading spinner
            showLoadingSpinner();

            // Display initially loaded replies
            replies.forEach(reply => {
                appendReply(reply, repliesDiv);
            });

            // Hide loading spinner after initial replies are displayed
            hideLoadingSpinner();

            // If there are more replies to load, fetch them
            if (replies.length < totalReplyCount) {
                fetchRemainingReplies(commentId, repliesDiv);
            }
        }
    } else {
        repliesDiv.style.display = 'none';  // Hide replies
        button.innerHTML = `<span class="pico-color-black">Show Replies (${totalReplyCount})</span> <i class="arrow down"></i>`;
    }
}

let isLoadingReplies = false; // Flag to prevent multiple loads

function fetchRemainingReplies(commentId, repliesDiv, pageToken = '') {
    if (isLoadingReplies) return; // Prevent multiple concurrent requests

    isLoadingReplies = true; // Set loading flag
    showLoadingSpinner(); // Show spinner before starting the AJAX request

    let apiUrl = `https://sweetremark.com/fetch_comments.php?parentId=${commentId}&pageToken=${pageToken}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Display additional replies
            displayReplies(data.items, repliesDiv);

            // Reset loading flag
            isLoadingReplies = false;
            hideLoadingSpinner(); // Hide spinner after the AJAX request completes

            // If there are more replies (pagination), set up scroll event for loading more
            if (data.nextPageToken) {
                // Setup scroll listener for repliesDiv
                attachScrollListener(commentId, repliesDiv, data.nextPageToken);
            }
        })
        .catch(error => {
            console.error('Error fetching additional replies:', error);
            isLoadingReplies = false;
            hideLoadingSpinner(); // Hide spinner on error
        });
}


// Function to attach scroll listener for loading more replies
function attachScrollListener(commentId, repliesDiv, nextPageToken) {
    repliesDiv.addEventListener('scroll', function onScroll() {
        // Check if the user has scrolled to the bottom of the repliesDiv
        if (repliesDiv.scrollTop + repliesDiv.clientHeight >= repliesDiv.scrollHeight - 10) {
            // Remove listener temporarily to avoid multiple triggers
            repliesDiv.removeEventListener('scroll', onScroll);

            // Fetch the next page of replies
            fetchRemainingReplies(commentId, repliesDiv, nextPageToken);
        }
    });
}

isLoadingComments = false;



function displayReplies(replies, repliesDiv) {
    replies.forEach(reply => {
        const snippet = reply.snippet;

        // Create a container for the reply
        const replyDiv = document.createElement('div');
        replyDiv.className = 'reply';

        // Construct the reply's HTML
        replyDiv.innerHTML = `
            <div class="reply-header">
                <img src="${snippet.authorProfileImageUrl}" alt="Author's profile picture" class="profile-pic">
                <span class="username">${snippet.authorDisplayName}</span>

                <!-- UpdatedAt displayed at the right of the username for replies -->
                <span style="float: right; font-size: 12px; color: grey;">Updated ${new Date(snippet.updatedAt).toLocaleString()}&nbsp;&nbsp;</span>

                <!-- Hidden publishedAt icon -->
                <span class="published-at-icon" title="Published on ${new Date(snippet.publishedAt).toLocaleString()}" style="display: none;">
                    🕒
                </span>
            </div>
            <div class="reply-text">${snippet.textDisplay}</div>
            <div class="reply-footer">
                <span class="like-count">${formatNumbers(snippet.likeCount)}👍 likes</span>
            </div>
        `;

        // Append the reply to the repliesDiv
        repliesDiv.appendChild(replyDiv);

        linksAsExternal();
    });
}


function appendReply(reply, repliesDiv) {
    const replySnippet = reply.snippet;
    const replyDiv = document.createElement('div');
    replyDiv.classList.add('reply');

    // replyDiv.innerHTML = `
    //     <img src="${replySnippet.authorProfileImageUrl}" alt="Author Profile" style="width: 30px; height: 30px;">
    //     <strong>${replySnippet.authorDisplayName}</strong>: ${replySnippet.textDisplay}
    //     <p>${formatNumbers(replySnippet.likeCount)}👍 likes</p>
    // `;
    replyDiv.innerHTML = `
            <div class="reply-header">
                <img src="${replySnippet.authorProfileImageUrl}" alt="Author's profile picture" class="profile-pic">
                <span class="username">${replySnippet.authorDisplayName}</span>

                <!-- UpdatedAt displayed at the right of the username for replies -->
                <span style="float: right; font-size: 12px; color: grey;">Updated ${new Date(replySnippet.updatedAt).toLocaleString()}&nbsp;&nbsp;</span>

                <!-- Hidden publishedAt icon -->
                <span class="published-at-icon" title="Published on ${new Date(replySnippet.publishedAt).toLocaleString()}" style="display: none;">
                    🕒
                </span>
            </div>
            <div class="reply-text">${replySnippet.textDisplay}</div>
            <div class="reply-footer">
                <span class="like-count">${formatNumbers(replySnippet.likeCount)}👍 likes</span>
            </div>
        `;

    // replyDiv.innerHTML = `


    repliesDiv.appendChild(replyDiv);
}

// Function to show loading spinner
function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

// Function to hide loading spinner
function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}


// Add event listener for the 'change' event
// sortOptions.addEventListener('change', function() {
//     const selectedOrder = sortOptions.value; // Get the selected value (relevance or time)
//     fetchComments('', selectedOrder); // Call fetchComments with the selected order
//     console.log('orderby:', selectedOrder);
// });


function fetchVideoDetails() {
    if (isLoading || !videoId) return;

    showLoadingSpinner(); // Show spinner before starting the AJAX request

    isLoading = true;
    let apiUrl = `https://sweetremark.com/fetch_comments.php?videoId=${videoId}&type=details`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayVideoDetails(data.items);
            nextPageToken = data.nextPageToken || '';
            isLoading = false;
            hideLoadingSpinner(); // Hide spinner after the AJAX request completes
        }
        )
        .catch(error => {
            console.error('Error fetching comments:', error);
            isLoading = false;
            hideLoadingSpinner(); // Hide spinner on error
        }
        );
}




function fetchComments(searchTerm = '') {
    // console.log('orderby:', sortOptions.value);
    if (isLoading || !videoId) return;
    // orderby == '' ? 'relevance' : sortOptions.value;

    showLoadingSpinner(); // Show spinner before starting the AJAX request

    isLoading = true;
    let apiUrl = `https://sweetremark.com/fetch_comments.php?videoId=${videoId}&pageToken=${nextPageToken}&maxResults=30&order=${sortOptions.value == '' ? 'relevance' : sortOptions.value}`;

    if (searchTerm) {
        apiUrl += `&searchTerms=${searchTerm}`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            displayComments(data.items);
            nextPageToken = data.nextPageToken || '';
            isLoading = false;
            hideLoadingSpinner(); // Hide spinner after the AJAX request completes

        })
        .catch(error => {
            console.error('Error fetching comments:', error);
            isLoading = false;
            hideLoadingSpinner(); // Hide spinner on error
            NoResults();
        });
}


// Similarly modify fetchRemainingComments
function fetchRemainingComments(orderby='relevance') {
    if (isLoadingComments || !nextPageToken) return;

    showLoadingSpinner(); // Show spinner before starting the AJAX request

    isLoadingComments = true;
    let apiUrl = `https://sweetremark.com/fetch_comments.php?videoId=${videoId}&pageToken=${nextPageToken}&maxResults=30&order=${orderby}`;

    if (searchTerm) {
        apiUrl += `&searchTerms=${searchTerm}`;
    }


    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayComments(data.items);
            nextPageToken = data.nextPageToken || '';
            isLoadingComments = false;
            hideLoadingSpinner(); // Hide spinner after the AJAX request completes
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
            isLoadingComments = false;
            hideLoadingSpinner(); // Hide spinner on error
        });
}

function NoResults() {
    const commentsSection = document.getElementById('commentsSection');
    commentsSection.innerHTML = '<p>No comments found.</p>';
}


// Debounce function to limit how often the scroll event triggers
function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

document.getElementById('commentsSection').addEventListener('scroll', debounce(function() {
    if (this.scrollTop + this.clientHeight >= this.scrollHeight - 10) {
        fetchRemainingComments(searchType);
    }
}, 200)); // Adjust the delay (200ms) as needed


function fetchRemainingComments(searchType='', orderby='relevance') {
    if (isLoadingComments || !nextPageToken) return; // Prevent multiple concurrent requests or if no more pages

    showLoadingSpinner(); // Show spinner before starting the AJAX request

    isLoadingComments = true; // Set loading flag

    let apiUrl = `https://sweetremark.com/fetch_comments.php?videoId=${videoId}&pageToken=${nextPageToken}&maxResults=30&order=${orderby}`;

    if (searchType === 'search') {
        apiUrl += `&searchTerms=${searchTerm}`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayComments(data.items);

            // Update the nextPageToken or reset it if no more pages
            nextPageToken = data.nextPageToken || '';
            isLoadingComments = false; // Reset the loading flag
            hideLoadingSpinner(); // Hide spinner after the AJAX request completes

        })
        .catch(error => {
            console.error('Error fetching comments:', error);
            isLoadingComments = false; // Reset loading flag on error            
            hideLoadingSpinner(); // Hide spinner after the AJAX request completes
        });
}

// Add event listener to the search button

    document.getElementById('searchCommentBtn').addEventListener('click', function() {
        searchTerm = document.getElementById('searchInput').value.trim(); // Get search input value
        if (!searchTerm) {
            alert('Please enter a search term.');
            return;
        }
        searchType = 'search'; // Set search type to 'search'

        // Clear previous comments and reset nextPageToken for a fresh search
        nextPageToken = '';
        document.getElementById('commentsSection').innerHTML = '';

        document.querySelector('DOMContentLoaded', function() {
                // setTimeout(() => {
                    document.querySelectorAll(".reply-btn").forEach(btn => {
                        btn.click();
                    });
                // }, 500);
        });

        // Fetch comments based on the search term
        fetchComments(searchTerm, sortOptions.value);

    });



function linksAsExternal() {
    document.querySelectorAll('a').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });    
}



function formatNumbers(number) {
    // console.log('Formatting number:', number);  // Add this line

    return number.toLocaleString();
}

