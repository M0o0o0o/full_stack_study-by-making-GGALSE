
<b>❗❗ [깔세일번지](http://ggalse1.com) 바로가기</b>
<h2>🏃  프로젝트 개요 </h2>

<p>
    풀스택을 경험해보기 위해서 프로젝트를 진행하게 되었습니다. <br>
    주제 선정을 위해서 알아보다 "깔세"라는 용어를 접하게 되어서, 깔세 사이트를 만들어 봤습니다.
</p>
<h3>깔세란❓</h3>
<p>깔세란 보증금이나 권리음 없이 1~3개월치의 월세를 한꺼번에 내고 계약을 하는 방식을 뜻하는 용어입니다. </p>
<h3>🔨 개발 환경</h3>
<p></p>
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

#### 🏁 회원가입
<p>
    회원가입은 자체 서비스 가입과 네이버, 카카오로 회원가입이 가능하게 구현했습니다. 
    또한 사이트 내에서 회원가입을 할 때는 이메일 인증을 거치도록 구현하였습니다. 이메일 인증은 <b>nodemailer</b>를 이용해 구현하였습니다.
    자체 서비스 회원가입 중 유효성 검사를 초기 구현에서는 프론트 단에서 집중적으로 처리하던 것을 백단에서도 동일하게 처리하도록 구현했습니다.
</p>
<img src="https://github.com/Lee-moo/full_stack_study-by-making-GGALSE/blob/main/join.gif">

#### 🏁 로그인
<p>
    로그인은 passport-local passport-naver, passport-kakao를 이용하여 구현했습니다.
</p>

<img src="https://github.com/Lee-moo/full_stack_study-by-making-GGALSE/blob/main/login.gif">

#### 🏁 게시판
<p>
    게시판의 글쓰기 기능을 위한 text editor 중 CKEditor를 이용했습니다.
</p>
<img src="https://github.com/Lee-moo/full_stack_study-by-making-GGALSE/blob/main/post.gif">

#### 🏁 반응형 
<p>
   프론트와 관련해서 부족함이 많지만, 반응형으로 동작하도록 제작하고 싶어서 시도해봤습니다.  
</p>

<img src="https://github.com/Lee-moo/full_stack_study-by-making-GGALSE/blob/main/responsive.gif">
