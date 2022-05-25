// totalCnt : 총 게시글 수
// buttonSize : 보여줄 페이지 개수
// pageSize : 한 페이지 당 게시글 수
// pageNo : 현재 페이지 번호

function setPaging() {
  const totalCnt = parseInt(document.getElementById('totalCnt').value);
  const pageNo = parseInt(document.getElementById('curPage').value);
  const pageSize = 15;
  const buttonSize = 5;

  let paging = document.getElementById('paging');
  let dataHtml = ``;

  let pageCnt = totalCnt % pageSize;
  if (pageCnt !== 0) {
    pageCnt = parseInt(totalCnt / pageSize) + 1;
  } else {
    pageCnt = parseInt(totalCnt / pageSize);
  }

  let buttonPage = parseInt(pageNo / buttonSize);
  if (pageNo % buttonSize === 0) {
    buttonPage = parseInt(pageNo / buttonSize) - 1;
  }

  if (pageNo > buttonSize) {
    let prev_btn = 0;
    if (pageNo % buttonSize === 0) {
      prev_btn = pageNo - buttonSize;
    } else {
      prev_btn = pageNo - (pageNo % buttonSize);
    }
    dataHtml += `<li class="prev page"><a href="/board?btype=1&curpage=${prev_btn}&pagesize=15" class="hover_line">이전</a></li>`;
  }
  for (let index = buttonPage * buttonSize + 1; index < (buttonPage + 1) * buttonSize + 1; ++index) {
    if (index === pageNo) {
      dataHtml += `<li class="page curpage"><a href="/board?btype=1&curpage=${index}&pagesize=15" class="hover_line">${index}</a></li>`;
    } else {
      dataHtml += `<li class="page"><a href="/board?btype=1&curpage=${index}&pagesize=15" class="hover_line">${index}</a></li>`;
    }

    if (index === pageCnt) {
      break;
    }
  }

  if (pageCnt > (buttonPage + 1) * buttonSize) {
    dataHtml += `<li class="next page"><a href="/board?btype=1&curpage=${(buttonPage + 1) * buttonSize + 1}&pagesize=15" class="hover_line">다음</a></li>`;
  }

  paging.innerHTML = dataHtml;
}

setPaging();
