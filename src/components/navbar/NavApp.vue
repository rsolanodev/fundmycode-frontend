<template>
    <div>
        <div class="fake-nav-app"></div>
        <div class="nav-app is-marginless small-shadow is-fixed-top">
            <div class="container level">
                <div class="level-left">
                <span class="level-item">
                    <router-link to="/feed"><img src="../../assets/brand.png" alt="" width="150"></router-link>
                </span>
                </div>
                <div class="level-right">
                    <div class="field">
                        <p class="control has-icons-left" :class="{'is-loading': loading_search}">
                            <input class="input search" type="search" placeholder="Search..." v-model="query" @keyup="searchDeveloper">
                            <b-icon pack="fas" icon="search" size="is-small" class="is-left"/>
                        </p>
                    </div>
                    <div class="list" v-if="showList">
                        <a class="list-item" v-for="item in list_search" v-bind:key="item.id">
                            <router-link :to="{ name: 'profile-public', params: { udev: item.url }}">
                                <div class="media">
                                    <figure class="media-left">
                                        <div class="image is-32x32">
                                            <img v-if="item.picture" :src="item.picture" class="small-rounded" alt="user picture">
                                            <img v-else :src="default_picture" class="small-rounded" alt="default user picture">
                                        </div>
                                    </figure>
                                    <div class="media-content">
                                        <div class="title is-7">{{ item.public_name }}</div>
                                        <div class="subtitle is-7">{{ item.about }}</div>
                                    </div>
                                </div>
                            </router-link>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {RepositoryFactory} from "../../api/RepositoryFactory";
    import constants from "../../constants";

    const DevelopersRepository = RepositoryFactory.get('developers');

    export default {
        name: "NavApp",
        data() {
            return {
                showList: false,
                query: '',
                list_search: [],
                loading_search: false,
                default_picture: constants.DEFAULT_USER_PICTURE
            }
        },
        methods: {
            async searchDeveloper() {
                if (this.query.length > 1) {
                    this.loading_search = true;
                    const {data} = await DevelopersRepository.search(this.query);
                    this.loading_search = false;
                    this.list_search = data.results;
                    this.showList = true;
                } else {
                    this.list_search = [];
                    this.showList = false;
                }
            }
        },
        watch: {
            '$route'() {
                this.query = '';
                this.list_search = [];
                this.showList = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    .fake-nav-app {
        width: 100%;
        height: 72px;
    }

    .nav-app {
        width: 100%;
        padding: 1em 1.5em;
        z-index: 100;
        transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
        background-color: #fff;
        transition: box-shadow 500ms ease-in;

        a {
            font-size: 1em;
            padding-right: 1em;
        }

        .button.is-secondary {
            transition: background-color 150ms ease-in-out;

            &:hover {
                background-color: rgba(28, 0, 255, .07) !important;
            }
        }
    }

    .list {
        top: 50px;
        position: absolute;

        .list-item {
            padding: 1rem;

            .media-content {
                width: 200px;

                .subtitle {
                    line-height: 1.75em !important;
                }

                .is-7 {
                    font-size: 14px !important;
                }
            }
        }
    }


</style>
