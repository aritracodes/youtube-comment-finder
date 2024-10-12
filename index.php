<?php include_once 'config.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
    <link rel="stylesheet" href="./style.css">
    <!-- Primary Meta Tags -->
    <title>YouTube Comment Viewer</title>
    <meta name="title" content="YouTube Comment Viewer">
    <meta name="description" content="Easily view and search through comments on YouTube videos. Sort by likes, date, and more.">

    <!-- Favicon -->
    <link rel="icon" href="<?=$favicon?>" type="image/x-icon">
    <link rel="shortcut icon" href="<?=$favicon?>" type="image/x-icon">

    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" sizes="180x180" href="<?= $appleTouchIcon ?>">


    <!-- Meta for Character Encoding, Viewport, and Robots -->
    <meta name="robots" content="index, follow">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?= $websiteUrl ?>">
    <meta property="og:title" content="YouTube Comment Viewer">
    <meta property="og:description" content="Easily view and search through comments on YouTube videos. Sort by likes, date, and more.">
    <meta property="og:image" content="<?=$ogImageUrl?>">
    <meta property="og:site_name" content="YouTube Comment Viewer">

    <!-- For improved engagement on Facebook -->
    <!-- <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID"> -->

    <!-- Twitter Card Meta Tags -->
    <!-- <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://yourdomain.com/youtube-comment-viewer">
    <meta name="twitter:title" content="YouTube Comment Viewer">
    <meta name="twitter:description" content="Easily view and search through comments on YouTube videos. Sort by likes, date, and more.">
    <meta name="twitter:image" content="https://yourdomain.com/images/youtube-comment-viewer-thumbnail.png">
    <meta name="twitter:site" content="@yourtwitterhandle">
    <meta name="twitter:creator" content="@yourtwitterhandle"> -->
    <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "ohcgbzbxuh");
    </script>
    
</head>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "YouTube Comment Viewer",
  "url": "<?= $websiteUrl ?>",
  "description": "Easily view and search through comments on YouTube videos. Sort by likes, date, and more.",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "category": "Free"
  },
  "image": "<?= $ogImageUrl ?>",
  "author": {
    "@type": "Person",
    "name": "Aritra"
  },
  "datePublished": "2024-09-07",
  "softwareVersion": "1.0.0",
  "interactionCount": "UserComments:1200",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "95"
  }
}
</script>


<body>




    <main class="container">
    <nav style="margin-bottom:2rem">
  <ul>
    <li style="font-size:1.5rem"><strong><?= $websiteName ?></strong></li>
  </ul>
  <ul>
    <li>
      <a target="_blank" href="https://www.buymeacoffee.com/letmecode"><img style="height:2rem; width:auto;" src="https://img.buymeacoffee.com/button-api/?text=Buy me a Coffee&emoji=🍵&slug=letmecode&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>
    </li>
  </ul>
</nav>



        <h1 class="text-center">YouTube Comment Viewer</h1>

        <form id="youtubeForm">
            <label for="youtubeUrl">Enter YouTube URL:</label>
            <input type="url" id="youtubeUrl"  required>
            <button type="submit">Search</button>

             <!-- Sort By Container -->
            <div class="sort-by-container">
                <label for="sortOptions">Sort By:</label>
                <select id="sortOptions">
                    <option value="relevance">Relevance</option>
                    <option value="time">Time</option>
                </select>
            </div>
        </form>

        <div id="videoDetails">

        </div>
        
          

        <div>
        <!-- <input type="text" id="searchInput" placeholder="Search comments">
        <button id="searchCommentBtn">Search</button> -->
          <div id="searchCommentContainer">
            <div role="search" id="searchGroup">
                <input name="search" id="searchInput" type="search" placeholder="Search any replies or comment" />
                <input type="submit" id="searchCommentBtn" value="Search" />
            </div>
          </div>


          <div id="commentsSection" style="position:" class="scrollable">
          <!-- <img src="./assets/icons/fullscreen.svg" id="fullscreenIcon" style="height:2rem;width:2rem;position:absolute;top:10px;right:10px;cursor:pointer;" alt="Fullscreen Icon"> -->
          </div>
        </div>
    </main>

    <!-- Loading spinner -->
    <div class="loading-spinner" id="loadingSpinner"></div>

    <script src="./script.js"></script>
</body>
</html>