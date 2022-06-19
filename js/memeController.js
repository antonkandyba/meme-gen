'use strict'

var gCanvas
var gCtx
var gCurrWidth = 500
var gDragStartPos
var gIsFirstLoad = true

function initEditor(savedImage = false) {
	gCanvas = document.querySelector('.meme-canvas')
	gCtx = gCanvas.getContext('2d')

	if (gIsFirstLoad) {
		// render meme only after loading the font for the first time
		const f = new FontFace('impact', 'url(fonts/impact.ttf)')
		f.load().then((font) => {
			document.fonts.add(f)
			_loadStart(savedImage)
		})
		gIsFirstLoad = false
	} else {
		_loadStart()
	}
}

function _loadStart(savedImage) {
	if (!savedImage) createDefaultLines()
	renderMeme()
	renderAccordingToLine()
	// resize canvas at start if the viewport is small
	onResizeCanvas()
	addListeners()
}

// RENDERS

function renderMeme(isForExport = false) {
	const meme = getMeme()
	const img = new Image()
	img.src = `img/${meme.selectedImgId}.jpg`
	// render image when it's ready
	img.onload = () => {
		// set height according ratio
		gCanvas.height = getRatio() * gCurrWidth

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

		if (!isForExport) renderLineSelection()
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

	setBindBoxes()
	const bindBox = getBindBox()
	gCtx.strokeRect(bindBox.x, bindBox.y, bindBox.width, bindBox.height)
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

// INTERACTING WITH OPERATIONS

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

function onMoveLine(diffY) {
	moveLine(0, diffY)
	renderMeme()
}

function onAddLine() {
	addNewLine()
	renderAccordingToLine()
	renderMeme()
}

function onAddSticker(sticker) {
	addNewLine(sticker)
	renderAccordingToLine()
	renderMeme()
}

function onRemoveLine() {
	removeLine()
	renderAccordingToLine()
	renderMeme()
}

function onDownloadImg(elLink) {
	// renderMeme(true)
	const imgContent = gCanvas.toDataURL('image/jpeg')
	elLink.href = imgContent
	// renderMeme(false)
}

function onSaveMeme() {
	saveMeme(getMeme())
	onGoToGallery(true)
}

// change canvas size based on window
function onResizeCanvas() {
	const width = document.body.offsetWidth
	if (width < 520) {
		// leave 10px margin on both sides
		const newWidth = width - 20
		gCanvas.width = newWidth
		gCanvas.height = getRatio() * newWidth

		changeLinesOnResize(newWidth / gCurrWidth)
		renderMeme()

		gCurrWidth = newWidth
	}
	if (gCanvas.width < 500 && width >= 520) {
		gCanvas.width = 500
		gCanvas.height = getRatio() * 500

		changeLinesOnResize(500 / gCurrWidth)
		renderMeme()

		gCurrWidth = 500
	}
}

// DRAG & DROP
function addListeners() {
	window.addEventListener('resize', onResizeCanvas)
	// mouse listeners
	gCanvas.addEventListener('mousemove', onMove)
	gCanvas.addEventListener('mousedown', onDown)
	gCanvas.addEventListener('mouseup', onUp)
	// touch listeners
	gCanvas.addEventListener('touchmove', onMove)
	gCanvas.addEventListener('touchstart', onDown)
	gCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
	//Get the ev pos from mouse or touch
	const pos = getEvPos(ev)
	if (!isInLine(pos, true)) return
	// in case we change the line with the click
	renderAccordingToLine()
	setIsMemeDrag(true)
	gDragStartPos = pos
	document.body.style.cursor = 'grabbing'
	renderMeme()
}

function onUp(ev) {
	const pos = getEvPos(ev)
	setIsMemeDrag(false)
	if (isInLine(pos, false)) document.body.style.cursor = 'grab'
}

function onMove(ev) {
	const pos = getEvPos(ev)
	if (isMemeDrag()) {
		ev.preventDefault()
		const pos = getEvPos(ev)

		const dx = pos.x - gDragStartPos.x
		const dy = pos.y - gDragStartPos.y
		moveLine(dx, dy)
		gDragStartPos = pos
		renderMeme()
	} else {
		if (isInLine(pos, false)) document.body.style.cursor = 'grab'
		else document.body.style.cursor = 'default'
	}
}

function getEvPos(ev) {
	const touchEvs = ['touchstart', 'touchmove', 'touchend']
	//Gets the offset pos , the default pos
	var pos = {
		x: ev.offsetX,
		y: ev.offsetY,
	}

	if (touchEvs.includes(ev.type)) {
		ev.preventDefault()
		ev = ev.changedTouches[0]
		//Calc the right pos according to the touch screen
		pos = {
			x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
			y: ev.pageY - ev.target.offsetTop - ev.target.clientTop - ev.target.offsetParent.offsetTop,
		}
	}
	return pos
}
