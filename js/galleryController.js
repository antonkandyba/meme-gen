'use strict'

function onInit() {
	let imgsHTML = ''
	for (let i = 1; i <= 24; i++) {
		imgsHTML += `<img src="img/${i}.jpg" onclick="onClickGalleryImg(${i})"/>`
	}

	document.querySelector('.gallery-grid').innerHTML = imgsHTML

	document.querySelector('.hamburger-btn').innerText = '\uf0c9'
}

function onClickGalleryImg(imgId) {
	setMemeImg(imgId)
	renderMemeEditor()
}

function renderMemeEditor() {
	document.body.classList.add('editor-open')
}

function onGoToGallery() {
	document.body.classList.remove('editor-open')
	document.body.classList.remove('menu-open')

	document.querySelector('.hamburger-btn').innerText = '\uf0c9'
}

function onHamburger() {
	document.body.classList.toggle('menu-open')

	// switch between hamburger and X to close
	const elHamburger = document.querySelector('.hamburger-btn')
	elHamburger.innerText = elHamburger.innerText === '\uf0c9' ? '\uf00d' : '\uf0c9'
}
