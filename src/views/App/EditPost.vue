<template>
  <layout name="LayoutApp">
    <div class="post">
      <div class="columns">
        <div class="column is-two-thirds">
          <div class="content-box" v-if="isLoadedData">
            <div class="title is-5 mb-2 has-text-weight-medium" v-if="edit">
              Edit post
            </div>
            <div class="title is-5 mb-2 has-text-weight-medium" v-else>
              Create post
            </div>
            <input
              type="text"
              placeholder="Post title"
              class="is-clear title"
              v-model="title"
            />
            <textarea
              minlength="10"
              maxlength="2000"
              placeholder="What do you need to tell your followers?"
              class="textarea mb-2"
              rows="12"
              v-model="body"
            />
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Scope</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <label class="radio is-block">
                      <input type="radio" v-model="status" value="public" />
                      For everyone
                    </label>
                    <label class="radio is-block ml-0">
                      <input type="radio" v-model="status" value="private" />
                      For subscribers
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="level">
              <div class="level-left"></div>
              <div class="level-right">
                <button
                  class="button is-secondary mr-1"
                  @click="deletePost"
                  v-text="edit ? 'Cancel' : 'Delete'"
                >
                  Delete
                </button>
                <button
                  class="button is-primary btn-shadow"
                  @click="createPost"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
          <loader v-else />
        </div>
        <div class="column"></div>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from "../../layouts";
import { RepositoryFactory } from "../../api/RepositoryFactory";
import { mapGetters } from "vuex";
import Loader from "../../components/Loader";

const PostsRepository = RepositoryFactory.get("posts");

export default {
  name: "EditPost",
  components: {
    Layout,
    Loader,
  },
  data() {
    return {
      canExit: false,
      title: "",
      body: "",
      status: "public",
      edit: false,
      isLoadedData: false,
    };
  },
  async created() {
    this.fetch();
  },
  beforeRouteLeave(to, from, next) {
    !this.canExit
      ? this.$buefy.dialog.confirm({
          message: "Do you really want to leave? you have unsaved changes!",
          onConfirm: () => {
            next();
          },
          onCancel: () => {
            next(false);
          },
          cancelText: "Continue editing",
          confirmText: "Discard",
        })
      : next();
  },
  computed: {
    ...mapGetters({
      userDetails: "myUser",
    }),
  },
  methods: {
    async fetch() {
      if (this.$route.params.id != null) {
        this.edit = true;
        await PostsRepository.getPost(this.$route.params.id).then(
          (response) => {
            if (response.data.user.id === this.userDetails.id) {
              this.isLoadedData = true;
              this.title = response.data.title;
              this.body = response.data.body;
              this.status = response.data.status;
            } else {
              this.canExit = true;
              this.$router.push({ name: "profile" });
            }
          },
          () => {
            this.canExit = true;
            this.$router.push({ name: "profile" });
          }
        );
      } else {
        this.isLoadedData = true;
      }
    },
    deletePost() {
      if (this.edit) {
        this.$buefy.dialog.confirm({
          message:
            "Are you sure you want to cancel the edit of this publication?",
          onConfirm: () => {
            this.canExit = true;
            this.$router.push({ name: "profile" });
          },
        });
      } else {
        this.$buefy.dialog.confirm({
          message: "Are you sure to delete this post?",
          onConfirm: () => {
            this.canExit = true;
            this.$router.push({ name: "profile" });
          },
        });
      }
    },
    async createPost() {
      let payload = {
        title: this.title,
        body: this.body,
        status: this.status,
      };

      if (this.edit) {
        await PostsRepository.updatePost(payload, this.$route.params.id).then(
          () => {
            this.canExit = true;
            this.$router.push({ name: "profile" });
          }
        );
      } else {
        await PostsRepository.createPost(payload).then(() => {
          this.canExit = true;
          this.$router.push({ name: "profile" });
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.is-clear {
  border: none;
  width: 100%;

  &.title {
    font-size: 30px !important;
    height: 1.5em;
    font-weight: 600;
  }
}

.control {
  width: 100% !important;

  .radio {
    padding-top: 0.375em;
  }
}
</style>
