import Repository from "../Repository";

const resource = "/users";

export default {
    me() {
        return Repository.get(`${resource}/me/`)
    },
    createUser(payload) {
        return Repository.post(`${resource}/`, payload);
    },
    checkEmail(email) {
        return Repository.get(`${resource}/exists/?email=${email}`)
    },
    checkVerify(email) {
        return Repository.get(`${resource}/verified/?email=${email}`)
    },
    updateUser(payload) {
        return Repository.patch(`${resource}/me/`, payload);
    },
    createDeveloper(payload, pk) {
        return Repository.patch(`${resource}/${pk}/developer/`, payload);
    },
}
