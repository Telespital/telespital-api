import { appInstance } from '@utils/environment'
import { IOrderRepository } from '../../domain/irepositories/orders'
import { OrderMapper } from '../mappers/orders'
import { OrderToModel } from '../models/orders'
import { Order } from '../mongooseModels/orders'

export class OrderRepository implements IOrderRepository {
	private static instance: OrderRepository
	private mapper = new OrderMapper()

	static getInstance (): OrderRepository {
		if (!OrderRepository.instance) OrderRepository.instance = new OrderRepository()
		return OrderRepository.instance
	}

	async get (query) {
		const data = await appInstance.dbs.mongo.query(Order, query)
		return {
			...data,
			results: data.results.map((u) => this.mapper.mapFrom(u)!)
		}
	}

	async add (data: OrderToModel) {
		const order = await Order.findOneAndUpdate(
			{ userId: data.userId, paid: false },
			{ $set: data },
			{ upsert: true, new: true }
		)
		return this.mapper.mapFrom(order)!
	}

	async find (orderId: string) {
		const order = await Order.findById(orderId)
		return this.mapper.mapFrom(order)
	}

	async updatePaid (id: string, paid: boolean) {
		const order = await Order.findByIdAndUpdate(id, { $set: { paid } })
		return !!order
	}
}