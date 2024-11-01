if(localStorage.getItem('user')==null || localStorage.getItem('token')==null){
    document.getElementById('login').textContent = "로그인";
}
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    fetch("http://yc.beetopia.kro.kr"+"/user/join", {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id:     document.getElementById('userid').value,
            pass:   document.getElementById('password').value,
            check:  document.getElementById('passcheck').value,
            name:   document.getElementById('username').value,
            tel:    document.getElementById('userphone').value,
            farm:   document.getElementById('farmname').value,
            addr:   document.getElementById('farmaddr').value
        })
    })
    .then(response => {
        response.status
        if (response.status==400) {
            throw new Error('아이디 또는 비밀번호가 누락됐습니다.');
        }else if (response.status==403) {
            throw new Error('비밀번호가 다릅니다.');
        }else if (response.status==406) {
            throw new Error('이미 가입된 아이디 입니다.');
        }else{
            alert('가입 성공!');
            window.location.href = '/web/login';
        }
        return response.text(); // JSON 대신 텍스트로 응답을 읽습니다.
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
    });
});