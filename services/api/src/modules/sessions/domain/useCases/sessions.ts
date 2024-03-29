import { ISessionRepository } from '../irepositories/sessions'
import { SessionToModel } from '../../data/models/sessions'
import { QueryParams } from 'equipped'
import { EmbeddedUser } from '../types'
import { ReviewToModel } from '../../data/models/reviews'

export class SessionsUseCase {
	private repository: ISessionRepository

	constructor (repository: ISessionRepository) {
		this.repository = repository
	}

	async add (data: SessionToModel) {
		return await this.repository.add(data)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async connect (user: EmbeddedUser) {
		return await this.repository.connect(user)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async update (data: { id: string, userId: string, data: Partial<SessionToModel>, byDoctor: boolean }) {
		return await this.repository.update(data.id, data.userId, data.data, data.byDoctor)
	}

	async updateUserBio (user: EmbeddedUser) {
		return await this.repository.updateUserBio(user)
	}

	async updatePaid (data: { id: string, add: boolean }) {
		return await this.repository.updatePaid(data.id, data.add)
	}

	async close (data: { id: string, doctorId: string }) {
		return await this.repository.close(data.id, data.doctorId)
	}

	async cancel (data: { id: string, userId: string, reason: string }) {
		return await this.repository.cancel(data.id, data.userId, data.reason)
	}

	async rate (data: Omit<ReviewToModel, 'to'>) {
		return await this.repository.rate(data)
	}
}
