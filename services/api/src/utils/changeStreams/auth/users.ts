import { AuthUserEntity, UserFromModel } from '@modules/auth'
import { UsersUseCases } from '@modules/users'
import { publishers } from '@utils/events'
import { DbChangeCallbacks } from 'equipped'

export const UserDbChangeCallbacks: DbChangeCallbacks<UserFromModel, AuthUserEntity> = {
	created: async ({ after }) => {
		await UsersUseCases.createUserWithBio({
			id: after.id,
			data: {
				type: after.type,
				name: after.allNames,
				email: after.email,
				phone: after.phone,
				photo: after.photo,
				data: after.data
			},
			timestamp: after.signedUpAt
		})
		await UsersUseCases.updateUserWithRoles({
			id: after.id,
			data: after.roles,
			timestamp: Date.now()
		})
	},
	updated: async ({ before, after, changes }) => {
		if (changes.photo && before.photo) await publishers.DELETEFILE.publish(before.photo)

		const updatedBio = AuthUserEntity.bioKeys().some((key) => changes[key])
		if (updatedBio) await UsersUseCases.updateUserWithBio({
			id: after.id,
			data: {
				type: after.type,
				name: after.allNames,
				email: after.email,
				phone: after.phone,
				photo: after.photo,
				data: after.data
			},
			timestamp: Date.now()
		})

		const updatedRoles = changes.roles
		if (updatedRoles) await UsersUseCases.updateUserWithRoles({
			id: after.id,
			data: after.roles,
			timestamp: Date.now()
		})
	},
	deleted: async ({ before }) => {
		await UsersUseCases.markUserAsDeleted({ id: before.id, timestamp: Date.now() })
		if (before.photo) await publishers.DELETEFILE.publish(before.photo)
	}
}