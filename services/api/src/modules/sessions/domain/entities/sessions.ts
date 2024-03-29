import { Currencies, EmbeddedUser, Prescription, SessionCancelled, SessionStatus } from '../types'
import { BaseEntity } from 'equipped'
import { generateDefaultUser } from '@modules/users'

export class SessionEntity extends BaseEntity {
	public readonly id: string
	public readonly doctor: EmbeddedUser | null
	public readonly patient: EmbeddedUser
	public readonly description: string
	public readonly status: SessionStatus
	public readonly note: string
	public readonly prescriptions: Prescription[]
	public readonly price: number
	public readonly currency: Currencies
	public readonly paid: boolean
	public readonly ratings: Record<string, string>
	public readonly cancelled: SessionCancelled | null
	public readonly startedAt: number | null
	public readonly closedAt: number | null
	public readonly createdAt: number
	public readonly updatedAt: number

	ignoreInJSON = ['doctor.bio.email', 'patient.bio.email']

	constructor ({
		id, doctor, patient, prescriptions, note,
		description, price, currency, paid, status, ratings,
		cancelled, startedAt, closedAt, createdAt, updatedAt
	}: SessionConstructorArgs) {
		super()
		this.id = id
		this.doctor = doctor ? generateDefaultUser(doctor) : null
		this.patient = generateDefaultUser(patient)
		this.prescriptions = prescriptions
		this.note = note
		this.description = description
		this.price = price
		this.currency = currency
		this.paid = paid
		this.status = status
		this.ratings = ratings
		this.cancelled = cancelled
		this.startedAt = startedAt
		this.closedAt = closedAt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	getParticipants () {
		const participants = [this.patient.id]
		if (this.doctor) participants.push(this.doctor.id)
		return participants
	}

	isOngoing () {
		return this.status === SessionStatus.ongoing
	}

	canReport (userId: string) {
		if (this.patient.id !== userId) return false
		return !!this.doctor
	}
}

type SessionConstructorArgs = {
	id: string
	doctor: EmbeddedUser | null
	patient: EmbeddedUser
	description: string
	status: SessionStatus
	prescriptions: Prescription[]
	note: string
	price: number
	currency: Currencies
	paid: boolean
	ratings: Record<string, string>
	cancelled: SessionCancelled | null
	startedAt: number | null
	closedAt: number | null
	createdAt: number
	updatedAt: number
}