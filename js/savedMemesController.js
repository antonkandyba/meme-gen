'use strict'

const SAVED_MEMES_KEY = 'savedMemesDB'
var gSavedMemes = []

function saveMeme(meme) {
	meme.imgSrc = gCanvas.toDataURL('image/jpeg')
	meme.id = _makeid()
	if (!getSavedMeme(meme.id)) gSavedMemes.push(meme)
	localStorage.setItem(SAVED_MEMES_KEY, JSON.stringify(gSavedMemes))
}

function getSavedMemes() {
	return gSavedMemes
}

function getSavedMeme(id) {
	return gSavedMemes.find((meme) => meme.id === id)
}

function loadSavedMemes() {
	gSavedMemes = []
	const memes = JSON.parse(localStorage.getItem(SAVED_MEMES_KEY))
	if (!memes || memes.length === 0) return null
	gSavedMemes = memes
	return memes
}

function _makeid(length = 6) {
	let text = ''
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length))
	}

	return text
}
