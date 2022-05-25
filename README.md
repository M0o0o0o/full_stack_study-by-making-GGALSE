<p>
  <img src="https://img.shields.io/badge/version-1.0.0-informational" alt="version">
  <a href="#" target="_blank">
  <img src="https://img.shields.io/badge/License-MIT-blueviolet" alt="License">
  </a>
</p>

<b>❗❗ [깔세일번지](http://ggalse1.com) 바로가기</b>

### 🏃 개요

"깔세"와 관련된 서비스를 제공하는 웹 애플리케이션을 주제로 선정해 진행했습니다. <br />
(깔세란 보증금이나 권리음 없이 1~3개월치의 월세를 한꺼번에 내고 계약을 하는 방식을 뜻하는 용어입니다.)
<br /><br />
첫 프로젝트를 진행하면서 <b>목표</b>로 삼았던 점은 풀스택으로 진행하면서 <ins>웹 애플리케이션의 전체적인 흐름을 이해하고</ins>, 목표로 했던 기능들을 모두 구현하는 것이었습니다.
<br /><br />
프로젝트를 진행하는 과정과 배포하고 난 후에도 가장 어려웠던 점은 지금 하고 있는 기획과 구현에 있어서 옳은 방향으로 진행하고 있는지에 대한 의구심이었습니다.
<br />
이러한 과정이 프로젝트가 끝나고 난 후 돌이켜 생각해보면 스스로 성장할 수 있는 원동력이었다 생각합니다. :muscle:
***

### 느낀점

##### 테스트의 부재
- 구현하면서 간단한 단위 테스트를 진행했지만, Jest 같은 프레임웍을 이용해서 적극적으로  테스트를 하지 않았습니다. 당시에는 기능 구현에만 초점이 맞춰져서 테스트를 간과했습니다. 결국 부채가 쌓여서 나중에 에러 잡는데 2일이나 소모했습니다. 돌이켜 생각해보면 진행 당시에 TDD까지는 아니더라도 적극적인 테스트를 토대로 구현했다면 프로젝트 기간이 단축됐을 거라 생각합니다.

##### 기획과 문서화의 중요성
- 백엔드는 프로젝트 초기에 테이블을 설계하고 추상적으로 API를 설계하고 프론트의 경우 "카카오 오븐"을 이용해 플로우 차트와 와이어프레임을 간단하게 작성 후 바로 구현을 시작했습니다.
- 그런데 이런 추상적인? 기획으로 인해서 여기저기서 문제가 발생했습니다. 프로젝트를 진행하면서 변경없이 초기 기획대로 진행이 되는 경우는 절대 없다 생각하지만, 그렇다고 구체적인 구현이 가져다주는 장점에 대해서는 간과하고 있었습니다.
- 구체적이지 못한 기획으로 인해서 구현하면서 여러 곳에서 변경이 잦아, 프로젝트 기간만 더욱 늘어갔습니다. 
- 프로젝트를 진행할 때는 도출한 요구사항을 토대로 테이블 설계와 API 설계를 구체적으로 기획하고 구현에 들어가야 한다는 필요성을 느꼈습니다.

```
아래에서는 크게 회원 관리, 게시판 관리를 하면서 발생했던 구체적인 문제와 해결했던 과정을 회고하려고 합니다.
```
***

<h3> 🔨 개발 환경 </h3>
<p></p>

***

<h3>🔧 디렉토리 구조 </h3>

```shell

📦ggalse
 ┣ 📂config
 ┣ 📂css
 ┣ 📂images
 ┣ 📂js
 ┣ 📂logs
 ┣ 📂passport
 ┣ 📂public
 ┃ ┣ 📂ckeditor
 ┣ 📂query
 ┣ 📂routes
 ┣ 📂views
 ┣ 📦models
 ┣ 📜.env
 ┣ 📜.gitignore
 ┣ 📜.prettierrc
 ┣ 📜README.md
 ┣ 📜logger.js
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜web.js

```
***





### :information_desk_person: 회원 관리

##### 회원가입

### 게시판 관리




#### 🏁 회원가입
<p>
    회원가입은 자체 서비스 가입과 네이버, 카카오로 회원가입이 가능하게 구현했습니다. 
    또한 사이트 내에서 회원가입을 할 때는 이메일 인증을 거치도록 구현하였습니다. 이메일 인증은 <b>nodemailer</b>를 이용해 구현하였습니다.
    자체 서비스 회원가입 중 유효성 검사를 초기 구현에서는 프론트 단에서 집중적으로 처리하던 것을 백단에서도 동일하게 처리하도록 구현했습니다.
</p>
<img src="https://github.com/Lee-moo/full_stack_study-by-making-GGALSE/blob/main/readme_images/join.gif">

#### 🏁 로그인
<p>
    로그인은 passport-local passport-naver, passport-kakao를 이용하여 구현했습니다.
</p>

<img src="https://github.com/Lee-moo/full_stack_study-by-making-GGALSE/blob/main/readme_images/login.gif">

#### 🏁 게시판
<p>
    게시판의 글쓰기 기능을 위한 text editor 중 CKEditor를 이용했습니다.
</p>
<img src="https://github.com/Lee-moo/full_stack_study-by-making-GGALSE/blob/main/readme_images/post.gif">

#### 🏁 반응형 
<p>
   프론트와 관련해서 부족함이 많지만, 반응형으로 동작하도록 제작하고 싶어서 시도해봤습니다.  
</p>

<img src="https://github.com/Lee-moo/full_stack_study-by-making-GGALSE/blob/main/readme_images/responsive.gif">
