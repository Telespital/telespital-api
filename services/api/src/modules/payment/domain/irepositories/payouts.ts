import { QueryParams, QueryResults } from 'equipped'
import { PayoutEntity } from '../entities/payouts'
import { EmbeddedUser } from '../types'

export interface IPayoutRepository {
	get: (query: QueryParams) => Promise<QueryResults<PayoutEntity>>
	find: (id: string) => Promise<PayoutEntity | null>
	create: (userId: string, users: EmbeddedUser[]) => Promise<PayoutEntity>
	settle: (id: string, userId: string) => Promise<PayoutEntity | null>
}
