import { recommendationService } from '../src/services/recommendationsService.js';
import { recommendationRepository } from '../src/repositories/recommendationRepository.js';

jest.mock("./../src/repositories/recommendationRepository.js")

describe('recommendationService/Insert', () => {
    it('Inserir recomendação', async () => {
    const value = {
        name: "Falamansa - Xote dos Milagres",
        youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    }
    

    expect(recommendationService.insert(value)).toEqual(200)
    })
})