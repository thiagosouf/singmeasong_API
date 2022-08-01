import { jest } from '@jest/globals'
import { recommendationService } from '../../src/services/recommendationsService.js'
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js'
import { recommendationVideoFactory, recommendationResponseFactory } from '../factories/recommendationFactory.js'



describe('Testes Unit recomendacao', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})

	it('criando recomendacao', async () => {
		const recommendation = recommendationVideoFactory()

		jest
			.spyOn(recommendationRepository, 'findByName')
			.mockImplementationOnce((): any => {})

		jest
			.spyOn(recommendationRepository, 'create')
			.mockImplementationOnce(():any => {})

			await recommendationService.insert(recommendation)

		expect(recommendationRepository.create).toBeCalled()
	})

	it('criando recomendacao duplicada', () => {
		const recommendation = recommendationVideoFactory()
		const recommendationResponse = recommendationResponseFactory(36)

		jest
			.spyOn(recommendationRepository, 'findByName')
			.mockResolvedValue(recommendationResponse)

		const create = jest.spyOn(recommendationRepository, 'create')

		expect(async () => {
			await recommendationService.insert(recommendation)
		}).rejects.toEqual({
			type: 'conflict',
			message: 'Recommendations names must be unique',
		})

		expect(create).not.toBeCalled()
	})

	it('removendo vote menor que -5', async () => {
		const recommendationResponse = recommendationResponseFactory(-5)

		jest
			.spyOn(recommendationRepository, 'find')
			.mockResolvedValue(recommendationResponse)

		jest
			.spyOn(recommendationRepository, 'updateScore')
			.mockResolvedValue({ ...recommendationResponse, score: -6 })

		const removeRecommendation = jest
			.spyOn(recommendationRepository, 'remove')
			.mockResolvedValue(null)

		await recommendationService.downvote(1)

		expect(removeRecommendation).toBeCalledWith(1)
		expect(removeRecommendation).toBeCalledTimes(1)
	})

	it('upvote na recomendacao', async () =>{
		const recommendation = recommendationVideoFactory()
		const recommendationResponse = recommendationResponseFactory(1)

		jest
			.spyOn(recommendationRepository, 'find')
			.mockImplementationOnce(():any => recommendationResponse)

		jest
			.spyOn(recommendationRepository, 'updateScore')
			.mockResolvedValue(null)

		await recommendationService.upvote(recommendationResponse.id)

		expect(recommendationRepository.find).toBeCalled()
    	expect(recommendationRepository.updateScore).toBeCalled()
	})

	it('Erro Id nao encontrado', () => {
		jest.spyOn(recommendationRepository, 'find').mockResolvedValue(null)

		expect(async () => {
			await recommendationService.upvote(1)
		}).rejects.toEqual({ type: 'not_found', message: '' })
	})

	it('Encontrar todas as recomendacoes', async ()=>{
		jest
		.spyOn(recommendationRepository, 'findAll')
		.mockImplementationOnce((): any => { })

		await recommendationService.get()

		expect(recommendationRepository.findAll).toBeCalled()
	})

	it('Erro não existe recomendacao', async () => {
		jest
			.spyOn(recommendationRepository, 'findAll')
			.mockResolvedValue([])

		expect(async () => {
			await recommendationService.getRandom()
		}).rejects.toEqual({ type: 'not_found', message: '' })
	})

	it('Buscar os top das recomendacoes', async () => {
		const amount = 10
	
		jest
			.spyOn(recommendationRepository, 'getAmountByScore')
		  	.mockImplementationOnce((): any => { })
	
		await recommendationService.getTop(amount)
	
		expect(recommendationRepository.getAmountByScore).toBeCalled()
	  })

	it("Retornar o 'lte' dos 0.7 do random", () => {
		expect(recommendationService.getScoreFilter(0.7)).toEqual('lte')
	})

	it("Retornar o 'gt' dos 0.3 do random", async () => {
		const recommendationResponse = recommendationResponseFactory(5)

		jest
			.spyOn(recommendationRepository, 'findAll')
			.mockResolvedValue([recommendationResponse])

		const findRecommendations = await recommendationService.getByScore('gt')

		expect(findRecommendations).toEqual([recommendationResponse])
	})
})