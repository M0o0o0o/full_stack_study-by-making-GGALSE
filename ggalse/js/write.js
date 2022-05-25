(() => {
  const h_id = document.getElementById('h_id');
  const h_title = document.getElementById('h_title');
  const h_content = document.getElementById('h_content');

  CKEDITOR.replace('p_content', { filebrowserImageUploadUrl: '/write/imageupload', editorplaceholder: 'Start typing here...' });
  if (h_title) {
    document.getElementById('title').value = h_title.value;
  }
  if (h_content) {
    CKEDITOR.instances.p_content.setData(h_content.value);
  }

  document.getElementById('b_submit').onclick = async () => {
    const board = document.getElementById('board');
    const title = document.getElementById('title');
    const content = CKEDITOR.instances.p_content.getData();
    let h_id_value = '';
    if (h_id) {
      h_id_value = h_id.value;
    } else {
      h_id_value = '';
    }

    if (isEmpty(board)) {
      alert('게시판을 선택하세요.');
      return;
    }

    if (isEmpty(title)) {
      alert('제목을 입력하세요.');
      return;
    }

    if (title.value.length >= 255) {
      alert('제목이 너무 깁니다.');
      return;
    }

    if (content.length <= 0) {
      alert('내용을 입력하세요');
      return;
    }
    try {
      const res = await axios({
        method: 'post',
        url: '/write',
        data: {
          title: title.value,
          board: board.value,
          p_content: content,
          h_id: h_id_value,
        },
      });
      if (!(res.status === 201 && res.data.status)) {
        alert(res.data.message);
        return;
      }
      window.location.href = res.data.redirect;
    } catch (error) {}
  };
})();
