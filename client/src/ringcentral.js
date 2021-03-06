import * as RingCentral from '@ringcentral/sdk'
import { Subscriptions } from '@ringcentral/subscriptions'

export let sdk
export let platform
export let subscriptions

const defaultLogger = ({ source, event, data }) => {
	console.log(`Received ${source} event ${event}`)
	console.log(JSON.stringify(data, null, 2))
}

let _platformEventListener
let _subscriptionEventListener

export const setup = ({ serverUrl, clientId, clientSecret, platformEventListener = defaultLogger, subscriptionEventListener = defaultLogger }) => {
	sdk = new RingCentral.SDK({
		server: serverUrl,
		clientId,
		clientSecret,
		redirectUri: `${window.location.origin}/redirect.html`,
	})
	_platformEventListener = platformEventListener
	_subscriptionEventListener = subscriptionEventListener
	platform = sdk.platform()
	subscriptions = new Subscriptions({ sdk })
	platform.on(platform.events.loginSuccess, (data) => _platformEventListener({ source: platform, event: platform.events.loginSuccess, data, className: 'success' }))
	platform.on(platform.events.loginError, (data) => _platformEventListener({ source: platform, event: platform.events.loginError, data, className: 'error' }))
	platform.on(platform.events.logoutSuccess, (data) => _platformEventListener({ source: platform, event: platform.events.logoutSuccess, data, className: 'success' }))
	platform.on(platform.events.logoutError, (data) => _platformEventListener({ source: platform, event: platform.events.logoutError, data, className: 'error' }))
	platform.on(platform.events.refreshSuccess, (data) => _platformEventListener({ source: platform, event: platform.events.refreshSuccess, data, className: 'success' }))
	platform.on(platform.events.refreshError, (data) => _platformEventListener({ source: platform, event: platform.events.refreshError, data, className: 'error' }))
}

export const login = async ({ type, username, password, extension }) => {
	let tokenResponse
	if (type === 'oauth') {
		const codeResponse = await platform.loginWindow({ url: platform.loginUrl({ implicit: false, usePKCE: true }) })
		tokenResponse = await platform.login(codeResponse)
	} else {
		tokenResponse = await platform.login({ username, password, extension })
	}
	const token = await tokenResponse.json()
	return token
}

export const setToken = (token) => platform.login(token)

export const logout = () => platform.logout()

export const createSubscription = async (data) => new Subscription(platform, subscriptions).create(data)

export const removeSubscription = async (subscription, id) => new Subscription(platform, subscriptions).delete(subscription, id)

export const listSubscriptions = async () => new Subscription(platform, subscriptions).list()

export const getSubscription = async (id) => new Subscription(platform, subscriptions).get(id)

export const updateSubscription = async (subscription, id, data) => new Subscription(platform, subscriptions).update(subscription, id, data)

export const registerSubscriptionEvents = (subscription) => {
	const options = { source: subscription, subscriptionId: subscription.subscription().id }
	subscription.on(subscription.events.notification, (data) => _subscriptionEventListener(Object.assign({}, options, { event: subscription.events.notification, data, className: 'success' })))
	subscription.on(subscription.events.removeSuccess, (data) => _subscriptionEventListener(Object.assign({}, options, { event: subscription.events.removeSuccess, data, className: 'success' })))
	subscription.on(subscription.events.removeError, (data) => _subscriptionEventListener(Object.assign({}, options, { event: subscription.events.removeError, data, className: 'error' })))
	subscription.on(subscription.events.renewSuccess, (data) => _subscriptionEventListener(Object.assign({}, options, { event: subscription.events.renewSuccess, data, className: 'success' })))
	subscription.on(subscription.events.renewError, (data) => _subscriptionEventListener(Object.assign({}, options, { event: subscription.events.renewError, data, className: 'error' })))
	subscription.on(subscription.events.subscribeSuccess, (data) => _subscriptionEventListener(Object.assign({}, options, { event: subscription.events.subscribeSuccess, data, className: 'success' })))
	subscription.on(subscription.events.subscribeError, (data) => _subscriptionEventListener(Object.assign({}, options, { event: subscription.events.subscribeError, data, className: 'error' })))
}

class Subscription {
	constructor(platform, subscriptions) {
		this.platform = platform
		this.subscriptions = subscriptions
		this.webhook = new WebHook(platform, subscriptions)
		this.pubnub = new PubNub(platform, subscriptions)
	}
	getInstance(transport) {
		return transport === 'WebHook' ? this.webhook : this.pubnub
	}
	async create(data) {
		return this.getInstance(data.deliveryMode.transportType).create(data)
	}
	async list() {
		const response = await this.platform.get('/restapi/v1.0/subscription')
		return response.json()
	}
	async get(id) {
		const response = await platform.get(`/restapi/v1.0/subscription/${id}`)
		return response.json()
	}
	async update(subscription, id, data) {
		if (!subscription) {
			const response = await this.platform.get(`/restapi/v1.0/subscription/${id}`)
			subscription = await response.json()
		}
		return this.getInstance(subscription.deliveryMode.transportType).update(subscription, data)
	}
	async delete(subscription, id) {
		if (!subscription) {
			const response = await this.platform.get(`/restapi/v1.0/subscription/${id}`)
			subscription = await response.json()
		}
		return this.getInstance(subscription.deliveryMode.transportType).delete(subscription)
	}
}

class PubNub {
	constructor(platform, subscriptions) {
		this.platform = platform
		this.subscriptions = subscriptions
	}
	async create(data) {
		const subscription = this.subscriptions.createSubscription()
		await subscription.setEventFilters(data.eventFilters).register()
		registerSubscriptionEvents(subscription)
		return subscription.subscription()
	}
	async update(subscriptionData, data) {
		const subscription = this.subscriptions.createSubscription()
		subscription.setSubscription(subscriptionData)
		await subscription.setEventFilters(data.eventFilters).register()
		return subscription.subscription()
	}
	async delete(subscriptionData) {
		const subscription = this.subscriptions.createSubscription()
		subscription.setSubscription(subscriptionData)
		await subscription.remove()
	}
}

class WebHook {
	constructor(platform, subscriptions) {
		this.platform = platform
		this.subscriptions = subscriptions
	}
	async create(data) {
		const response = await this.platform.post('/restapi/v1.0/subscription', data)
		const subscription = await response.json()
		return subscription
	}
	async update(subscriptionData, data) {
		const body = { eventFilters: data.eventFilters, expiresIn: data.expiresIn }
		const response = await this.platform.put(`/restapi/v1.0/subscription/${subscriptionData.id}`, body)
		const subscription = await response.json()
		return subscription
	}
	async delete(subscriptionData) {
		await this.platform.delete(`/restapi/v1.0/subscription/${subscriptionData.id}`)
	}
}
