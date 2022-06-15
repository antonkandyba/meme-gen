'use strict'

const gCanvas = document.querySelector('.meme-canvas')
const gCtx = gCanvas.getContext('2d')

function renderMeme() {
	const img = new Image()
	img.src = 'img/5.jpg'
	// render image when it's ready
	img.onload = () => {
		gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)

		renderTextLine('hello', gCanvas.width / 2, 50)
	}
}

function renderTextLine(txt, x, y) {
	gCtx.font = '48px roboto-regular'
	gCtx.textAlign = 'center'
	gCtx.lineWidth = 7
	gCtx.fillStyle = 'white'
	gCtx.shadowOffsetX = 3
	gCtx.shadowOffsetY = 3
	gCtx.shadowBlur = 7
	gCtx.shadowColor = 'black'

	gCtx.strokeText(txt, x, y)
	gCtx.fillText(txt, x, y)
}
