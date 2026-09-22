const $ = (selector) => document.querySelector(selector);

const icons = {
  'Astral Fox': '🦊', 'Moss Golem': '🌿', 'Volt Drake': '🐉', 'Moon Sage': '🌙',
  'Ember Knight': '🔥', 'Crystal Wisp': '💎', 'Tidal Serpent': '🌊', 'Dawn Sprite': '✨',
  'Solar Titan': '☀️', 'Void Dragon': '🐲', 'Star Emperor': '👑', 'Cosmic Phoenix': '🦅'
};

const originalDeck = [
  { name:'Astral Fox', level:1, atk:900, def:700 },
  { name:'Moss Golem', level:3, atk:1200, def:1500 },
  { name:'Volt Drake', level:5, atk:1800, def:1100 },
  { name:'Moon Sage', level:4, atk:1400, def:1700 },
  { name:'Ember Knight', level:6, atk:1600, def:1000 },
  { name:'Crystal Wisp', level:2, atk:700, def:500 },
  { name:'Tidal Serpent', level:8, atk:2000, def:1200 },
  { name:'Dawn Sprite', level:7, atk:800, def:900 },
  { name:'Solar Titan', level:10, atk:2700, def:2200 },
  { name:'Void Dragon', level:12, atk:3200, def:2600 },
  { name:'Star Emperor', level:9, atk:2400, def:2100 },
  { name:'Cosmic Phoenix', level:11, atk:2900, def:1800 }
];

const ZONE_COUNT = 5;
let state;
const tributeCost = (level) => level <= 4 ? 0 : level <= 6 ? 1 : level <= 9 ? 2 : 3;
const stars = (level) => '★'.repeat(level);

function emptyZones(count = ZONE_COUNT) {
  return Array.from({ length: count }, () => null);
}

function freshState() {
  return {
    playerLP: 4000,
    enemyLP: 4000,
    deck: [...originalDeck],
    hand: [],
    // These arrays are the authoritative board. They always remain exactly five items long.
    playerMonsterZones: emptyZones(),
    enemyMonsterZones: [null, null, { ...originalDeck[2], faceDown: true }, null, null],
    playerSpellZones: emptyZones(),
    enemySpellZones: emptyZones(),
    selected: null,
    selectedTributes: [],
    turn: 1,
    over: false,
    busy: false
  };
}

function cardHTML(card, field = false) {
  const hidden = card.faceDown;
  const stats = `<div class="stats"><span>ATK ${card.atk}</span><span>DEF ${card.def}</span></div>`;
  return `<div class="card monster ${field ? 'field-card' : 'hand-card'} ${hidden ? 'face-down' : ''}" title="${card.name} · ${card.level} sao">
    <div class="card-art">${hidden ? '' : icons[card.name]}</div>
    ${hidden ? '' : `<div class="card-stars">${stars(card.level)}</div><div class="card-name">${card.name}</div>${stats}`}
  </div>`;
}

function log(message, className = '') {
  const entry = document.createElement('div');
  entry.className = `log-line ${className}`;
  entry.innerHTML = message;
  $('#log').prepend(entry);
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1600);
}

function drawCard() {
  if (!state.deck.length) return log('<b>Bộ bài đã hết!</b>', 'damage');
  state.hand.push(state.deck.shift());
}

function zoneHTML(card, type, index) {
  const label = type.includes('monster') ? 'QUÁI THÚ' : 'PHÉP / BẪY';
  return `<div class="zone ${card ? 'occupied' : 'empty'}" data-zone="${type}" data-slot="${index}">
    ${card ? cardHTML(card, true) : `<b>＋</b><small>${label}</small>`}
  </div>`;
}

function renderFixedZones() {
  // innerHTML replaces the contents of each fixed container. It never appends zones.
  const playerMonster = $('#playerMonsterSlots');
  const enemyMonster = $('#enemyMonsterSlots');
  const playerSpell = $('#playerSpellSlots');
  const enemySpell = $('#enemySpellSlots');

  playerMonster.replaceChildren(...state.playerMonsterZones.map((card, i) => htmlToElement(zoneHTML(card, 'monster', i))));
  enemyMonster.replaceChildren(...state.enemyMonsterZones.map((card, i) => htmlToElement(zoneHTML(card, 'enemy-monster', i))));
  playerSpell.replaceChildren(...state.playerSpellZones.map((card, i) => htmlToElement(zoneHTML(card, 'spell', i))));
  enemySpell.replaceChildren(...state.enemySpellZones.map((card, i) => htmlToElement(zoneHTML(card, 'enemy-spell', i))));
}

function htmlToElement(markup) {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
}

function bindBoardEvents() {
  document.querySelectorAll('#hand .card').forEach((element, index) => {
    element.onclick = () => selectCard(index);
  });

  document.querySelectorAll('#playerMonsterSlots .zone').forEach((zone) => {
    const index = Number(zone.dataset.slot);
    zone.onclick = () => {
      if (state.playerMonsterZones[index]) toggleTribute(index);
      else summon(index);
    };
  });
}

function render() {
  $('#playerLP').textContent = state.playerLP;
  $('#enemyLP').textContent = state.enemyLP;
  $('#playerLifeBar').style.width = `${Math.max(0, state.playerLP / 40)}%`;
  $('#enemyLifeBar').style.width = `${Math.max(0, state.enemyLP / 40)}%`;
  $('#deckCount').textContent = `${state.deck.length} lá còn lại`;
  $('#handCount').textContent = state.hand.length;
  $('#hand').replaceChildren(...state.hand.map((card) => htmlToElement(cardHTML(card))));

  renderFixedZones();
  bindBoardEvents();
}

function selectCard(index) {
  if (state.over || state.busy) return;
  state.selected = state.selected === index ? null : index;
  state.selectedTributes = [];
  document.querySelectorAll('#hand .card').forEach((card, i) => card.classList.toggle('selected', i === state.selected));
  document.querySelectorAll('#playerMonsterSlots .empty').forEach((zone) => zone.classList.toggle('target', state.selected !== null));
  $('#hint').textContent = state.selected === null
    ? 'Chọn bài quái trên tay, sau đó chọn một ô quái thú.'
    : 'Chọn ô quái thú trống để triệu hồi; chọn quái trên sân để hiến tế.';
}

function toggleTribute(index) {
  if (state.selected === null || state.busy) return;
  const card = state.hand[state.selected];
  const cost = tributeCost(card.level);
  if (!cost) return showToast('Lá này không cần hiến tế');

  if (state.selectedTributes.includes(index)) {
    state.selectedTributes = state.selectedTributes.filter((item) => item !== index);
  } else if (state.selectedTributes.length < cost) {
    state.selectedTributes.push(index);
  } else {
    return showToast(`Lá cấp ${card.level} sao cần đúng ${cost} lá hiến tế`);
  }

  render();
  state.selected = state.selected;
  document.querySelectorAll('#playerMonsterSlots .zone').forEach((zone) => {
    if (state.selectedTributes.includes(Number(zone.dataset.slot))) zone.classList.add('target');
  });
  $('#hint').textContent = `Đã chọn ${state.selectedTributes.length}/${cost} quái hiến tế. Chọn ô trống để triệu hồi.`;
}

function summon(slot) {
  if (state.selected === null || state.over || state.busy) return;
  if (state.playerMonsterZones[slot]) return showToast('Ô này đã có quái thú');

  const card = state.hand[state.selected];
  const cost = tributeCost(card.level);
  if (state.selectedTributes.length !== cost) {
    log(`<b>${card.name}</b> cấp ${card.level} sao cần hiến tế đúng <b>${cost}</b> quái thú.`, 'damage');
    return showToast(`Cần hiến tế ${cost} quái thú`);
  }

  // Clear selected zones only; the five zone elements themselves are never removed.
  state.selectedTributes.forEach((index) => {
    const sacrificed = state.playerMonsterZones[index];
    if (sacrificed) {
      state.playerMonsterZones[index] = null;
      log(`Hiến tế <b>${sacrificed.name}</b> (${sacrificed.level}★).`);
    }
  });

  state.playerMonsterZones[slot] = state.hand.splice(state.selected, 1)[0];
  const summoned = state.playerMonsterZones[slot];
  state.selected = null;
  state.selectedTributes = [];
  log(`<b>Bạn</b> triệu hồi ${summoned.name} (${summoned.level}★).`);
  $('#hint').textContent = 'Quái thú đã sẵn sàng. Kết thúc lượt để giao chiến.';
  render();
}

function enemyTurn() {
  if (state.over) return;
  state.busy = true;
  log('<b>Oracle AI</b> đang suy nghĩ...');
  setTimeout(() => {
    const live = state.playerMonsterZones.filter(Boolean);
    const damage = live.length ? Math.max(0, 850 - live[0].atk) : 300;
    state.playerLP -= damage;
    log(`<b>Oracle AI</b> tấn công, gây <b>${damage}</b> sát thương.`, 'damage');
    state.turn += 1;
    drawCard();
    state.over = state.playerLP <= 0 || state.enemyLP <= 0;
    if (state.over) log(state.playerLP <= 0 ? '<b>Bạn đã thất bại.</b>' : '<b>Bạn chiến thắng!</b>');
    else log(`<b>Lượt ${state.turn}</b> bắt đầu. Bạn đã rút một lá.`);
    state.busy = false;
    render();
  }, 650);
}

function endTurn() {
  if (state.over || state.busy) return;
  const attacker = state.playerMonsterZones.find(Boolean);
  const target = state.enemyMonsterZones.find(Boolean);

  if (attacker) {
    const damage = target ? Math.max(0, attacker.atk - target.atk) : attacker.atk;
    state.enemyLP -= damage;
    log(`<b>${attacker.name}</b> tấn công và gây <b>${damage}</b> sát thương.`, 'damage');
  } else {
    log('Bạn chưa có quái thú trên sân.');
  }

  if (state.enemyLP <= 0) {
    state.over = true;
    log('<b>Bạn chiến thắng!</b>');
    render();
    return;
  }
  render();
  enemyTurn();
}

function start() {
  state = freshState();
  for (let i = 0; i < 3; i += 1) drawCard();
  $('#log').replaceChildren();
  log('<b>Trận đấu bắt đầu!</b>');
  log('Số ô cố định: mỗi bên 5 ô quái thú và 5 ô phép/bẫy; các ô phụ không thay đổi.');
  render();
}

$('#endTurnBtn').onclick = endTurn;
$('#newGameBtn').onclick = start;
$('#soundBtn').onclick = () => showToast('Âm thanh đã tắt/bật');
start();
