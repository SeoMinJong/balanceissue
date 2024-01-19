function report_send(){
    const gmId = document.getElementById('gmId').textContent;
    const nickname = document.getElementById('nickname').value;
    const tag = document.getElementById('tag').value;
    const message = document.getElementById('message').value;

    fetch('/game/api/report/',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        redirect: 'follow',
        body:JSON.stringify({
            GM_IDX:gmId,
            NICKNAME:nickname,
            TYPE:tag,
            REPORT:message
        })
    }).then(response => {
            if (response.status === 200) {
                console.log('status 200 clear')
                location.href = 'http://localhost:3000/game/reportSuccess/'
            } else {
                alert('신고에 실패했습니다. 다시 시도해주세요.');
            }
        })
}