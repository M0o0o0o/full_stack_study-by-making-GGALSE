(() => {
  document.getElementById('b_search_btn').onclick = (e) => {
    const searchType = document.getElementById('searchtype').value;
    const searchText = document.getElementById('search_board');
    const btype = document.getElementById('boardType').value;
    if (isEmpty(searchText)) {
      alert('검색어를 입력하세요.');
      return;
    }
    window.location.href = `/board?btype=${btype}&curpage=1&pagesize=15&searchtype=${searchType}&searchtext=${searchText.value}`;
  };
})();
