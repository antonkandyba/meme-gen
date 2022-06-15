'use strict'

var gCanvas
var gCtx

function onInit() {
	gCanvas = document.querySelector('.meme-canvas')
	gCtx = gCanvas.getContext('2d')

	// set static text properties
	gCtx.lineWidth = 6
	gCtx.shadowOffsetX = 3
	gCtx.shadowOffsetY = 3
	gCtx.shadowBlur = 7

	renderMeme()
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
			gCtx.fillStyle = line.fillColor
			gCtx.strokeStyle = gCtx.shadowColor = line.strokeColor

			renderTextLine(line.txt, line.pos.x, line.pos.y)
		})
	}
}

function renderTextLine(txt, x, y) {
	gCtx.strokeText(txt, x, y)
	gCtx.fillText(txt, x, y)
}

function onLineInput(txt) {
	setLineTxt(txt)
	renderMeme()
}
