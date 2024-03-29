import { appInstance } from '@utils/environment'
import { QueryParams } from 'equipped'
import { IPayoutRepository } from '../../domain/irepositories/payouts'
import { EmbeddedUser, PayoutPay, PayoutStatus, TransactionStatus, TransactionType } from '../../domain/types'
import { PayoutMapper } from '../mappers/payouts'
import { TransactionToModel } from '../models/transactions'
import { Payout } from '../mongooseModels/payouts'
import { Transaction } from '../mongooseModels/transactions'
import { Wallet } from '../mongooseModels/wallets'

export class PayoutRepository implements IPayoutRepository {
	private static instance: PayoutRepository
	private mapper: PayoutMapper

	private constructor () {
		this.mapper = new PayoutMapper()
	}

	static getInstance () {
		if (!PayoutRepository.instance) PayoutRepository.instance = new PayoutRepository()
		return PayoutRepository.instance
	}

	async get (query: QueryParams) {
		const data = await appInstance.dbs.mongo.query(Payout, query)

		return {
			...data,
			results: data.results.map((r) => this.mapper.mapFrom(r)!)
		}
	}

	async find (id: string) {
		const payout = await Payout.findById(id)
		return this.mapper.mapFrom(payout)
	}

	async create (userId: string, users: EmbeddedUser[]) {
		let res = null as any
		await Transaction.collection.conn.transaction(async (session) => {
			const _id = appInstance.dbs.mongo.Id.toString()
			const transactionModels: TransactionToModel[] = []
			const userDataPromise: Promise<[string, PayoutPay[string]]>[] = users.map(async (user) => {
				const wallet = await Wallet.findOneAndUpdate(
					{ userId: user.id, 'balance.amount': { $gt: 0 } },
					{ $set: { 'balance.amount': 0 } },
					{ new: false, session })
				// dont include user if no wallet or wallet balance is 0
				if (!wallet?.balance.amount) return null as any
				const balance = wallet.balance
				transactionModels.push({
					...balance, title: 'Payout generated',
					userId: user.id, email: user.bio.email,
					status: TransactionStatus.settled,
					data: { payoutId: _id, type: TransactionType.NewPayout }
				})
				return [userId, { ...balance }]
			})
			const userData = (await Promise.all(userDataPromise)).filter((d) => !!d)
			const pay = Object.fromEntries(userData)
			res = await new Payout({ _id, userId, pay, status: PayoutStatus.created }).save({ session })
			await Transaction.insertMany(transactionModels, { session })
			return res
		})
		return this.mapper.mapFrom(res)!
	}

	async settle (id: string, userId: string) {
		const settlement = { userId, at: Date.now() }
		const payout = await Payout.findOneAndUpdate(
			{ _id: id, settlement: null },
			{ $set: { settlement, status: PayoutStatus.settled } },
			{ new: true })
		return this.mapper.mapFrom(payout)
	}
}
