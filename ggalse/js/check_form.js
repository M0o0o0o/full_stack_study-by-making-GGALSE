function chk_name(name) {
  if (name.value.length > 0) {
    return true;
  }
  return false;
}

function chk_pwd(pwd) {
  if (pwd.value.length > 0) {
    return true;
  }
  return false;
}

function chk_password(password, chk_password) {
  if (password.value.length > 0 && chk_password.value.length > 0 && password.value === chk_password.value) {
    return true;
  }
  return false;
}

function isEmpty(element) {
  if (element.value.length > 0) {
    return false;
  }
  return true;
}
