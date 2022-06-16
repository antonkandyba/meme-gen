'use strict'

var gCanvas
var gCtx
var gCurrWidth = 500

function initEditor() {
	gCanvas = document.querySelector('.meme-canvas')
	gCtx = gCanvas.getContext('2d')

	// render meme only after loading the font for the first time
	const f = new FontFace('impact', 'url(fonts/impact.ttf)')
	f.load().then((font) => {
		document.fonts.add(font)

		renderMeme()
		renderAccordingToLine()
	})

	onResizeCanvas()
	window.addEventListener('resize', onResizeCanvas)
}

function renderMeme() {
	const meme = getMeme()
	const img = new Image()
	img.src = `img/${meme.selectedImgId}.jpg`
	// render image when it's ready
	img.onload = () => {
		gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)

		meme.lines.forEach((line) => {
			// set dynamic text properties
			gCtx.font = `${line.size}px impact`
			gCtx.textAlign = line.align
			gCtx.fillStyle = line.textColor
			gCtx.strokeStyle = gCtx.shadowColor = line.strokeColor

			renderTextLine(line)
		})

		// change to current line font to calculate line sizes correctly
		const line = getLine()
		if (!line) return
		gCtx.font = `${line.size}px impact`

		renderLineSelection()
	}
}

// renders the line with fill, stroke and shadow
function renderTextLine({ txt, pos }) {
	// set stroke for textx
	gCtx.lineWidth = 6
	gCtx.shadowOffsetX = 3
	gCtx.shadowOffsetY = 3
	gCtx.shadowBlur = 7

	gCtx.strokeText(txt, pos.x, pos.y)
	gCtx.fillText(txt, pos.x, pos.y)
}

function renderLineSelection() {
	// set stroke for text selection
	gCtx.lineWidth = 3
	gCtx.shadowOffsetX = 0
	gCtx.shadowOffsetY = 0
	gCtx.shadowBlur = 0
	gCtx.strokeStyle = 'yellow'

	const line = getLine()
	const txtMeasure = gCtx.measureText(line.txt)

	// choose x-axis start based on text alignment
	// add 10px on each side for padding
	let xStart = line.pos.x - 10
	if (line.align === 'center') xStart -= txtMeasure.width / 2
	if (line.align === 'right') xStart -= txtMeasure.width

	// calculate selection box size acording to the text
	gCtx.strokeRect(
		xStart,
		line.pos.y - txtMeasure.fontBoundingBoxAscent,
		txtMeasure.width + 20,
		txtMeasure.fontBoundingBoxDescent + txtMeasure.fontBoundingBoxAscent
	)
}

// render all info after line switch
function renderAccordingToLine() {
	const line = getLine()
	if (!line) return

	const elInput = document.querySelector('[name="text-input"]')
	elInput.value = line.txt

	// change the color pickers
	document.querySelector('.color-btn').style.color = line.textColor
	document.querySelector('.stroke-btn').style.color = line.strokeColor

	// remove current active, change to the pressed button
	const elActive = document.querySelector('.active')
	if (elActive) elActive.classList.remove('active')
	document.querySelector(`.align-${line.align}-btn`).classList.add('active')
}

function onLineInput(txt) {
	setLineTxt(txt)
	renderMeme()
}

function onSwitchLine() {
	switchLine()
	renderAccordingToLine()
	renderMeme()
}

function onChangeTextColor(color) {
	setTextColor(color)
	renderMeme()

	document.querySelector('.color-btn').style.color = color
}

function onChangeStrokeColor(color) {
	setStrokeColor(color)
	renderMeme()

	document.querySelector('.stroke-btn').style.color = color
}

function onAlignChange(alignment, elBtn) {
	setLineAlign(alignment)
	renderMeme()

	// remove current active, change to the pressed button
	document.querySelector('.active').classList.remove('active')
	elBtn.classList.add('active')
}

function onChangeTextSize(diff) {
	changeTextSize(diff)
	renderMeme()
}

function onMoveLine(diff) {
	moveLine(diff)
	renderMeme()
}

function onResizeCanvas() {
	const width = document.body.offsetWidth
	if (width < 520) {
		// leave 10px margin on both sides
		const newWidth = width - 20
		gCanvas.width = newWidth
		gCanvas.height = newWidth

		changeLinesOnResize(newWidth / gCurrWidth)
		renderMeme()

		gCurrWidth = newWidth
	}
	if (gCanvas.width < 500 && width >= 520) {
		gCanvas.width = gCanvas.height = 500

		changeLinesOnResize(500 / gCurrWidth)
		renderMeme()

		gCurrWidth = 500
	}
}

function onAddLine() {
	addNewLine()
	renderAccordingToLine()
	renderMeme()
}

function onRemoveLine() {
	removeLine()
	renderAccordingToLine()
	renderMeme()
}
