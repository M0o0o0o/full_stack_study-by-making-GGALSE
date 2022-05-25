function enterkey(id) {
  if (window.event.keyCode == 13) {
    document.getElementById(id).click();
  }
  return;
}

function preventEnter(element) {
  if (window.event.keyCode == 13) {
    return false;
  }
}

function toggleClass(id, addClass, removeClass) {
  if (addClass) {
    id.classList.add(addClass);
  }

  if (removeClass) {
    id.classList.remove(removeClass);
  }
}

function toggleArray(element, addClass, removeClass) {
  if (addClass) {
    for (c of addClass) {
      element.classList.add(c);
    }
  }

  if (removeClass) {
    for (c of removeClass) {
      element.classList.remove(c);
    }
  }
}

async function exist_userID(user_id) {
  try {
    if (user_id.value.length > 0) {
      const response = await axios({
        method: 'post',
        url: '/sign/form/check/name',
        data: {
          user_id: user_id.value,
        },
      });

      if (response.status === 200 && response.data.sign) {
        return true;
      }
    }
  } catch (error) {
    return false;
  }
}

async function issuedCertiNum(email) {
  // 21-07-23 예외 처리 수정 필요
  try {
    const response = await axios({
      method: 'get',
      url: `/issue/code/?email=${email.value}`,
    });

    if (response.status === 200) {
      if (response.data.issued) {
        return true;
      }
    }
  } catch (error) {
    return false;
  }

  return false;
}

async function chk_certi(element) {
  try {
    element = element || null;

    if (!element) {
      alert('인증번호를 입력하세요.');
      return false;
    }

    const response = await axios({
      method: 'post',
      url: '/issue/code',
      data: {
        certi_num: element,
      },
    });

    if (response.status === 200 && response.data.status) {
      return true;
    }

    return false;
  } catch (error) {
    alert(error.response.data.message);
    return false;
  }
}

async function chk_email(element) {
  try {
    const response = await axios({
      method: 'post',
      url: '/sign/form/check/email',
      data: {
        email: element.value,
      },
    });

    if (response.status === 200) {
      if (response.data.sign) {
        return true;
      }
      return false;
    }
  } catch (error) {
    console.log('in');
    return false;
  }
}

function idReg(value) {
  const alphaReg = /[A-za-z]/;
  const expReg = /[~!@#$%^&*()_+|<>?:{}]/;
  const korReg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  const spaceReg = /\s/;

  if (value.length < 5 || value.length > 15) {
    return false;
  }

  if (!alphaReg.test(value) || expReg.test(value) || spaceReg.test(value) || korReg.test(value)) {
    return false;
  }
  return true;
}

function pwdReg(value) {
  const alphaReg = /[A-za-z]/;
  const expReg = /[~!@#$%^&*()_+|<>?:{}]/;
  const spaceReg = /\s/;
  const numReg = /[0-9]/;
  if (value.length < 8 || value.length > 16) {
    return false;
  }
  if (!alphaReg.test(value) || !expReg.test(value) || spaceReg.test(value) || !numReg.test(value)) {
    return false;
  }
  return true;
}

const emailReg = (value) => {
  return /^[a-z0-9_+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/.test(value);
};
