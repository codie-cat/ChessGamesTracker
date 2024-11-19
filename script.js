function toUnicodeVariant(str, variant, flags) {
  const offsets = {
    m: [0x1d670, 0x1d7f6],
    b: [0x1d400, 0x1d7ce],
    i: [0x1d434, 0x00030],
    bi: [0x1d468, 0x00030],
    c: [0x1d49c, 0x00030],
    bc: [0x1d4d0, 0x00030],
    g: [0x1d504, 0x00030],
    d: [0x1d538, 0x1d7d8],
    bg: [0x1d56c, 0x00030],
    s: [0x1d5a0, 0x1d7e2],
    bs: [0x1d5d4, 0x1d7ec],
    is: [0x1d608, 0x00030],
    bis: [0x1d63c, 0x00030],
    o: [0x24b6, 0x2460],
    p: [0x249c, 0x2474],
    w: [0xff21, 0xff10],
    u: [0x2090, 0xff10],
  };

  const variantOffsets = {
    monospace: "m",
    bold: "b",
    italic: "i",
    "bold italic": "bi",
    script: "c",
    "bold script": "bc",
    gothic: "g",
    "gothic bold": "bg",
    doublestruck: "d",
    sans: "s",
    "bold sans": "bs",
    "italic sans": "is",
    "bold italic sans": "bis",
    parenthesis: "p",
    circled: "o",
    fullwidth: "w",
  };

  // special characters (absolute values)
  var special = {
    m: {
      " ": 0x2000,
      "-": 0x2013,
    },
    i: {
      h: 0x210e,
    },
    g: {
      C: 0x212d,
      H: 0x210c,
      I: 0x2111,
      R: 0x211c,
      Z: 0x2128,
    },
    o: {
      0: 0x24ea,
      1: 0x2460,
      2: 0x2461,
      3: 0x2462,
      4: 0x2463,
      5: 0x2464,
      6: 0x2465,
      7: 0x2466,
      8: 0x2467,
      9: 0x2468,
    },
    p: {},
    w: {},
  };
  //support for parenthesized latin letters small cases
  for (var i = 97; i <= 122; i++) {
    special.p[String.fromCharCode(i)] = 0x249c + (i - 97);
  }
  //support for full width latin letters small cases
  for (var i = 97; i <= 122; i++) {
    special.w[String.fromCharCode(i)] = 0xff41 + (i - 97);
  }

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  var getType = function (variant) {
    if (variantOffsets[variant]) return variantOffsets[variant];
    if (offsets[variant]) return variant;
    return "m"; //monospace as default
  };
  var getFlag = function (flag, flags) {
    if (!flags) return false;
    return flags.split(",").indexOf(flag) > -1;
  };

  var type = getType(variant);
  var underline = getFlag("underline", flags);
  var strike = getFlag("strike", flags);
  var result = "";

  for (var k of str) {
    let index;
    let c = k;
    if (special[type] && special[type][c])
      c = String.fromCodePoint(special[type][c]);
    if (type && (index = chars.indexOf(c)) > -1) {
      result += String.fromCodePoint(index + offsets[type][0]);
    } else if (type && (index = numbers.indexOf(c)) > -1) {
      result += String.fromCodePoint(index + offsets[type][1]);
    } else {
      result += c;
    }
    if (underline) result += "\u0332"; // add combining underline
    if (strike) result += "\u0336"; // add combining strike
  }
  return result;
}

//########################################################################################
//########################################################################################

// Initialize games from localStorage or empty array
let games = JSON.parse(localStorage.getItem("chessGames")) || [];

function saveGames() {
  localStorage.setItem("chessGames", JSON.stringify(games));
}

function capitalize(str) {
  let capitalizedStr = "";
  let words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    let word = words[i].toLowerCase();
    capitalizedStr += word.charAt(0).toUpperCase() + word.slice(1) + " ";
  }
  return capitalizedStr.trim();
}

function refreshTitle() {
  document.querySelectorAll(".title").forEach(function (titleElement) {
    if (!titleElement.textContent.trim()) {
      titleElement.style.display = "none";
    }
  });
}

function addGame(event) {
  event.preventDefault();

  const playerWhite = capitalize(document.getElementById("playerWhite").value);
  const whiteRating =
    parseInt(document.getElementById("whiteRating").value) || 0;
  const whiteTitle = document.getElementById("whiteTitle").value.toUpperCase();
  const playerBlack = capitalize(document.getElementById("playerBlack").value);
  const blackRating =
    parseInt(document.getElementById("blackRating").value) || 0;
  const blackTitle = document.getElementById("blackTitle").value.toUpperCase();
  const result = document.getElementById("result").value;
  const tournament = document.getElementById("tournament").value;
  const round = parseInt(document.getElementById("round").value);
  const time = document.getElementById("time").value || 0;
  const date = document.getElementById("date").value;
  const gameLink = document.getElementById("gameLink").value;

  const game = {
    id: Date.now(),
    white: playerWhite,
    whiteRating: whiteRating, // This line should be present
    whiteTitle: whiteTitle,
    black: playerBlack,
    blackRating: blackRating, // This line should be present
    blackTitle: blackTitle,
    result: result,
    tournament: tournament,
    round: round,
    time: time,
    date: date,
    gameLink: gameLink,
  };

  games.push(game);
  saveGames();
  displayGames();
  event.target.reset();
  alert(
    `${toUnicodeVariant(
      game.whiteTitle,
      "bold sans",
      "sans"
    )} ${playerWhite} vs ${toUnicodeVariant(
      blackTitle,
      "bold sans",
      "sans"
    )} ${playerBlack} Game Added!`
  );
}

function deleteGame(id) {
  let gameToDelete = games.find((game) => game.id === id);
  let delete_confirmation = `Are you sure you want to delete:\n ${toUnicodeVariant(
    gameToDelete.whiteTitle,
    "bold sans",
    "sans"
  )} ${gameToDelete.white} vs ${toUnicodeVariant(
    gameToDelete.blackTitle,
    "bold sans",
    "sans"
  )} ${gameToDelete.black} ?`;
  if (confirm(delete_confirmation) == true) {
    games = games.filter((game) => game.id !== id);
    saveGames();
    displayGames();
  } else {
    alert("Cancelled!");
  }
}

function displayGames(searchTerm = "") {
  const gamesList = document.getElementById("gamesList");
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredGames = games
    .filter(
      (game) =>
        game.white.toLowerCase().includes(normalizedSearchTerm) ||
        game.black.toLowerCase().includes(normalizedSearchTerm)
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  gamesList.innerHTML = filteredGames
    .map(
      (game) => `
        <a href="${game.gameLink}" target="_blank" class="game-entry-link">
          <div class="game-entry" data-game-id="${game.id}">
              <div class="game-details" class="inlineForm" style="align-items: center;">
                  <strong>${game.tournament} : <span class="game-time">${game.time}</span></strong>
                  <span class="entry-date"><strong>${game.date}</strong></span>
              </div>
              <div class="player-details">
                <div class="player-left">
                      <span>
                          <span class="title">${game.whiteTitle}</span> ${game.white} (${game.whiteRating})
                      </span>
                </div>
                <div class="game-result">
                  <strong>${game.result}</strong>
                </div>
                <div class="player-right">
                  <span>
                    <span class="title">${game.blackTitle}</span> ${game.black} (${game.blackRating})
                  </span>
                </div>
              </div>
              <button class="delete-game-btn" onclick="deleteGame(${game.id}); event.preventDefault()">🗑️</button>
          </div>
        </a>
      `
    )
    .join("");
  refreshTitle();
}

document.getElementById("gameForm").addEventListener("submit", addGame);
document.getElementById("searchInput").addEventListener("input", (e) => {
  displayGames(e.target.value);
});

const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    tabContents[index].classList.add("active");
  });
});

displayGames();
