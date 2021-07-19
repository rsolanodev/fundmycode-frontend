<template>
    <component id="app" :is="layout">
        <router-view :layout.sync="layout" :shared="shared" />
    </component>
</template>

<script>
    export default {
        name: "app",
        data() {
            return {
                layout: 'div',
                shared: {
                    getEmail: '',
                }
            };
        },
        computed: {
            isLoggedIn: function () {
                return this.$store.getters.isLoggedIn
            }
        },
        created: function () {
            this.$http.interceptors.response.use(undefined, function (err) {
                // eslint-disable-next-line no-unused-vars
                return new Promise(function (resolve, reject) {
                    if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
                        this.$store.dispatch('logout')
                    }
                    throw err;
                });
            });

            if (this.isLoggedIn) this.$store.dispatch('getUser');
        },
    };
</script>

<style lang="scss">
    @import "assets/style";
</style>
