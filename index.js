import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    /* hjärta ikon */
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    /* retweet ikonen */
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
          
    }
    /* tryck på bubblaknappen */
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
       
    }
    /* svara på en tweet */
    else if(e.target.dataset.tweetreply){
        handleReplyTweetClick(e.target.dataset.tweetreply)
       
      
       
    }/* STORA TWITTER KNAPPEN  */
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()

    }
    
    /* Papperskorgen */
    
    else if(e.target.dataset.remove){
        deleteTweet(e.target.dataset.remove)
        console.log(e.target.dataset.remove)
    }
    
    
})
 /* ------------------------------------------------------------------------------------------- */
 

let storeTweets = JSON.parse(localStorage.getItem("tweets"))
console.log("storeTweets",storeTweets)
 
let tweetsToRender = storeTweets ? storeTweets : tweetsData;

function addToLocalstorage(storeTweets){
    localStorage.setItem("tweets",JSON.stringify(storeTweets))
}


function handleLikeClick(tweetId){     
    const targetTweetObj = tweetsToRender.filter(function(tweet){
        return tweet.uuid === tweetId
        console.log("targetTweetObj",targetTweetObj)
    })[0]
    
    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked        
    addToLocalstorage(tweetsToRender) 
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsToRender.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    addToLocalstorage(tweetsToRender) 
     console.log("addToLocalstorage retweets", tweetsToRender) 
    
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    document.getElementById(`${replyId}`).classList.toggle('hidden')
     
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
   
    if(tweetInput.value){
        tweetsToRender.unshift({
            handle: `@Scrimba`,
            profilePic: `images/me-avatar.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        
     tweetInput.value = ''
      addToLocalstorage(tweetsToRender)
             render()
    
    }

}


function handleReplyTweetClick(tweetId){    
const replyToTweet = document.getElementById(`tweet-reply-${tweetId}`)

  let tweetObj = tweetsToRender.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]    
  
    if(replyToTweet.value){
       tweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/me-avatar.png`,
            tweetText: replyToTweet.value        
        })  
        
       
            
    replyToTweet.value= ''
    addToLocalstorage(tweetsToRender) 
    render() 
   handleReplyClick(tweetId)     
     
    }  
}

function deleteTweet(tweetId){
    tweetsToRender=JSON.parse(localStorage.getItem("tweets"))
    let index = tweetsToRender.findIndex(tweet=>tweet.uuid === tweetId)
    tweetsToRender.splice(index, 1)
    addToLocalstorage(tweetsToRender)
    render()

    console.log(tweetsToRender);
}


 
function getFeedHtml(){
    let feedHtml = ``
      let localStorageTweets = ""
      
            if(JSON.parse(localStorage.getItem("tweets"))){
            localStorageTweets = JSON.parse(localStorage.getItem("tweets"))
            }else{
            localStorage.setItem("tweets", JSON.stringify(tweetsData))
            localStorageTweets = JSON.parse(localStorage.getItem("tweets"))
            }
            
    localStorageTweets.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        
        let deleteTweetIconClass = ''
        if(tweet.handle===`@Scrimba`){
            console.log("tweet.handle",tweet.handle)
            deleteTweetIconClass = ''
        }else{
            deleteTweetIconClass = 'delete-hidden'
        }
        
        
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                 <span class="tweet-detail">
                    <i class="fa-solid fa-trash ${deleteTweetIconClass}" 
                    data-remove="${tweet.uuid}"
                    ></i>
                  </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>       
   
        <div class='tweet-replytotweet hidden' id='${tweet.uuid}'>          
          <img src="images/me-avatar.png" class="profile-pic-replytotweet">
          <input type='text' placeholder="Reply to tweet" id='tweet-reply-${tweet.uuid}'>
          <button class='replytotweet-btn' id='replytotweetBtn' data-tweetreply='${tweet.uuid}'}'>Tweet</button>
        </div> 

</div>
`
   })
   return feedHtml 
}


function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    
}


render()

