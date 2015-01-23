var authToken = $('.authenticity_token').val();

var imgURL = chrome.extension.getURL("quickblocker.png");

$(document).ready(function(){
  $('.ProfileTweet-action--favorite').not('.u-hiddenVisually').addClass('quickblockered').after('<a class="blocky" style="background-image: url('+imgURL+')" title="Block this user">&nbsp;</div>');
});

$(document).bind('DOMNodeInserted', function(e) {
  if ($(e.target).find('.ProfileTweet-action--favorite')) {
    $(e.target).find('.ProfileTweet-action--favorite').not('.u-hiddenVisually').not('.quickblockered').addClass('quickblockered').after('<a class="blocky" style="background-image: url('+imgURL+')" title="Block this user">&nbsp;</div>');
  }
}); //bind

$(document).on('click', '.blocky', function(){
  var self = this;
if ($(self).parents('.Grid[data-component-term="tweet"]').length) {
  console.log('one');
  bigthing = self;
  var submissionObject = {
    'authenticity_token':authToken,
    'block_user':true,
    'report_type':null,
    'screen_name':$(self).parents('.Grid[data-component-term="tweet"]').find('.ProfileTweet-screenname').text().trim().slice(1),
    'tweet_id':$(self).parents('.Grid[data-component-term="tweet"]').find('.js-stream-item').attr('data-item-id'),
    'user_id':$(self).parents('.Grid[data-component-term="tweet"]').find('.js-tweet.js-stream-tweet').attr('data-user-id'),
  }
} else {
  console.log('two');
  var submissionObject = {
    'authenticity_token':authToken,
    'block_user':true,
    'report_type':null,
    'screen_name':$(self).parents('.tweet').find('.username.js-action-profile-name').text().trim().slice(1),
    'tweet_id':$(self).parents('.tweet').attr('data-tweet-id'),
    'user_id':$(self).parents('.tweet').attr('data-user-id'),
  }
}
console.log(submissionObject);
  $.ajax({
    type: "POST",
    data: submissionObject,
    url: "/i/tweet/report",
    headers: {          
      Accept : "application/json, text/javascript, */*; q=0.01",
    },
    success: function(m1, m2, m3) {
      // console.log('Ok!', m1, m2, m3);
    }, //success
    error: function (m1, err2, err3){
      if (JSON.parse(m1.responseText).message.indexOf('has been blocked')) {
        $('.tweet').find('.js-action-profile-name.username:contains('+submissionObject.screen_name+')').parents('.stream-item').slideUp(200)
        $('.tweet').find('.js-action-profile-name.username:contains('+submissionObject.screen_name+')').parents('.Grid[data-component-term="tweet"]').slideUp(200)
        setTimeout(function(){
          alert('User '+submissionObject.screen_name+' has been blocked.');
        }, 300)
      }
    } //error
  }); //ajax
}) //on click