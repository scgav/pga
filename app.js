const grid = document.getElementById('grid');
const countEl = document.getElementById('count');
const barFill = document.getElementById('barFill');

const remainingNamesEl = document.getElementById('remainingNames');
const remainingCountEl = document.getElementById('remainingCount');

const selections = new Map();

let submitted = false;
let cards = [];


/* =========================================================
   PGA TOUR HEADSHOTS
   ========================================================= */

const PGA_PLAYER_LIST =
  "https://data-api.pgatour.com/player/list/R";

const PGA_HEADSHOT = id =>
  `https://pga-tour-res.cloudinary.com/image/upload/c_thumb,g_face,w_600,h_600,z_0.72/headshots_${id}.jpg`;


/*
 * Verified PGA TOUR player IDs.
 *
 * The game also attempts to retrieve IDs from the PGA TOUR
 * player directory for anyone not explicitly listed here.
 */
const VERIFIED_IDS = {
  "Scottie Scheffler": "46046",
  "Rory McIlroy": "28237",
  "Brooks Koepka": "36689",
  "Cameron Young": "57366",
  "Si Woo Kim": "37455",
  "Chris Gotterup": "59095",
  "Sam Burns": "47504",
  "Tommy Fleetwood": "30911",
  "Jacob Bridgeman": "60004",
  "Russell Henley": "34098",
  "Ryan Gerard": "59018",
  "Gary Woodland": "31323",
  "Kristoffer Reitan": "49855",
  "Min Woo Lee": "37378",
  "J.J. Spaun": "39324",
  "Robert MacIntyre": "52215",
  "Maverick McNealy": "46442",
  "Michael Brennan": "61522",
  "Ryo Hisatsune": "51287",
  "Ben Griffin": "54591",
  "Nico Echavarria": "51349",
  "Austin Smotherman": "50095",
  "Sahith Theegala": "51634",
  "Matt McCarty": "59141",
  "Pierceson Coody": "59836",
  "Harris English": "34099",
  "Doug Ghim": "52375",
  "Michael Thorbjornsen": "57364",
  "Eric Cole": "47591",
  "Harry Hall": "57975",
  "Sungjae Im": "39971",
  "Ludvig Åberg": "52955",
  "Alex Smalley": "46340",
  "Jordan Spieth": "34046"
};


/* =========================================================
   HELPERS
   ========================================================= */

function norm(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}


const board = shuffle([...PLAYERS]);


/* =========================================================
   RESOLVE PGA TOUR PLAYER IDS
   ========================================================= */

async function resolvePgaIds() {

  const ids = { ...VERIFIED_IDS };

  try {

    const response = await fetch(
      PGA_PLAYER_LIST,
      { mode: "cors" }
    );

    if (!response.ok) {
      throw new Error("PGA TOUR player directory unavailable");
    }

    const data = await response.json();

    const rows = Array.isArray(data)
      ? data
      : (data.players || []);

    const byName = new Map(
      rows.map(player => [
        norm(
          player.displayName ||
          `${player.firstName || ""} ${player.lastName || ""}`
        ),
        String(player.id)
      ])
    );

    PLAYERS.forEach(player => {

      const id = byName.get(
        norm(player.name)
      );

      if (id) {
        ids[player.name] = id;
      }

    });

  } catch (error) {

    console.warn(
      "PGA TOUR player directory request failed. Using embedded IDs.",
      error
    );

  }

  return ids;
}


/* =========================================================
   NAME AVAILABILITY
   ========================================================= */

function usedElsewhere(cardId) {

  return new Set(
    [...selections.entries()]
      .filter(([id]) => id !== cardId)
      .map(([, name]) => name)
  );

}


function matches(query, name) {

  const q = norm(query);

  if (!q) {
    return true;
  }

  const n = norm(name);

  return q
    .split(" ")
    .every(part => n.includes(part));

}


/* =========================================================
   NAMES REMAINING PANEL
   ========================================================= */

function lastNameSort(a, b) {

  const aParts = a.name.trim().split(/\s+/);
  const bParts = b.name.trim().split(/\s+/);

  const aLast = aParts[aParts.length - 1];
  const bLast = bParts[bParts.length - 1];

  return (
    aLast.localeCompare(bLast) ||
    a.name.localeCompare(b.name)
  );

}


function updateRemaining() {

  const used = new Set(
    selections.values()
  );

  const remaining = PLAYERS
    .filter(player => !used.has(player.name))
    .sort(lastNameSort);

  remainingCountEl.textContent =
    remaining.length;

  remainingNamesEl.innerHTML = "";

  if (!remaining.length) {

    remainingNamesEl.innerHTML =
      '<div class="remainingEmpty">Every name has been assigned.</div>';

    return;
  }

  remaining.forEach(player => {

    const div =
      document.createElement("div");

    div.className =
      "remainingName";

    div.textContent =
      player.name;

    remainingNamesEl.appendChild(div);

  });

}


/* =========================================================
   PROGRESS
   ========================================================= */

function updateProgress() {

  const n = selections.size;

  countEl.textContent = n;

  barFill.style.width =
    n + "%";

  updateRemaining();

}


/* =========================================================
   AUTOCOMPLETE
   ========================================================= */

function renderMenu(
  card,
  input,
  menu,
  player
) {

  if (submitted) {
    return;
  }

  const used =
    usedElsewhere(player.id);

  const query =
    input.value;

  /*
   * CRITICAL:
   * Any player already selected on another card
   * is removed from autocomplete.
   */
  const options = PLAYERS
    .filter(candidate =>
      !used.has(candidate.name) &&
      matches(query, candidate.name)
    )
    .slice(0, 12);

  menu.innerHTML = "";

  if (!options.length) {

    menu.innerHTML =
      '<div class="empty">No available names match.</div>';

    menu.classList.add("open");

    return;
  }

  options.forEach(candidate => {

    const option =
      document.createElement("div");

    option.className =
      "option";

    option.textContent =
      candidate.name;

    option.setAttribute(
      "role",
      "option"
    );

    option.addEventListener(
      "mousedown",
      event => {

        event.preventDefault();

        choose(
          card,
          input,
          menu,
          player,
          candidate.name
        );

      }
    );

    menu.appendChild(option);

  });

  menu.classList.add("open");

}


/* =========================================================
   CHOOSE / CLEAR ANSWERS
   ========================================================= */

function choose(
  card,
  input,
  menu,
  player,
  name
) {

  selections.set(
    player.id,
    name
  );

  input.value = name;

  input.dataset.selected =
    name;

  card.classList.add(
    "matched"
  );

  menu.classList.remove(
    "open"
  );

  updateProgress();

}


function clearChoice(
  card,
  input,
  menu,
  player
) {

  selections.delete(
    player.id
  );

  input.value = "";

  input.dataset.selected = "";

  card.classList.remove(
    "matched"
  );

  menu.classList.remove(
    "open"
  );

  updateProgress();

  input.focus();

  renderMenu(
    card,
    input,
    menu,
    player
  );

}


/* =========================================================
   CREATE PLAYER CARD
   ========================================================= */

function makeCard(
  player,
  index,
  pgaIds
) {

  const card =
    document.createElement("article");

  card.className =
    "card";

  card.dataset.id =
    player.id;


  /*
   * IMPORTANT:
   *
   * No initials are displayed here.
   *
   * Initials would give away information
   * in a face-identification game.
   */
  card.innerHTML = `

    <div class="photoWrap">

      <div class="rank">
        FACE ${index + 1}
      </div>

      <div class="fallback">
        Image unavailable
      </div>

      <img
        hidden
        alt="Golfer headshot"
      >

    </div>

    <div class="answer">

      <input
        autocomplete="off"
        spellcheck="false"
        aria-label="Name this golfer"
        placeholder="Type a player name…"
      >

      <button
        type="button"
        class="clear"
        aria-label="Clear answer"
      >
        ×
      </button>

      <div
        class="menu"
        role="listbox"
      ></div>

    </div>

    <div class="feedback"></div>

  `;


  const img =
    card.querySelector("img");

  const fallback =
    card.querySelector(".fallback");

  const input =
    card.querySelector("input");

  const menu =
    card.querySelector(".menu");

  const clear =
    card.querySelector(".clear");


  /* -------------------------
     HEADSHOT
     ------------------------- */

  const playerId =
    pgaIds[player.name];

  if (playerId) {

    img.src =
      PGA_HEADSHOT(playerId);

    img.onload = () => {

      fallback.hidden = true;

      img.hidden = false;

    };

    img.onerror = () => {

      img.hidden = true;

      fallback.hidden = false;

    };

  }


  /* -------------------------
     INPUT EVENTS
     ------------------------- */

  input.addEventListener(
    "focus",
    () => {

      renderMenu(
        card,
        input,
        menu,
        player
      );

    }
  );


  input.addEventListener(
    "input",
    () => {

      /*
       * If the user edits an already-selected
       * answer, immediately release that name
       * back into the available pool.
       */
      if (
        input.dataset.selected &&
        input.value !==
          input.dataset.selected
      ) {

        selections.delete(
          player.id
        );

        input.dataset.selected =
          "";

        card.classList.remove(
          "matched"
        );

        updateProgress();

      }

      renderMenu(
        card,
        input,
        menu,
        player
      );

    }
  );


  /* -------------------------
     KEYBOARD NAVIGATION
     ------------------------- */

  input.addEventListener(
    "keydown",
    event => {

      const options =
        [...menu.querySelectorAll(".option")];

      let active =
        options.findIndex(option =>
          option.classList.contains("active")
        );


      if (event.key === "ArrowDown") {

        event.preventDefault();

        active =
          Math.min(
            active + 1,
            options.length - 1
          );

        options.forEach(option =>
          option.classList.remove("active")
        );

        options[active]
          ?.classList.add("active");

        options[active]
          ?.scrollIntoView({
            block: "nearest"
          });

      }


      if (event.key === "ArrowUp") {

        event.preventDefault();

        active =
          Math.max(
            active - 1,
            0
          );

        options.forEach(option =>
          option.classList.remove("active")
        );

        options[active]
          ?.classList.add("active");

        options[active]
          ?.scrollIntoView({
            block: "nearest"
          });

      }


      if (
        event.key === "Enter" &&
        options.length
      ) {

        event.preventDefault();

        choose(
          card,
          input,
          menu,
          player,
          options[
            Math.max(active, 0)
          ].textContent
        );

      }


      if (event.key === "Escape") {

        menu.classList.remove(
          "open"
        );

      }

    }
  );


  input.addEventListener(
    "blur",
    () => {

      setTimeout(
        () =>
          menu.classList.remove(
            "open"
          ),
        100
      );

    }
  );


  clear.addEventListener(
    "click",
    () => {

      clearChoice(
        card,
        input,
        menu,
        player
      );

    }
  );


  grid.appendChild(card);


  cards.push({
    card,
    input,
    player
  });

}


/* =========================================================
   INITIALIZE GAME
   ========================================================= */

async function init() {

  const pgaIds =
    await resolvePgaIds();


  board.forEach(
    (player, index) => {

      makeCard(
        player,
        index,
        pgaIds
      );

    }
  );


  updateProgress();


  const missing =
    PLAYERS.filter(
      player =>
        !pgaIds[player.name]
    ).length;


  if (missing) {

    document.getElementById(
      "imageNotice"
    ).textContent =
      `PGA TOUR headshots loaded. ${missing} player ID${missing === 1 ? "" : "s"} could not be resolved; those cards show “Image unavailable.”`;

  }

}


init();


/* =========================================================
   SUBMIT
   ========================================================= */

document
  .getElementById("submitBtn")
  .addEventListener(
    "click",
    () => {

      const missing =
        100 - selections.size;

      const message =
        document.getElementById(
          "submitMsg"
        );


      if (
        missing &&
        !confirm(
          `You still have ${missing} unmatched ${missing === 1 ? "player" : "players"}. Submit anyway?`
        )
      ) {

        return;

      }


      submitted = true;

      let score = 0;


      cards.forEach(
        ({
          card,
          input,
          player
        }) => {

          const guess =
            selections.get(
              player.id
            ) || "";

          const correct =
            guess ===
            player.name;


          if (correct) {
            score++;
          }


          card.classList.add(
            correct
              ? "correct"
              : "wrong"
          );


          card.querySelector(
            ".feedback"
          ).textContent =
            correct
              ? "✓ Correct"
              : `✕ ${guess || "No answer"} → ${player.name}`;


          input.disabled = true;


          card.querySelector(
            ".clear"
          ).style.display =
            "none";

        }
      );


      document.getElementById(
        "score"
      ).textContent =
        score;


      document.getElementById(
        "scoreLine"
      ).textContent =

        score >= 90
          ? "Tour-level face recognition. Ridiculous."

        : score >= 75
          ? "You know this field extremely well."

        : score >= 50
          ? "Solid — but the bottom half got you."

        : "The FedExCup Fall sickos have defeated you.";


      document
        .getElementById(
          "results"
        )
        .showModal();


      message.textContent =
        "";

    }
  );


/* =========================================================
   RESULT BUTTONS
   ========================================================= */

document
  .getElementById("reviewBtn")
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "results"
        )
        .close();

    }
  );


document
  .getElementById("playAgainBtn")
  .addEventListener(
    "click",
    () => {

      location.reload();

    }
  );


document
  .getElementById("resetBtn")
  .addEventListener(
    "click",
    () => {

      if (
        confirm(
          "Clear every answer and reshuffle the board?"
        )
      ) {

        location.reload();

      }

    }
  );


/* =========================================================
   MOBILE REMAINING-NAMES PANEL
   ========================================================= */

const remainingPanel =
  document.querySelector(
    ".remainingPanel"
  );


const remainingToggle =
  document.getElementById(
    "remainingToggle"
  );


remainingToggle.addEventListener(
  "click",
  () => {

    const open =
      remainingPanel.classList.toggle(
        "open"
      );


    remainingToggle.setAttribute(
      "aria-expanded",
      String(open)
    );


    remainingToggle.textContent =
      open
        ? "Hide remaining names"
        : "Show remaining names";

  }
);