<template>
    <div class="posts">
        <div v-for="post in posts" v-bind:key="post.id">
            <div class="content-box">
                <div class="media pb-1" v-if="profile">
                    <figure class="media-left">
                        <div class="image is-32x32">
                            <router-link :to="{ name: 'profile-public', params: { udev: post.user.url }}">
                                <img v-if="post.user.picture" :src="post.user.picture" class="small-rounded"
                                     alt="user picture">
                                <img v-else :src="default_picture" class="small-rounded" alt="default user picture">
                            </router-link>
                        </div>
                    </figure>
                    <div class="media-content">
                        <router-link :to="{ name: 'profile-public', params: { udev: post.user.url }}">
                            <div class="subtitle is-5 has-text-weight-bold is-paddingless is-inline">{{
                                post.user.public_name }}
                            </div>
                        </router-link>
                    </div>
                </div>
                <small>{{ post.created | toPublicDateTime }}</small>
                <div class="title is-6 mt-1">{{ post.title }}</div>
                <div class="subtitle" :class="{'mb-2': tools}">
                    <span v-html="$options.filters.bodyFormat(post.body)"/>
                </div>
                <div class="level" v-if="tools">
                    <div class="level-left"></div>
                    <div class="level-right">
                        <div class="level-item has-pointer" @click="confirm(post.id)">
                            <b-icon
                                    pack="far"
                                    icon="trash-alt"
                                    size="is-small">
                            </b-icon>
                        </div>
                        <div class="level-item">
                            <router-link :to="{ name: 'edit-post', params: { id: post.id }}">
                                <b-icon
                                        pack="far"
                                        icon="edit"
                                        size="is-small">
                                </b-icon>
                            </router-link>
                        </div>
                        <div class="level-item">
                            <b-icon
                                    pack="far"
                                    icon="bookmark"
                                    size="is-small">
                            </b-icon>
                        </div>
                        <div class="level-item">
                            <b-icon
                                    pack="fas"
                                    icon="share-alt"
                                    size="is-small">
                            </b-icon>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-box py-1">
                <div class="media">
                    <figure class="media-left">
                        <div class="image is-32x32">
                            <router-link :to="{ name: 'profile-public', params: { udev: userDetails.url }}">
                                <img v-if="userDetails.picture" :src="userDetails.picture" class="small-rounded"
                                     alt="user picture">
                                <img v-else :src="default_picture" class="small-rounded" alt="default user picture">
                            </router-link>
                        </div>
                    </figure>
                    <div class="media-content">
                        <div class="box-auth mb-1">
                            <input type="text" class="input is-fullwidth" placeholder="Write a comment..."
                                   v-on:keyup.enter="sendComment($event.target.value, post.id)">
                        </div>
                        <small class="is-link has-text-primary has-text-weight-normal" v-if="post.comments_count > 0"
                               @click="getCommentsByPost(post.id)">{{ inComments(post.id) ? 'Hide' : 'See' }} {{
                            post.comments_count }} replies</small>
                        <div class="comments" v-if="inComments(post.id)">
                            <div class="media" v-for="comment in getComments(post.id)" :key="comment.id">
                                <figure class="media-left">
                                    <div class="image is-32x32">
                                        <router-link
                                                :to="{ name: 'profile-public', params: { udev: comment.user.url }}">
                                            <img v-if="comment.user.picture" :src="comment.user.picture"
                                                 class="small-rounded"
                                                 alt="user picture">
                                            <img v-else :src="default_picture" class="small-rounded"
                                                 alt="default user picture">
                                        </router-link>
                                    </div>
                                </figure>
                                <div class="media-content">
                                    <div class="title mb-1">{{ comment.user.first_name }} {{ comment.user.last_name }}
                                    </div>
                                    <div class="subtitle">
                                        <span v-text="comment.body"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from "moment";

    import {RepositoryFactory} from "../api/RepositoryFactory";
    import {mapGetters} from "vuex";
    import constants from "../constants";

    const PostsRepository = RepositoryFactory.get('posts');
    const CommentsRepository = RepositoryFactory.get('comments');

    export default {
        name: "Post",
        props: {
            posts: null,
            tools: null,
            profile: null,
        },
        data() {
            return {
                default_picture: constants.DEFAULT_USER_PICTURE,
                comments: [],
            }
        },
        computed: {
            ...mapGetters({
                userDetails: "myUser",
            })
        },
        filters: {
            toPublicDateTime(value) {
                if (!value) return '';
                return moment(value).calendar();
            },
            bodyFormat(value) {
                return value.replace(/(?:\r\n|\r|\n)/g, '<br>');
            },
        },
        methods: {
            confirm(id) {
                this.$buefy.dialog.confirm({
                    message: 'Are you sure to delete this post?',
                    onConfirm: () => {
                        PostsRepository.delete(id).then(async () => {
                            await this.$root.$refs.ProfileDeveloper.getPosts();
                            this.$buefy.toast.open({
                                message: 'Post deleted successfully',
                                type: 'is-success',
                                position: 'is-bottom'
                            });
                        }, () => this.$buefy.toast.open({
                            message: 'The post was not deleted',
                            type: 'is-danger',
                            position: 'is-bottom'
                        }));
                    }
                })
            },
            async getCommentsByPost(post) {
                if (this.inComments(post)) {
                    this.removeComments(post);
                } else {
                    const {data} = await CommentsRepository.getByPost(post);
                    let packet = {
                        post: post,
                        comments: data
                    };
                    this.comments.push(packet);
                }
            },
            inComments(post) {
                return this.comments.find(element => element.post === post)
            },
            removeComments(post) {
                let i = this.comments.findIndex(element => element.post === post);
                this.comments.splice(i, 1)
            },
            getComments(post) {
                return this.comments.filter(element => element.post === post).shift().comments;
            },
            async sendComment(comment, post) {
                await CommentsRepository.createComment({
                    "user": this.userDetails.id,
                    "post": post,
                    "body": comment
                }).then(() => {
                    this.getCommentsByPost(post)
                });
            }
        }
    }
</script>
<style scoped lang="scss">
    .subtitle {
        padding-top: .5em;
        font-size: 14px;
    }

    .content-box {
        .title {
            opacity: .65;
            transition: 200ms;
        }

        &:hover {
            .title {
                opacity: .9;
            }
        }

        .level-item {
            margin-left: .75em;
        }
    }

    .box-auth {
        padding: .25em 1em !important;
        background-color: rgba(0, 0, 0, .015);
    }

    .comments {
        .title {
            font-size: 14px;
        }

        .subtitle {
            font-size: 12px;
        }
    }
</style>
