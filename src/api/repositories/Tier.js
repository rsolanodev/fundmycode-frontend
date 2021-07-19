import Repository from "../Repository";

const resource = "/tiers";

export default {
    getTiers(pk) {
        return Repository.get(`${resource}/?user=${pk}`)
    },
    getTier(pk) {
        return Repository.get(`${resource}/${pk}/`);
    },
    updateTier(payload, pk) {
        return Repository.patch(`${resource}/${pk}/`, payload);
    },
    createTier(payload) {
        return Repository.post(`${resource}/`, payload);
    },
    delete(pk) {
        return Repository.delete(`${resource}/${pk}/`);
    },
}
