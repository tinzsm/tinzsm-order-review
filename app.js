const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const templateImg = new Image();
templateImg.src = "template.png";

// 👉 你的 Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzkuKk1xaFLs4vc-gl_8hVTtA4Bet7Kr6lXawIFB4XOc8nY6drP_gQ9hUYqcwzP3CmK/exec"

function generate() {
  const file = document.getElementById("imgInput").files[0];
  const name = document.getElementById("name").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!file || !name || !comment) {
    alert("請填寫完整資料");
    return;
  }

  const userImg = new Image();
  userImg.src = URL.createObjectURL(file);

  userImg.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景
    ctx.drawImage(templateImg, 0, 0, 1080, 1920);

    // 名字
    ctx.fillStyle = "#000";
    ctx.font = "bold 34px Arial";
    ctx.fillText(`顧客：${name}`, 330, 580);

    // 圖片
    ctx.drawImage(userImg, 290, 620, 500, 500);

    // 評價
    ctx.font = "28px Arial";
    wrapText(
      ctx,
      `評價：${comment}`,
      330,
      1160,
      420,
      40
    );
  };
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = "";
  for (let char of text) {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(line, x, y);
      line = char;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

async function sendToYou() {
  try {
    const imageData = canvas.toDataURL("image/png");

    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData })
    });

    const result = await res.json();
    if (!result.success) throw "Upload failed";

    // ✅ 成功才顯示感謝
    document.body.innerHTML = `
      <div style="
        height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        text-align:center;
        font-size:22px;
        line-height:1.8;
      ">
        🙏 感謝您的購買與評價<br/>
        祝您有愉快的一天 💙
      </div>
    `;

  } catch (err) {
    alert("上傳失敗，請再試一次");
    console.error(err);
  }
}