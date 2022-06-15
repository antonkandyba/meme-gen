'use strict'

const gCanvas = document.querySelector('.meme-canvas')
const gCtx = gCanvas.getContext('2d')

function renderMeme() {
	const img = new Image()
	img.src = '/img/5.jpg'

	// gCtx.fillRect(100, 100, 100, 100)
	// gCtx.drawImage(img, 0, 0, 500, 500)
	img.onload = () => {
		gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
	}
}
