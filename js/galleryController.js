'use strict'

function onInit() {
	let imgsHTML = ''
	for (let i = 1; i <= 18; i++) {
		imgsHTML += `<img src="img/${i}.jpg" onclick="onClickGalleryImg(${i})"/>`
	}

	document.querySelector('.gallery-grid').innerHTML = imgsHTML
}

function onClickGalleryImg(imgId) {
	setMemeImg(imgId)
	renderMemeEditor()
}

function renderMemeEditor() {
	initEditor()
	document.body.classList.add('editor-open')
}
