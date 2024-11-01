if(localStorage.getItem('user')==null || localStorage.getItem('token')==null){
    window.location.href = '/web/login';
}else{
    fetch_same_ip();
}
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const device_type = document.querySelector('input[name="device_type"]:checked').value;
    const device_id   = document.getElementById('device').value;
    const device_name = document.getElementById('device_name').value;

    device_regist(device_type,device_id,device_name);
});
////--------------------------------------------------------------------////
function alert_swal(icon,title) {
    Swal.fire({
        position: "top",
        icon:   icon,
        title:  title,
        showConfirmButton: false,
        timer:  1500
    });
}
////-------------------////
function list_regist(device_id) {
    console.log(device_id);
    Swal.fire({
        title: "장비 이름",
        input: "text",
        showCancelButton: true,
        inputPlaceholder: "등록할 장비 이름을 입력하세요.",
        confirmButtonText: "등록",
        cancelButtonText:  "취소"
    }).then((result) => {
        if (result.isConfirmed){
            const device_name = result.value.replaceAll(" ","");
            if(device_name === ""){
                Swal.fire({
                    title: "이름이 없습니다.",
                    text: "이름을 입력하세요.",
                    icon: "error"
                });
            }else{
                device_regist("hive",device_id,device_name);
            }
        }
    });
}
////-------------------////
function device_regist(device_type,device_id,device_name) {
    const post_data = {
        id:     localStorage.getItem('user'),
        token:  localStorage.getItem('token'),
        dvid:   device_id,
        name:   device_name
    }
    fetch("//yc.beetopia.kro.kr"+"/"+device_type+"/connect", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post_data)
    })
    .then(response => {
        response.status
        if (response.status==400 || response.status==401) {
            alert_swal("error",'로그인 정보가 없습니다.');
            window.location.href = '/web/login';
        }else if (response.status==403) {
            alert_swal("warning",'장비가 인터넷에 연결되지 않았습니다.');
        }else if (response.status==409) {
            alert_swal("error",'이미 누군가 등록한 장비입니다.');
        }else{
            if(device_type&&document.getElementById(`list_${device_id}`)) document.getElementById(`list_${device_id}`).innerText="";
            alert_swal("success",'장비가 등록되었습니다.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
////-------------------////
function fetch_same_ip() {
    // 여기에 실제 서버 URL을 입력하세요
    const post_data = {
        id:     localStorage.getItem('user'),
        token:  localStorage.getItem('token'),
    }
    fetch("//yc.beetopia.kro.kr"+"/hive/list_able", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post_data)
    })
    .then(response => {
        if (response.status==400 || response.status==401) {
            alert_swal("error",'로그인 정보가 없습니다.');
            window.location.href = '/web/login';
        }
        return response.text(); // JSON 대신 텍스트로 응답을 읽습니다.
    })
    .then(data => {
        const device_list = data.split(",");
        let device_list_innerhtml = "";
        if(device_list.length-1>0){
            device_list_innerhtml = '<div class="divider">연결 가능한 벌통</div><div class="form-section">';
            for (let index = 0; index < device_list.length-1; index++) {
                device_list_innerhtml += `<p class="user-link" id="list_${device_list[index]}" onclick=list_regist("${device_list[index]}")>${device_list[index]}</p>`
            }
            device_list_innerhtml += "</div>";
        }
        document.getElementById("same_ip").innerHTML = device_list_innerhtml;
    })
    .catch(error => {
        console.log(error);
    });
}