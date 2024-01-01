window.onload = function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  function randomColor() {
    return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
  }

const texts = [
  "Bu yıl harika şeyler kodladın!",
  "Bu yıl bir çok insanın öğrenmesine faydalı oldun."
];

let index = 0;
let letterIndex = 0;
let currentText = "";
let isDeleting = false;

function type() {
  currentText = texts[index];
  if (isDeleting) {
    currentText = currentText.slice(0, --letterIndex);
  } else {
    currentText = texts[index].slice(0, ++letterIndex);
  }

  document.getElementById("changingText").innerHTML = currentText;

  const speed = isDeleting ? 50 : 150;

  if (!isDeleting && currentText === texts[index]) {
    isDeleting = true;
    speedDelay = 2000;
  } else if (isDeleting && currentText === "") {
    isDeleting = false;
    index = (index + 1) % texts.length;
    speedDelay = 500;
  }

  setTimeout(type, speed);
}

setTimeout(type, 500);




  class Line {
    constructor(x, y, length, color, thickness, speed) {
      this.x = x;
      this.y = y;
      this.length = length;
      this.color = color;
      this.thickness = thickness;
      this.speed = speed;
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.length, this.y);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.thickness;
      ctx.stroke();
    }

    update() {
      this.x += this.speed;

      if (this.x - this.length > canvas.width) {
        this.x = -this.length;
        this.color = randomColor();
      }

      this.draw();
    }
  }

  const lines = [];

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const length = Math.random() * 400 + 100;
    const thickness = Math.random() * 4 + 1;
    const speed = Math.random() * 2 + 0.5;
    const color = randomColor();

    lines.push(new Line(x, y, length, color, thickness, speed));
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < lines.length; i++) {
      lines[i].update();
    }
  }

  animate();

  document.getElementById('submitButton').addEventListener('click', function() {
    const inputVal = document.getElementById('textInput').value;
    document.querySelector('#searchuser').style.display = 'none';
    animateLines();
  });

  function animateLines() {
    const interval = setInterval(function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < lines.length; i++) {
        lines[i].update();
      }

      for (let i = 0; i < lines.length; i++) {
        lines[i].y -= lines[i].speed * 10;
      }

      if (lines[0].y + lines[0].length < 0) {
        clearInterval(interval);
        showContent();
      }
    }, 30);
  }

  function showContent() {
    const content = document.querySelector('.content');
    content.style.display = 'block';

    document.getElementById('nextButton').addEventListener('click', function() {
      resetLines();
      content.style.display = 'none';
    });
  }

  function resetLines() {
    for (let i = 0; i < lines.length; i++) {
      lines[i].x = Math.random() * canvas.width;
      lines[i].y = Math.random() * canvas.height;
      lines[i].length = Math.random() * 400 + 100;
      lines[i].thickness = Math.random() * 4 + 1;
      lines[i].speed = Math.random() * 2 + 0.5;
      lines[i].color = randomColor();
    }
    animateLines();
  }
};

$(document).ready(function() {
  $('#searchuser').submit(function(e) {
    e.preventDefault(); // Formun default davranışını engelle

    const inputVal = $('#textInput').val();
    $('#searchuser').hide();
    $('#changingText').hide();
    $.ajax({
      type: 'POST',
      url: 'ajax.php',
      data: { inputData: inputVal },
      success: function(response) {
        var data = JSON.parse(response);
        var totalRepos = data.totalRepos;
        var mostStarredRepo = data.mostStarredRepo;
        var mostForkedRepo = data.mostForkedRepo;
        var followers = data.followers;
        var avatarUrl = data.avatarUrl;
        var githubName = data.githubName;
        var name = data.name;
        var starredRepos = data.starredRepos;
        var forkedRepos = data.forkedRepos;
        var starredHTML = starredRepos.join(',').replace(/,/g, '<br>');
        var forkedHTML = forkedRepos.join(',').replace(/,/g, '<br>');


        var content1 = `
          <div class="content content1 animate__animated animate__fadeIn" style="display:none;">
            <p class="slidtext">Bu yıl, senin için harika bir yıl oldu! Peki, neler olduğuna bakmak ister misin?</p>
            <button class="nextButton button">İleri</button>
          </div>
        `;

        var content2 = `
          <div class="content content2 animate__animated animate__fadeIn">
          <div class="profile"><img src="${data.avatarUrl}" alt="Profil Resmi"><p style="margin-left: 19px;font-size: 20px;">${data.githubName}</p></div>

            <p class="slidtext"> Bu yıl bir sürü proje yaptın ama en beğenilen projen:</p>
            <p class="animate__animated animate__rotateInUpRight" style="font-weight:bold;font-size: 35px;">${data.mostStarredRepo}</p>
            <p class="slidtext">oldu.</p>
            <button class="nextButton button">İleri</button>
          </div>
        `;


        var content3 = `
          <div class="content content3 animate__animated animate__fadeIn" style="display:none;">
            <p class="slidtext">Bir çok projen kullanıldı.. Ama bir projen <b>fork</b>lanmaya doymadı!</p>
            <button class="nextButton button">İleri</button>
          </div>
          `;


        var content4 = `
          <div class="content content4 animate__animated animate__fadeIn" style="display:none;">
          <div class="profile"><img src="${data.avatarUrl}" alt="Profil Resmi"><p style="
              margin-left: 19px;
              font-size: 20px;
          ">${data.githubName}</p></div>

            <p class="slidtext">Bir çok projen yıldızlandı, ama insanların en çok forkladığı projen:</p>
            <p class="animate__animated animate__jackInTheBox" style="font-weight:bold;font-size: 35px;">${data.mostForkedRepo}</p>
            <p class="slidtext">oldu.</p>
            <button class="nextButton button">İleri</button>
          </div>
        `;

        var content5 = `
          <div class="content content5 animate__animated animate__fadeIn" style="display:none;">
            <p class="slidtext">Yeni yılın şimdiden kutlu olsun! 🎄 <br> Yeni yılda muhteşem projelerini bekliyoruz! 🎉</p>
            <button class="nextButton button">İleri</button>
          </div>
        `;

        var content6 = `
          <div class="content content6 animate__animated animate__fadeIn" style="display:none;">
            <p class="slidtext">Eee, Wrapped için hazır mısın? 🫣</p>
            <button class="nextButton button">İleri</button>
          </div>
        `;

        var starredHTML = starredRepos.join('<br>');
        var forkedHTML = forkedRepos.join('<br>');
         // Yıldızlanan repoları listeleme
            $('#starred-list').html(starredHTML);

            // Fork edilen repoları listeleme
            $('#forked-list').html(forkedHTML);

        var content7 = `

<div class="content content7 animate__animated animate__fadeIn" id="wrapped">
<div class="profil" style="display: flex;justify-content: flex-start;align-items: center;background: linear-gradient(45deg, #383651, transparent);"><img src="${avatarUrl}" alt="Profil Resmi" style="width: 125px;margin-right: 17px;"><p>${name}</p></div>
<div class="stats" style="margin-top: 31px;"><p style="background: linear-gradient(45deg, #2f3057, transparent);padding: 11px;border-radius: 5px;font-size: 17px;"><i class="fa-solid fa-code-fork"></i> En Çok Fork Yapılan Repo: ${mostForkedRepo}</p>
<p style="background: linear-gradient(45deg, #28294a, transparent);padding: 11px;border-radius: 5px;"><i class="fa-solid fa-star"></i> En Çok Star Yapılan Repo: ${mostStarredRepo}</p><p style="background: linear-gradient(45deg, #2a2c52, transparent);padding: 11px;border-radius: 5px;"><i class="fa-solid fa-user"></i> Takipçi Sayısı: ${followers}</p><div class="list" style="display: flex;justify-content: center;width: 100%;"><div class="forks" style="background: linear-gradient(178deg, #45476e, transparent);padding: 11px;margin-left: -27px;padding-left: 0px;padding-right: 37px;"><p style="padding-left: 20px;"><i class="fa-solid fa-code-fork"></i> En çok <b>Forks</b></p>
  <ul id="forkedList" style="text-align: left;">${forkedHTML}</ul></div>
  <div class="stars" style="background: linear-gradient(0deg, #313359, transparent);padding: 11px;margin-left: -27px;padding-left: 0px;padding-right: 38px;">
<p style="padding-left: 20px;"><i class="fa-solid fa-star"></i> En çok <b>Yıldız</b></p>
<ul id="starredList" style="text-align: left;">${starredHTML}</ul></div></div></div>
</div>
        `;

        $('#contentContainer').html(content1 + content2 + content3 + content4 + content5 + content6 + content7);
        $('.content1 .nextButton').click(function() {
          $('.content1').hide();
          $('.content2').show();
        });
        $('.content2 .nextButton').click(function() {
          $('.content2').hide();
          $('.content3').show();
        });
        $('.content3 .nextButton').click(function() {
          $('.content3').hide();
          $('.content4').show();
        });
        $('.content4 .nextButton').click(function() {
          $('.content4').hide();
          $('.content5').show();
        });
        $('.content5 .nextButton').click(function() {
          $('.content5').hide();
          $('.content6').show();
        });
        $('.content6 .nextButton').click(function() {
          $('.content6').hide();
          $('.content7').show();
        });
      }
    });
  });
});
