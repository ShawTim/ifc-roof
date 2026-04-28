import "./main.css";
import roofUrl from "./assets/roof.jpg";

const IDEOGRAPHIC_SPACE = String.fromCharCode(12288);
const DEFAULT_LOCATION = "香港交易廣場天台";
const MEME_FONT_FAMILY = '"cwtexfangsong", "DFKai-sb", "LiSong Pro", serif';
const EXPORT_SCALE = 2;
const STYLE_FONT_SIZE = 46 * EXPORT_SCALE;
const STYLE_LINE_HEIGHT = 0.92;
const STYLE_SCALE_X = 0.65;
const STYLE_LETTER_SPACING = (-2 * EXPORT_SCALE) / STYLE_SCALE_X;
const OUTLINE_OFFSETS = [];

for (let y = -2; y <= 2; y += 1) {
  for (let x = -2; x <= 2; x += 1) {
    if (x === 0 && y === 0) {
      continue;
    }
    if (Math.abs(x) + Math.abs(y) <= 3) {
      OUTLINE_OFFSETS.push([
        (x * EXPORT_SCALE) / STYLE_SCALE_X,
        y * EXPORT_SCALE,
      ]);
    }
  }
}

const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const locationInput = document.getElementById("locationInput");
const resetButton = document.getElementById("resetButton");
const downloadButton = document.getElementById("downloadButton");
const caption = document.getElementById("caption");
const canvas = document.getElementById("previewCanvas");
const ctx = canvas.getContext("2d");
let isMemeFontReady = false;

const bgImage = new Image();
bgImage.src = roofUrl;

function toFullWidth(text) {
  return text.replace(/[0-9:]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) + 0xfee0)
  );
}

function todayAsISODate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = `${now.getMonth() + 1}`.padStart(2, "0");
  const dd = `${now.getDate()}`.padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function readDateLabel(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return toFullWidth(`${month}月${day}日`);
}

function readTimeLabel(time24) {
  const [hourText, minuteText] = time24.split(":");
  const hour24 = Number(hourText);
  const minute = Number(minuteText);
  const amPm = hour24 >= 12 ? "ＰＭ" : "ＡＭ";
  const hour12 = hour24 % 12 || 12;
  const leading = hour12 > 9 ? "" : IDEOGRAPHIC_SPACE;
  const time = `${leading}${hour12}:${`${minute}`.padStart(2, "0")}`;
  return `${toFullWidth(time)}${amPm}`;
}

function readLocationLabel(rawLocation) {
  const location = rawLocation.trim() || DEFAULT_LOCATION;
  return location;
}

function fitFontSize(text, start, min, width) {
  let size = start;
  while (size >= min) {
    ctx.font = `500 ${size}px ${MEME_FONT_FAMILY}`;
    const spacing = STYLE_LETTER_SPACING * (size / STYLE_FONT_SIZE);
    if (measureSpacedText(text, spacing) <= width) {
      return size;
    }
    size -= 2;
  }
  return min;
}

function measureSpacedText(text, letterSpacing) {
  const chars = [...text];
  if (chars.length === 0) {
    return 0;
  }

  let width = 0;
  for (let index = 0; index < chars.length; index += 1) {
    width += ctx.measureText(chars[index]).width;
    if (index < chars.length - 1) {
      width += letterSpacing;
    }
  }

  return width;
}

function drawSpacedText(text, x, y, letterSpacing) {
  const chars = [...text];
  let cursorX = x;

  for (let index = 0; index < chars.length; index += 1) {
    ctx.fillText(chars[index], cursorX, y);
    cursorX += ctx.measureText(chars[index]).width + letterSpacing;
  }
}

function getLocationRightPadding(lineWidth) {
  ctx.font = `500 ${STYLE_FONT_SIZE}px ${MEME_FONT_FAMILY}`;
  const spacing = STYLE_LETTER_SPACING;
  const legacyIndentWidth = measureSpacedText(
    `${IDEOGRAPHIC_SPACE}${IDEOGRAPHIC_SPACE}`,
    spacing
  );
  const defaultLocationWidth = measureSpacedText(DEFAULT_LOCATION, spacing);
  const desiredDefaultXFromLeft = legacyIndentWidth;
  const rightPadding =
    lineWidth - desiredDefaultXFromLeft - defaultLocationWidth;
  return Math.max(0, rightPadding);
}

function drawMemeLine(
  text,
  x,
  y,
  fontSize,
  lineWidth,
  align = "left",
  rightPadding = 0
) {
  const adjustedFontSize = fitFontSize(text, fontSize, 72, lineWidth);
  const spacing = STYLE_LETTER_SPACING * (adjustedFontSize / STYLE_FONT_SIZE);
  ctx.font = `500 ${adjustedFontSize}px ${MEME_FONT_FAMILY}`;
  const textWidth = measureSpacedText(text, spacing);
  const drawX =
    align === "right"
      ? x + Math.max(0, lineWidth - rightPadding - textWidth)
      : x;

  ctx.fillStyle = "#000000";
  for (const [offsetX, offsetY] of OUTLINE_OFFSETS) {
    drawSpacedText(text, drawX + offsetX, y + offsetY, spacing);
  }

  ctx.fillStyle = "#C2C2C2";
  drawSpacedText(text, drawX, y, spacing);
}

function drawMeme() {
  if (!bgImage.complete || !isMemeFontReady) {
    return;
  }

  const dateLabel = readDateLabel(dateInput.value);
  const timeLabel = readTimeLabel(timeInput.value);
  const locationLabel = readLocationLabel(locationInput.value);
  const dateTimeLabel = `${dateLabel}${timeLabel}`;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(STYLE_SCALE_X, 1);
  ctx.textBaseline = "top";
  const left = (72 * EXPORT_SCALE) / STYLE_SCALE_X;
  const dateTop = 282 * EXPORT_SCALE;
  const locationTop = (282 + 46 * STYLE_LINE_HEIGHT) * EXPORT_SCALE;
  const lineMaxWidth = (canvas.width - 168) / STYLE_SCALE_X;
  const locationRightPadding = getLocationRightPadding(lineMaxWidth);

  drawMemeLine(dateTimeLabel, left, dateTop, STYLE_FONT_SIZE, lineMaxWidth, "left");
  drawMemeLine(
    locationLabel,
    left,
    locationTop,
    STYLE_FONT_SIZE,
    lineMaxWidth,
    "right",
    locationRightPadding
  );
  ctx.restore();

  caption.textContent = `${dateLabel}${timeLabel} ${locationLabel}`;
}

function resetControls() {
  dateInput.value = todayAsISODate();
  timeInput.value = "17:00";
  locationInput.value = "";
  drawMeme();
}

function downloadMeme() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "交易廣場天台.png";
  link.click();
}

async function loadMemeFont() {
  if (!document.fonts || !document.fonts.load) {
    isMemeFontReady = true;
    drawMeme();
    return;
  }

  try {
    await document.fonts.load(`500 ${STYLE_FONT_SIZE}px ${MEME_FONT_FAMILY}`);
    isMemeFontReady = true;
  } catch {
    isMemeFontReady = true;
  }

  drawMeme();
}

dateInput.addEventListener("input", drawMeme);
timeInput.addEventListener("input", drawMeme);
locationInput.addEventListener("input", drawMeme);
resetButton.addEventListener("click", resetControls);
downloadButton.addEventListener("click", downloadMeme);
bgImage.addEventListener("load", drawMeme);

resetControls();
loadMemeFont();
