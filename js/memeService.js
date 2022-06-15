'use strict'

var gMeme = {
	selectedImgId: 5,
	selectedLineIdx: 0,
	lines: [
		{
			pos: { x: 250, y: 50 },
			txt: 'Hello World',
			size: 48,
			align: 'center',
			fillColor: 'white',
			strokeColor: 'black',
		},
		{
			pos: { x: 250, y: 480 },
			txt: 'Goodbye World',
			size: 48,
			align: 'center',
			fillColor: 'white',
			strokeColor: 'black',
		},
	],
}

function getMeme() {
	return gMeme
}
