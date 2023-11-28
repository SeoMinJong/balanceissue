// 버튼에 대한 조작
let select_type = 1; // 선택된 버튼의 정보를 저장할 변수

document.getElementById("friend-btn").addEventListener("click", function() {
    select_type = 1;
    document.getElementById("friend-btn").style.backgroundColor = "green";
    document.getElementById("friend-btn").style.color = "black";
    document.getElementById("family-btn").style.backgroundColor = "";
    document.getElementById("family-btn").style.color = "yellow";
    document.getElementById("lover-btn").style.backgroundColor = "";
    document.getElementById("lover-btn").style.color = "Aqua";
    console.log("select_type, select_19 :",select_type,select_19)
});

document.getElementById("family-btn").addEventListener("click", function() {
    select_type = 2;
    document.getElementById("friend-btn").style.backgroundColor = "";
    document.getElementById("friend-btn").style.color = "green";
    document.getElementById("family-btn").style.backgroundColor = "yellow";
    document.getElementById("family-btn").style.color = "black";
    document.getElementById("lover-btn").style.backgroundColor = "";
    document.getElementById("lover-btn").style.color = "Aqua";
    console.log("select_type, select_19 :",select_type,select_19)
});

document.getElementById("lover-btn").addEventListener("click", function() {
    select_type = 3;
    document.getElementById("friend-btn").style.backgroundColor = "";
    document.getElementById("friend-btn").style.color = "green";
    document.getElementById("family-btn").style.backgroundColor = "";
    document.getElementById("family-btn").style.color = "yellow";
    document.getElementById("lover-btn").style.backgroundColor = "Aqua";
    document.getElementById("lover-btn").style.color = "black";
    console.log("select_type, select_19 :",select_type,select_19)
});


let select_19 = 0

document.getElementById("19-btn").addEventListener("click", function() {
    if (document.getElementById("19-btn").innerText == "19 OFF"){
        select_19 = 1
        document.getElementById("19-btn").innerText = "19 ON"
        document.getElementById("19-btn").style.backgroundColor = "red";
        console.log("select_type, select_19 :",select_type,select_19)
    }
    else{
        select_19 = 0
        document.getElementById("19-btn").innerText = "19 OFF"
        document.getElementById("19-btn").style.backgroundColor = "";
        console.log("select_type, select_19 :",select_type,select_19)
    }
});

document.getElementById("play-btn").addEventListener("click", function() {
    fetch('/game/api/next_play/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            select_type: select_type,
            select_19: select_19
        })
    }).then(res => res.json())
    .then((post) => {
        console.log('routing url :',`/game/play/${post.gm_index}`)
        window.location.href = `/game/play/${post.gm_index}`;
    });
});

window.onload=function(){
    if(select_type==1){
        document.getElementById("friend-btn").style.backgroundColor = "green";
        document.getElementById("friend-btn").style.color = "black";
    }
    else if(select_type==2){
        document.getElementById("family-btn").style.backgroundColor = "yellow";
        document.getElementById("family-btn").style.color = "black";
    }
    else{
        document.getElementById("lover-btn").style.backgroundColor = "Aqua";
        document.getElementById("lover-btn").style.color = "black";
    }
    if(select_19){
        document.getElementById("19-btn").innerText = "19 ON"
        document.getElementById("19-btn").style.backgroundColor = "red";
    }
}