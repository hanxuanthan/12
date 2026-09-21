function drawUnitWeapon(u, x, y, direction, teamColor) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (u.type === 'warrior') {
    // Kiếm
    const handX = x + direction * 23;
    const handY = y - 11;

    ctx.strokeStyle = '#5a321d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.lineTo(handX + direction * 11, handY + 17);
    ctx.stroke();

    ctx.strokeStyle = '#dcecff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(handX + direction * 5, handY - 5);
    ctx.lineTo(handX + direction * 28, handY - 28);
    ctx.stroke();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(handX + direction * 10, handY - 10);
    ctx.lineTo(handX + direction * 26, handY - 25);
    ctx.stroke();

    // Khiên
    ctx.fillStyle = teamColor;
    ctx.strokeStyle = '#17232d';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(x - direction * 20, y - 1);
    ctx.lineTo(x - direction * 33, y + 4);
    ctx.lineTo(x - direction * 29, y + 21);
    ctx.lineTo(x - direction * 18, y + 25);
    ctx.lineTo(x - direction * 13, y + 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#dcecff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - direction * 25, y + 3);
    ctx.lineTo(x - direction * 24, y + 18);
    ctx.stroke();

  } else if (u.type === 'archer') {
    // Cung
    const bowX = x + direction * 22;
    const bowY = y - 7;

    ctx.strokeStyle = '#75451c';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(
      bowX,
      bowY,
      20,
      direction === 1 ? -Math.PI / 2 : Math.PI / 2,
      direction === 1 ? Math.PI / 2 : -Math.PI / 2,
      direction === -1
    );
    ctx.stroke();

    // Dây cung
    ctx.strokeStyle = '#f5e6bd';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(bowX, bowY - 20);
    ctx.lineTo(bowX, bowY + 20);
    ctx.stroke();

    // Mũi tên
    ctx.strokeStyle = '#252525';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(bowX - direction * 18, bowY);
    ctx.lineTo(bowX + direction * 20, bowY);
    ctx.stroke();

    ctx.fillStyle = '#d8e8f2';
    ctx.beginPath();
    ctx.moveTo(bowX + direction * 27, bowY);
    ctx.lineTo(bowX + direction * 18, bowY - 5);
    ctx.lineTo(bowX + direction * 18, bowY + 5);
    ctx.closePath();
    ctx.fill();

  } else if (u.type === 'knight') {
    // Giáo dài
    const handX = x + direction * 23;
    const handY = y - 8;

    ctx.strokeStyle = '#6f482b';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(handX - direction * 15, handY + 22);
    ctx.lineTo(handX + direction * 28, handY - 35);
    ctx.stroke();

    // Mũi giáo
    ctx.fillStyle = '#eaf7ff';
    ctx.strokeStyle = '#17232d';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(handX + direction * 36, handY - 46);
    ctx.lineTo(handX + direction * 24, handY - 29);
    ctx.lineTo(handX + direction * 42, handY - 35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Khiên lớn
    ctx.fillStyle = '#d38a36';
    ctx.strokeStyle = '#30251b';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(x - direction * 19, y - 5);
    ctx.lineTo(x - direction * 38, y);
    ctx.lineTo(x - direction * 34, y + 27);
    ctx.lineTo(x - direction * 19, y + 34);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ffe19b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - direction * 29, y + 2);
    ctx.lineTo(x - direction * 29, y + 24);
    ctx.stroke();

  } else if (u.type === 'mage') {
    // Gậy phép
    const staffX = x + direction * 20;
    const staffY = y - 6;

    ctx.strokeStyle = '#553276';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(staffX, staffY + 25);
    ctx.lineTo(staffX + direction * 10, staffY - 29);
    ctx.stroke();

    // Quả cầu phép thuật
    const gradient = ctx.createRadialGradient(
      staffX + direction * 10,
      staffY - 35,
      2,
      staffX + direction * 10,
      staffY - 35,
      13
    );

    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.35, '#e7a7ff');
    gradient.addColorStop(1, '#923fff');

    ctx.fillStyle = gradient;
    ctx.shadowColor = '#be6cff';
    ctx.shadowBlur = 14;

    ctx.beginPath();
    ctx.arc(staffX + direction * 10, staffY - 35, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

function drawWarriorHelmet(x, headY, direction, color) {
  ctx.save();

  ctx.fillStyle = color;
  ctx.strokeStyle = '#17232d';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(x, headY - 2, 13, Math.PI, Math.PI * 2);
  ctx.lineTo(x + direction * 14, headY - 3);
  ctx.lineTo(x + direction * 4, headY - 14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawArcherHood(x, headY, direction) {
  ctx.save();

  ctx.fillStyle = '#d88b31';
  ctx.strokeStyle = '#432818';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(x, headY, 14, Math.PI, Math.PI * 2);
  ctx.lineTo(x + direction * 16, headY + 7);
  ctx.lineTo(x + direction * 5, headY + 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawKnightHelmet(x, headY, direction, color) {
  ctx.save();

  ctx.fillStyle = '#b9c9d2';
  ctx.strokeStyle = '#17232d';
  ctx.lineWidth = 3;

  // Mũ sắt
  ctx.beginPath();
  ctx.arc(x, headY, 14, Math.PI, Math.PI * 2);
  ctx.lineTo(x + direction * 15, headY + 8);
  ctx.lineTo(x - direction * 7, headY + 11);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Khe mắt
  ctx.strokeStyle = '#26323a';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(x + direction * 1, headY - 1);
  ctx.lineTo(x + direction * 13, headY - 1);
  ctx.stroke();

  // Mào
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(x - direction * 3, headY - 12);
  ctx.lineTo(x + direction * 3, headY - 20);
  ctx.stroke();

  ctx.restore();
}

function drawMageHat(x, headY, direction) {
  ctx.save();

  ctx.fillStyle = '#683b9d';
  ctx.strokeStyle = '#281735';
  ctx.lineWidth = 3;

  // Chóp mũ
  ctx.beginPath();
  ctx.moveTo(x - 15, headY - 7);
  ctx.lineTo(x + direction * 7, headY - 30);
  ctx.lineTo(x + direction * 17, headY - 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Vành mũ
  ctx.fillStyle = '#9b61ca';

  ctx.beginPath();
  ctx.ellipse(x + direction * 2, headY - 5, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Ngôi sao
  ctx.fillStyle = '#ffd85f';
  ctx.font = '12px Arial';
  ctx.fillText('★', x + direction * 2 - 5, headY - 13);

  ctx.restore();
}