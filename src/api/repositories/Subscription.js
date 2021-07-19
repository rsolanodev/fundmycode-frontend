import Repository from "../Repository";

const resource = "/subscriptions";

export default {
    getSubscribers(pk) {
        return Repository.get(`${resource}/?developer=${pk}`)
    },
    getSupporting(pk) {
        return Repository.get(`${resource}/?user=${pk}`)
    },
    unsubscribe(pk) {
        return Repository.post(`${resource}/${pk}/cancel/`)
    }
}
