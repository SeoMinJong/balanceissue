let select_friend_type = 1

document.getElementById("friend-btn").addEventListener("click", function() {
    if (select_friend_type==0){
        select_friend_type = 1
        document.getElementById("friend-btn").style.backgroundColor = "green";
        document.getElementById("friend-btn").style.color = "black";
        document.getElementById('friend_input').value = select_friend_type;
    }
    else{
        select_friend_type = 0
        document.getElementById("friend-btn").style.backgroundColor = "";
        document.getElementById("friend-btn").style.color = "green";
        document.getElementById('friend_input').value = select_friend_type;
    }
});

let select_family_type = 0

document.getElementById("family-btn").addEventListener("click", function() {
    if (select_family_type == 0){
        select_family_type = 1
        document.getElementById("family-btn").style.backgroundColor = "yellow";
        document.getElementById("family-btn").style.color = "black";
        document.getElementById('family_input').value = select_family_type;
    }
    else{
        select_family_type = 0
        document.getElementById("family-btn").style.backgroundColor = "";
        document.getElementById("family-btn").style.color = "yellow";
        document.getElementById('family_input').value = select_family_type;
    }
});

let select_lover_type = 0

document.getElementById("lover-btn").addEventListener("click", function() {
    if (select_lover_type == 0){
        select_lover_type = 1
        document.getElementById("lover-btn").style.backgroundColor = "Aqua";
        document.getElementById("lover-btn").style.color = "black";
        document.getElementById('lover_input').value = select_lover_type;
    }
    else{
        select_lover_type = 0
        document.getElementById("lover-btn").style.backgroundColor = "";
        document.getElementById("lover-btn").style.color = "Aqua";
        document.getElementById('lover_input').value = select_lover_type;
    }
});
let select_19 = 0

document.getElementById("19-btn").addEventListener("click", function() {
    if (document.getElementById("19-btn").innerText == "19 OFF"){
        select_19 = 1
        document.getElementById("19-btn").innerText = "19 ON"
        document.getElementById("19-btn").style.backgroundColor = "red";
        document.getElementById('19_input').value = select_19;
    }
    else{
        select_19 = 0
        document.getElementById("19-btn").innerText = "19 OFF"
        document.getElementById("19-btn").style.backgroundColor = "";
        document.getElementById('19_input').value = select_19;
    }
});

document.querySelector('form').addEventListener('submit', function(e) {
    document.getElementById('friend_input').value = select_friend_type;
    document.getElementById('family_input').value = select_family_type;
    document.getElementById('lover_input').value = select_lover_type;
    document.getElementById('19_input').value = select_19;
});

window.onload=function(){
    document.getElementById("friend-btn").style.backgroundColor = "green";
    document.getElementById("friend-btn").style.color = "black";
    document.getElementById('friend_input').value = select_friend_type;
}