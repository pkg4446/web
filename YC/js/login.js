localStorage.removeItem('user');
localStorage.removeItem('token');
localStorage.removeItem('device');
document.getElementById('login').textContent = "로그인";
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const userid   = document.getElementById('userid').value;
    const password = document.getElementById('password').value;

    // fetch(window.location.protocol+"//"+"yc.beetopia.kro.kr"+"/user/login", {
    fetch("//yc.beetopia.kro.kr"+"/user/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id:     userid,
            pass:   password
        })
    })
    .then(response => {
        response.status
        if (response.status==400) {
            alert('아이디 또는 비밀번호가 누락됐습니다.');
        }else if (response.status==403) {
            alert('비밀번호가 다릅니다.');
        }else if (response.status==406) {
            alert('아이디가 없습니다.');
        }
        return response.text(); // JSON 대신 텍스트로 응답을 읽습니다.
    })
    .then(data => {
        if (data != "nodata" && data != "password" && data != "userid") {
            alert('로그인 성공!');
            localStorage.setItem('user', userid);
            localStorage.setItem('token', data);
            window.location.href = '/web';
        } else {
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});