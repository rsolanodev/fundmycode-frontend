<template>
    <layout name="LayoutRestore">
        <div class="restore-password">
            <div class="title is-3 has-text-centered mb-3 mt-1">
                Restore password
            </div>
            <div class="subtitle is-6">
                Enter the new password for your account.
            </div>
            <hr />
            <div
                    class="box-auth has-text-weight-bold"
                    style="border-bottom: 0;"
            >
                <label>
                    Password
                    <input
                            class="input"
                            type="password"
                            v-model="password"
                    />
                </label>
            </div>
            <div
                    class="box-auth has-text-weight-bold"
                    style="border-bottom: 0;"
            >
                <label>
                    Repeat password
                    <input
                            class="input"
                            type="password"
                            v-model="repeat_password"
                    />
                </label>
            </div>
            <button
                    type="submit"
                    class="button is-primary is-fullwidth mb-2"
                    @click="resetPassword"
            >
                Change Password
            </button>
        </div>
    </layout>
</template>

<script>
    import Layout from "../../layouts/index";
    import { RepositoryFactory } from "../../api/RepositoryFactory";

    const RestoreRepository = RepositoryFactory.get("restore_password");

    export default {
        name: "RestorePassword",
        components: {
            Layout,
        },
        data() {
            return {
                password: "",
                repeat_password: ""
            };
        },
        methods: {
            async resetPassword() {
                let payload = {
                    "password": this.password,
                    "repeat_password": this.repeat_password,
                    "restore_password_code": this.$route.params.restore_password_code
                };
                await RestoreRepository.restore(payload).then(() => {
                    this.$buefy.toast.open({
                        message: `The password has been successfully changed`,
                        type: "is-success",
                        position: "is-bottom",
                    });
                    this.$router.push('/login');
                }, () => {
                    this.$buefy.toast.open({
                        message: `Error when trying to change password`,
                        type: "is-danger",
                        position: "is-bottom",
                    });
                })
            },
        },
    };
</script>

<style scoped>
    .restore-password {
        max-width: 25vw;
    }

    .box-auth {
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
    }
</style>
