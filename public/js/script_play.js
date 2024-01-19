async function gm_score(){
    var questionBoxes = document.querySelectorAll('.question-box');
    questionBoxes.forEach(function(questionBoxe){
        questionBoxe.style.pointerEvents = 'none';
    });
    var scoreBoxes = document.querySelectorAll('.score-box');
    scoreBoxes.forEach(function(scoreBox) {
        scoreBox.style.display = 'flex';
    });
    rolling_num();
    var nextbox = document.getElementById('next-box');
    nextbox.style.display = 'flex';
}


function next_gm(){
    fetch('/game/api/next-play/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow'
    }).then(response => {
        if (response.redirected) {
          window.location.href = response.url;
        }
      });
}

document.getElementById('gm_answer1').addEventListener('click', function() {
    var index = document.getElementById('index').innerHTML;
    send_gm_log(0, index);
});
document.getElementById('gm_answer2').addEventListener('click', function() {
    var index = document.getElementById('index').innerHTML;
    send_gm_log(1, index);
});

function send_gm_log(result_type, index){
    fetch('/game/api/gm-log/', {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },        
        body:JSON.stringify({
            result_type: result_type,
            index: index
        }),
    })
}


function rolling_num(){
    var elements = document.querySelectorAll(".score-box .num");
    elements.forEach(function($selector, index){
        var getDataName = $selector.getAttribute("data-level");
        // 인터벌 텍스트
        var intervalId = randomNumberInterval($selector, 60);
        // 클리어 인터벌
        randomNumberClearInterval($selector, intervalId, getDataName, 1000);
    });

    // 랜덤 숫자 생성
    function randomNumber(max, min){
        // 10에서 99사이의 숫자 반환을 위해 최대값과 최소값을 지정
        var randomNumber = Math.floor(Math.random() * (max-min) + min);
        return randomNumber;
    }

    // 랜덤 숫자 인터벌
    function randomNumberInterval(selector, speed){
        var intervalId = setInterval(function(){
            var _randomNumber = randomNumber(99, 10);
            selector.textContent = _randomNumber;
        }, speed);
        return intervalId;
    }

    // 인터벌 중지 및 해당 텍스트 고정
    function randomNumberClearInterval(selector, clearObject, dataName, clearTime){
        setTimeout(function(){
            clearInterval(clearObject);
            selector.textContent = dataName;
        }, clearTime);
    }
}

function delete_comment(element) {
    var password = prompt("비밀번호를 입력해주세요.");
    var commentId = element.getAttribute('comment_id');
    fetch('/game/api/comment/' + commentId, { 
        method: 'DELETE',
        body:JSON.stringify({
            commentId: commentId,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
    }}).then(response => {
        if (response.status === 200) {
            window.location.reload();
        } else {
            alert('댓글 삭제에 실패했습니다.');
        }
    });
}