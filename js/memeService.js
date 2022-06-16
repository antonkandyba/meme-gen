'use strict'

var gMeme = {
	selectedImgId: 5,
	selectedLineIdx: 0,
	lines: [
		{
			pos: { x: 250, y: 50 },
			txt: 'TOP TEXT',
			size: 48,
			align: 'center',
			textColor: 'white',
			strokeColor: 'black',
		},
		{
			pos: { x: 250, y: 480 },
			txt: 'BOTTOM TEXT',
			size: 48,
			align: 'center',
			textColor: 'white',
			strokeColor: 'black',
		},
	],
}

function getMeme() {
	return gMeme
}

function getLine() {
	return gMeme.lines[gMeme.selectedLineIdx]
}

function getLineNumber() {
	return gMeme.selectedLineIdx + 1
}

function setLineTxt(txt) {
	// change the currently selected line
	gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setMemeImg(imgId) {
	gMeme.selectedImgId = imgId
}

// switches current line to the next one
function switchLine() {
	gMeme.selectedLineIdx++
	// go back to first line if we have no more lines
	if (gMeme.selectedLineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0
}

function setTextColor(color) {
	gMeme.lines[gMeme.selectedLineIdx].textColor = color
}

function setStrokeColor(color) {
	gMeme.lines[gMeme.selectedLineIdx].strokeColor = color
}

function setLineAlign(alignment) {
	gMeme.lines[gMeme.selectedLineIdx].align = alignment
}

function increaseTextSize() {
	gMeme.lines[gMeme.selectedLineIdx].size += 4
}

function decreaseTextSize() {
	// limit minimum size to 16
	if (gMeme.lines[gMeme.selectedLineIdx].size <= 16) return
	gMeme.lines[gMeme.selectedLineIdx].size -= 4
}

function changeTextSize(diff) {
	// limit minimum size to 16
	if (diff < 0 && gMeme.lines[gMeme.selectedLineIdx].size <= 16) return
	gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function moveLine(diff) {
	// don't let the text to go out of the canvas completely
	const posY = gMeme.lines[gMeme.selectedLineIdx].pos.y
	if (diff < 0 && posY < 50) return
	if (diff > 0 && posY > gCanvas.height) return

	gMeme.lines[gMeme.selectedLineIdx].pos.y += diff
}
