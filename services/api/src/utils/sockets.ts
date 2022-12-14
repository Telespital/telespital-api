import { OnJoinFn } from '@stranerd/api-commons'
import { getSocketEmitter } from '@index'

export const registerSockets = () => {
	const isMine: OnJoinFn = async ({ channel, user }) => user ? `${channel}/${user.id}` : null
	const isOpen: OnJoinFn = async ({ channel }) => channel

	getSocketEmitter().register('notifications/notifications', isMine)
	getSocketEmitter().register('payment/methods', isMine)
	getSocketEmitter().register('payment/transactions', isMine)
	getSocketEmitter().register('payment/wallets', isMine)
	getSocketEmitter().register('users/users', isOpen)
	getSocketEmitter().register('users/orders', isMine)
	getSocketEmitter().register('sessions/sessions', isMine)
	getSocketEmitter().register('sessions/reviews', isOpen)
}