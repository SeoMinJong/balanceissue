function gm_score(element){
    var scoreBoxes = document.querySelectorAll('.score-box');
    scoreBoxes.forEach(function(scoreBox) {
        scoreBox.style.display = 'flex';
    });
    rolling_num();
}

function next_gm(){
    
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