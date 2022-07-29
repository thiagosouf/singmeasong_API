export function recommendationVideoFactory() {
	const video = {
		name:"Falamansa - Rindo a Toa",youtubeLink:"https://www.youtube.com/watch?v=iuwAZ-x1sAo"
	}

	return video
}

export function recommendationResponseFactory(score: number) {
	return {
        id: 5,
		name:"Deixa Acontecer / Coração Radiante / Compasso Do Amor",
        youtubeLink:"https://www.youtube.com/watch?v=c4XeTP11EI8",
        score ,
	}
} 