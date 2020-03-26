$(function(){ 
  function buildHTML(message){
   if ( message.content && message.image ) {
     var html =
      `<div class="chat-bar__header__contents__data" data-message-id= "${message.id}">
        <div class="chat-bar__header__contents__data__info">
          <p class="chat-bar__header__contents__data__info__talker">
            ${message.user_name}
          </p>
          <p class="chat-bar__header__contents__data__info__date">
            ${message.created_at}
          </p>
        </div>
        <p class="chat-bar__header__contents__data__text">
          ${message.content}
        </p>
        <img src=${message.image} class="lower-message__image">
       </div>`
     return html;
   } else if (message.content) {
     var html =
      `<div class="chat-bar__header__contents__data" data-message-id= "${message.id}">
        <div class="chat-bar__header__contents__data__info">
          <p class="chat-bar__header__contents__data__info__talker">
            ${message.user_name}
          </p>
          <p class="chat-bar__header__contents__data__info__date">
            ${message.created_at}
          </p>
        </div>
        <p class="chat-bar__header__contents__data__text">
          ${message.content}
        </p>
       </div>`
     return html;
   } else if (message.image) {
    var html =
    `<div class="chat-bar__header__contents__data" data-message-id= "${message.id}">
      <div class="chat-bar__header__contents__data__info">
        <p class="chat-bar__header__contents__data__info__talker">
          ${message.user_name}
        </p>
        <p class="chat-bar__header__contents__data__info__date">
          ${message.created_at}
        </p>
      </div>
      <img src=${message.image} class="lower-message__image">
    </div>`
    return html;
   };
 }
 
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-bar__header__contents').append(html);      
      $('form')[0].reset();
      $('.chat-bar__header__contents').animate({ scrollTop: $('.chat-bar__header__contents')[0].scrollHeight});
      $('.submit-btn').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
  })

  var reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    var last_message_id = $('.chat-bar__header__contents__data:last').data("message-id");
    console.log(last_message_id)
    $.ajax({
      //ルーティングで設定した通りのURLを指定
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      console.log(messages)
      if (messages.length !== 0) {
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加
        $('.chat-bar__header__contents').append(insertHTML);
        $('.chat-bar__header__contents').animate({ scrollTop: $('.chat-bar__header__contents')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  //$(function(){});の閉じタグの直上(処理の最後)に以下のように追記
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});