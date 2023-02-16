import { OrderEntity, OrderFromModel } from '@modules/users'
import { appInstance } from '@utils/environment'
import { ChangeStreamCallbacks } from 'equipped'

export const OrderChangeStreamCallbacks: ChangeStreamCallbacks<OrderFromModel, OrderEntity> = {
	created: async ({ after }) => {
		await appInstance.listener.created('users/orders', after)
		await appInstance.listener.created(`users/orders/${after.id}`, after)
	},
	updated: async ({ after }) => {
		await appInstance.listener.updated('users/orders', after)
		await appInstance.listener.updated(`users/orders/${after.id}`, after)
	},
	deleted: async ({ before }) => {
		await appInstance.listener.deleted('users/orders', before)
		await appInstance.listener.deleted(`users/orders/${before.id}`, before)
	}
}
