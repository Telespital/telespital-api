import { ChangeStreamCallbacks } from '@stranerd/api-commons'
import { UserEntity, UserFromModel } from '@modules/users'
import { getSocketEmitter } from '@index'
import { ReviewsUseCases, SessionsUseCases } from '@modules/sessions'

export const UserChangeStreamCallbacks: ChangeStreamCallbacks<UserFromModel, UserEntity> = {
	created: async ({ after }) => {
		await getSocketEmitter().emitCreated('users/users', after)
		await getSocketEmitter().emitCreated(`users/users/${after.id}`, after)
	},
	updated: async ({ after, changes }) => {
		await getSocketEmitter().emitUpdated('users/users', after)
		await getSocketEmitter().emitUpdated(`users/users/${after.id}`, after)
		const updatedBioOrRoles = !!changes.bio || !!changes.roles
		if (updatedBioOrRoles) await Promise.all([
			SessionsUseCases, ReviewsUseCases
		].map(async (useCase) => await useCase.updateUserBio(after.getEmbedded())))
	},
	deleted: async ({ before }) => {
		await getSocketEmitter().emitDeleted('users/users', before)
		await getSocketEmitter().emitDeleted(`users/users/${before.id}`, before)
	}
}
