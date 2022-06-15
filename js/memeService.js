'use strict'

var gMeme = {
	selectedImgId: 5,
	selectedLineIdx: 0,
	lines: [
		{
			pos: { x: 250, y: 50 },
			txt: 'Hello World',
			size: 48,
			align: 'center',
			fillColor: 'white',
			strokeColor: 'black',
		},
		{
			pos: { x: 250, y: 480 },
			txt: 'Goodbye World',
			size: 48,
			align: 'center',
			fillColor: 'white',
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

// switches current line to the next one
function switchLine() {
	gMeme.selectedLineIdx++
	// go back to first line if we have no more lines
	if (gMeme.selectedLineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0
}
