'use strict'

const gCanvas = document.querySelector('.meme-canvas')
const gCtx = gCanvas.getContext('2d')

function renderMeme() {
	const meme = getMeme()
	const img = new Image()
	img.src = `img/${meme.selectedImgId}.jpg`
	// render image when it's ready
	img.onload = () => {
		gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)

		meme.lines.forEach((line) => {
			const txt = line.txt
			gCtx.font = `${line.size}px roboto-regular`
			gCtx.textAlign = line.align
			gCtx.fillStyle = line.fillColor
			gCtx.strokeStyle = gCtx.shadowColor = line.strokeColor

			renderTextLine(line.txt, line.pos.x, line.pos.y)
		})
	}
}

function renderTextLine(txt, x, y) {
	gCtx.lineWidth = 7
	gCtx.shadowOffsetX = 3
	gCtx.shadowOffsetY = 3
	gCtx.shadowBlur = 7

	gCtx.strokeText(txt, x, y)
	gCtx.fillText(txt, x, y)
}
