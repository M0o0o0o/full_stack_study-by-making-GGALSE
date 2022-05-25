function chk_login() {
  if (!chk_name(document.getElementById('login_id')) || !chk_pwd(document.getElementById('login_pwd'))) {
    alrt('아이디 또는 비밀번호를 입력해주세요.');
    return false;
  }
  return true;
}
