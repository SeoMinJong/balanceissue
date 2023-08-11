// 버튼에 대한 조작
let select_type = ""; // 선택된 버튼의 정보를 저장할 변수

document.getElementById("friend-btn").addEventListener("click", function() {
    select_type = "friend";
    document.getElementById("friend-btn").style.backgroundColor = "green";
    document.getElementById("friend-btn").style.color = "black";
    document.getElementById("family-btn").style.backgroundColor = "";
    document.getElementById("family-btn").style.color = "yellow";
    document.getElementById("lover-btn").style.backgroundColor = "";
    document.getElementById("lover-btn").style.color = "Aqua";
    console.log("select friend! change green!")
});

document.getElementById("family-btn").addEventListener("click", function() {
    select_type = "family";
    document.getElementById("friend-btn").style.backgroundColor = "";
    document.getElementById("friend-btn").style.color = "green";
    document.getElementById("family-btn").style.backgroundColor = "yellow";
    document.getElementById("family-btn").style.color = "black";
    document.getElementById("lover-btn").style.backgroundColor = "";
    document.getElementById("lover-btn").style.color = "Aqua";
    console.log("select family! change yellow!")
});

document.getElementById("lover-btn").addEventListener("click", function() {
    select_type = "lover";
    document.getElementById("friend-btn").style.backgroundColor = "";
    document.getElementById("friend-btn").style.color = "green";
    document.getElementById("family-btn").style.backgroundColor = "";
    document.getElementById("family-btn").style.color = "yellow";
    document.getElementById("lover-btn").style.backgroundColor = "Aqua";
    document.getElementById("lover-btn").style.color = "black";
    console.log("select lover! change blue!")
});


let select_19 = 0

document.getElementById("19-btn").addEventListener("click", function() {
    if (document.getElementById("19-btn").innerText == "19 OFF"){
        select_19 = 1
        document.getElementById("19-btn").innerText = "19 ON"
        document.getElementById("19-btn").style.backgroundColor = "red";
        console.log("19금 태그가 선택되었습니다. 현재 상태 :",select_19)
    }
    else{
        select_19 = 0
        document.getElementById("19-btn").innerText = "19 OFF"
        document.getElementById("19-btn").style.backgroundColor = "";
        console.log("19금 태그가 미선택되었습니다. 현재 상태 :",select_19)
    }
});


// play-btn에 대한 tag 조건에 따른 난수 추출 및 난수에 해당하는 play 페이지