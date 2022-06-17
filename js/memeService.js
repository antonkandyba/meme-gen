'use strict'

var gMeme = {
	selectedImgId: 1,
	selectedLineIdx: 0,
	lines: [],
	isDrag: false,
	heightToWidthRatio: 1,
}

function createDefaultLines() {
	console.log(gMeme.ratio)
	gMeme.lines = [
		{
			pos: { x: 250, y: 50 },
			txt: 'TOP TEXT',
			size: 48,
			align: 'center',
			textColor: 'white',
			strokeColor: 'black',
		},
		{
			pos: { x: 250, y: 500 * gMeme.heightToWidthRatio - 12 },
			txt: 'BOTTOM TEXT',
			size: 48,
			align: 'center',
			textColor: 'white',
			strokeColor: 'black',
		},
	]
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

function setIsMemeDrag(isDrag) {
	gMeme.isDrag = isDrag
}

function setLineTxt(txt) {
	// change the currently selected line
	gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setMemeImg(imgId) {
	gMeme.selectedImgId = imgId

	const img = new Image()
	img.src = `img/${imgId}.jpg`

	img.onload = () => {
		const ratio = img.height / img.width
		setHeightRatio(ratio)
	}
}

function setHeightRatio(ratio) {
	gMeme.heightToWidthRatio = ratio
}

function setBindBoxes() {
	gMeme.lines.forEach((line) => {
		setBindBox(line)
	})
}

function setBindBox(line = gMeme.lines[gMeme.selectedLineIdx]) {
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
	gMeme.lines[gMeme.selectedLineIdx].textColor = color
}

function setStrokeColor(color) {
	gMeme.lines[gMeme.selectedLineIdx].strokeColor = color
}

function setLineAlign(alignment) {
	gMeme.lines[gMeme.selectedLineIdx].align = alignment
}

function changeTextSize(diff) {
	// limit minimum size to 16
	if (diff < 0 && gMeme.lines[gMeme.selectedLineIdx].size <= 16) return
	gMeme.lines[gMeme.selectedLineIdx].size += diff
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

function addNewLine() {
	gMeme.lines.push({
		pos: { x: gCanvas.width / 2, y: gCanvas.height / 2 },
		txt: 'New Text',
		size: 48,
		align: 'center',
		textColor: 'white',
		strokeColor: 'black',
	})

	gMeme.selectedLineIdx = gMeme.lines.length - 1
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
