'use strict'

var gMeme = {
	selectedImgId: 1,
	selectedLineIdx: 0,
	lines: [],
	isDrag: false,
	heightToWidthRatio: 1,
}

function createDefaultLines() {
	gMeme.lines = []
	addNewLine('TOP TEXT')
	addNewLine('BOTTOM TEXT')

	gMeme.lines[0].pos = { x: gCanvas.width / 2, y: 50 }
	gMeme.lines[1].pos = { x: gCanvas.width / 2, y: gCanvas.width * gMeme.heightToWidthRatio - 12 }
}

function getMeme() {
	return gMeme
}

function getLine() {
	return gMeme.lines[gMeme.selectedLineIdx]
}

function getRatio() {
	return gMeme.heightToWidthRatio
}

function getBindBox() {
	return getLine().bindBox
}

function setMeme(meme) {
	gMeme = meme
}

function setIsMemeDrag(isDrag) {
	gMeme.isDrag = isDrag
}

function setLineTxt(txt) {
	// change the currently selected line
	getLine().txt = txt
}

function setMemeImg(imgId) {
	gMeme.selectedImgId = imgId

	const img = new Image()
	img.src = `img/${imgId}.jpg`

	img.onload = () => {
		const ratio = img.height / img.width
		setHeightRatio(ratio)
		initEditor()
	}
}

function setHeightRatio(ratio) {
	gMeme.heightToWidthRatio = ratio
}

function setBindBoxes() {
	gMeme.lines.forEach((line) => {
		_setBindBox(line)
	})
}

function _setBindBox(line = getLine()) {
	const txtMeasure = gCtx.measureText(line.txt)
	// choose x-axis start based on text alignment
	// add 10px on each side for padding
	let xStart = line.pos.x - 10
	if (line.align === 'center') xStart -= txtMeasure.width / 2
	if (line.align === 'right') xStart -= txtMeasure.width

	line.bindBox = {
		x: xStart,
		y: line.pos.y - txtMeasure.fontBoundingBoxAscent,
		width: txtMeasure.width + 20,
		height: txtMeasure.fontBoundingBoxDescent + txtMeasure.fontBoundingBoxAscent,
	}
}

// switches current line to the next one
function switchLine() {
	gMeme.selectedLineIdx++
	// go back to first line if we have no more lines
	if (gMeme.selectedLineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0
}

function setTextColor(color) {
	getLine().textColor = color
}

function setStrokeColor(color) {
	getLine().strokeColor = color
}

function setLineAlign(alignment) {
	getLine().align = alignment
}

function changeTextSize(diff) {
	// limit minimum size to 16
	if (diff < 0 && getLine().size <= 16) return
	getLine().size += diff
}

function moveLine(diffX = 0, diffY = 0) {
	const line = getLine()
	// don't let the text to go out of the canvas completely
	const posX = line.pos.x + diffX
	const posY = line.pos.y + diffY
	if (posY < 0 || posY > gCanvas.height) return
	if (posX < 0 || posX > gCanvas.width) return

	line.pos.x = posX
	line.pos.y = posY
}

function changeLinesOnResize(ratio) {
	gMeme.lines.forEach((line) => {
		line.size *= ratio
		line.pos.x *= ratio
		line.pos.y *= ratio
	})
}

function addNewLine(txt = 'New line') {
	gMeme.lines.push({
		pos: { x: gCanvas.width / 2, y: gCanvas.height / 2 },
		txt,
		size: (48 * gCanvas.width) / 500,
		align: 'center',
		textColor: 'white',
		strokeColor: 'black',
	})

	if (txt !== 'TOP TEXT' && txt !== 'BOTTOM TEXT') {
		gMeme.selectedLineIdx = gMeme.lines.length - 1
	}
}

function removeLine() {
	if (gMeme.lines.length === 0) return

	gMeme.lines.splice(gMeme.selectedLineIdx, 1)

	if (gMeme.selectedLineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0
}

function isMemeDrag() {
	return gMeme.isDrag
}

function isInLine(pos, isClicked) {
	// reverse order so we chose the line on top
	for (let i = gMeme.lines.length - 1; i >= 0; i--) {
		const box = gMeme.lines[i].bindBox
		if (
			pos.x >= box.x &&
			pos.x <= box.x + box.width &&
			pos.y >= box.y &&
			pos.y <= box.y + box.height
		) {
			if (isClicked) gMeme.selectedLineIdx = i
			return true
		}
	}
	return false
}
