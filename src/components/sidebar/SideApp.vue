<template>
    <div class="side-auth card small-shadow">
        <div class="media p-1">
            <figure class="media-left">
                <div class="image is-48x48">
                    <img v-if="userDetails.picture" :src="userDetails.picture" class="small-rounded" alt="user picture">
                    <img v-else :src="default_picture" class="small-rounded" alt="default user picture">
                </div>
            </figure>
            <div class="media-content">
                <div class="title is-6">Welcome {{ userDetails.first_name }}</div>
                <div class="subtitle is-6" v-if="userDetails.is_developer">Developer</div>
                <div class="subtitle is-6" v-else>Contributor</div>
            </div>
        </div>
        <hr>
        <div class="py-3">
            <ul>
                <router-link tag="li" active-class="is-active" to="/feed">
                    <span class="icon is-small">
                        <img src="../../assets/icons/home.svg" alt="home">
                    </span>
                    <span>Home</span>
                </router-link>
                <router-link tag="li" active-class="is-active" to="/profile" v-if="userDetails.is_developer">
                    <span class="icon is-small">
                        <img src="../../assets/icons/profile.svg" alt="profile">
                    </span>
                    <span>My profile</span>
                </router-link>
                <router-link tag="li" active-class="is-active" to="/explore">
                    <span class="icon is-small">
                        <img src="../../assets/icons/explore.svg" alt="explore">
                    </span>
                    <span>Explore</span>
                </router-link>
                <router-link tag="li" active-class="is-active" to="/memberships">
                    <span class="icon is-small">
                        <img src="../../assets/icons/membership.svg" alt="membership">
                    </span>
                    <span>Memberships</span>
                </router-link>
                <router-link tag="li" active-class="is-active" to="/settings/profile">
                    <span class="icon is-small">
                        <img src="../../assets/icons/settings.svg" alt="settings">
                    </span>
                    <span>Settings</span>
                </router-link>
                <router-link tag="li" active-class="is-active" to="/developer/create" v-if="!userDetails.is_developer">
                    <span class="icon is-small">
                        <img src="../../assets/icons/developer.svg" alt="developer">
                    </span>
                    <span>Be developer</span>
                </router-link>
            </ul>
        </div>
        <hr>
        <div class="logout" @click="logout">
            <span>Log out</span>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import constants from "../../constants";

    export default {
        name: "SideAuth",
        data() {
            return {
                first_name: null,
                picture: null,
                is_developer: false,
                default_picture: constants.DEFAULT_USER_PICTURE
            }
        },
        computed: {
            ...mapGetters({
                userDetails: "myUser",
            })
        },
        methods: {
            logout() {
                this.$store.dispatch('logout')
                    .then(() => {
                        this.$router.push('/login');
                    })
            },
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/style';

    .side-auth {
        position: sticky;
        top: 7.5em;
    }

    .icon {
        margin-right: 1.25em;
    }

    li {
        padding: 0 2em;
        margin: 1.875em 0;
        opacity: .65;
        cursor: pointer;

        img {
            opacity: .375;
        }

        &.is-active {
            border-right: .45em solid $blue-light;
            opacity: 1;

            img {
                opacity: .65;
            }
        }

        &:not(.is-active):hover {
            opacity: .8;

            img {
                opacity: .45;
            }
        }
    }

    .logout {
        padding: 1em 0;
        margin: 0 2em;
        font-weight: 600;
        cursor: pointer;
    }
</style>
