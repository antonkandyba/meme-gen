'use strict'

const gImgs = [
	{ id: 1, url: 'img/1.jpg' },
	{ id: 2, url: 'img/2.jpg' },
	{ id: 3, url: 'img/3.jpg' },
	{ id: 4, url: 'img/4.jpg' },
	{ id: 5, url: 'img/5.jpg' },
	{ id: 6, url: 'img/6.jpg' },
	{ id: 7, url: 'img/7.jpg' },
	{ id: 8, url: 'img/8.jpg' },
	{ id: 9, url: 'img/9.jpg' },
	{ id: 10, url: 'img/10.jpg' },
	{ id: 11, url: 'img/11.jpg' },
	{ id: 12, url: 'img/12.jpg' },
	{ id: 13, url: 'img/13.jpg' },
	{ id: 14, url: 'img/14.jpg' },
	{ id: 15, url: 'img/15.jpg' },
	{ id: 16, url: 'img/16.jpg' },
	{ id: 17, url: 'img/17.jpg' },
	{ id: 18, url: 'img/18.jpg' },
	{ id: 19, url: 'img/19.jpg' },
	{ id: 20, url: 'img/20.jpg' },
	{ id: 21, url: 'img/21.jpg' },
	{ id: 22, url: 'img/22.jpg' },
	{ id: 23, url: 'img/23.jpg' },
	{ id: 24, url: 'img/24.jpg' },
]

function onInit(showSaved = false) {
	let imgsHTML = ''
	loadSavedMemes()
	if (showSaved) {
		const savedMemes = getSavedMemes()
		if (!savedMemes) return
		savedMemes.forEach((meme) => {
			imgsHTML += `<img src="${meme.imgSrc}" onclick="onClickSavedMeme('${meme.id}')"/>`
		})
	} else {
		gImgs.forEach((img) => {
			imgsHTML += `<img src="${img.url}" onclick="onClickGalleryImg(${img.id})"/>`
		})
	}

	document.querySelector('.gallery-grid').innerHTML = imgsHTML

	document.querySelector('.hamburger-btn').innerText = '\uf0c9'
}

function onClickGalleryImg(imgId) {
	setMemeImg(imgId)
	renderMemeEditor()
}

function onClickSavedMeme(id) {
	const meme = getSavedMeme(id)
	setMeme(meme)
	renderMemeEditor(true)
}

function renderMemeEditor(savedImage = false) {
	document.body.classList.add('editor-open')
	initEditor(savedImage)
}

function onGoToGallery(showSaved = false) {
	onInit(showSaved)
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
