<template>
  <layout name="LayoutApp">
    <div class="tier">
      <div class="columns">
        <div class="column is-two-thirds">
          <div class="content-box" v-if="isLoadedData">
            <div class="title is-5 mb-2 has-text-weight-medium" v-if="edit">
              Edit tier
            </div>
            <div class="title is-5 mb-2 has-text-weight-medium" v-else>
              Create tier
            </div>
            <input
              type="text"
              placeholder="Tier title"
              class="is-clear title"
              v-model="title"
            />
            <textarea
              minlength="10"
              maxlength="1000"
              placeholder="What do you offer to your subscribers? (separate with line breaks)"
              class="textarea mb-2"
              rows="6"
              v-model="description"
            />
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Limit</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <p class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Amount of users (unlimited by default)"
                      v-model="limit"
                    />
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Price</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <p class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="Amount of money"
                      v-model="price"
                    />
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Public</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <label class="checkbox">
                      <input type="checkbox" v-model="publik" />
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
                  @click="deleteTier"
                  v-text="edit ? 'Cancel' : 'Delete'"
                >
                  Delete
                </button>
                <button
                  class="button is-primary btn-shadow"
                  @click="createTier"
                >
                  Save
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

const TiersRepository = RepositoryFactory.get("tiers");

export default {
  name: "EditTier",
  components: {
    Layout,
    Loader,
  },
  data() {
    return {
      canExit: false,
      title: "",
      description: "",
      limit: null,
      price: null,
      publik: true,
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
        await TiersRepository.getTier(this.$route.params.id).then(
          (response) => {
            if (response.data.user.id === this.userDetails.id) {
              this.isLoadedData = true;
              this.title = response.data.title;
              this.description = response.data.description;
              this.price = response.data.price;
              this.limit = response.data.limit;
              this.publik = response.data.public;
            } else {
              this.canExit = true;
              this.$router.push({ name: "edit-developer" });
            }
          },
          () => {
            this.canExit = true;
            this.$router.push({ name: "edit-developer" });
          }
        );
      } else {
        this.isLoadedData = true;
      }
    },
    deleteTier() {
      if (this.edit) {
        this.$buefy.dialog.confirm({
          message: "Are you sure you want to cancel the edit of this tier?",
          onConfirm: () => {
            this.canExit = true;
            this.$router.push({ name: "edit-developer" });
          },
        });
      } else {
        this.$buefy.dialog.confirm({
          message: "Are you sure to delete this tier?",
          onConfirm: () => {
            this.canExit = true;
            this.$router.push({ name: "edit-developer" });
          },
        });
      }
    },
    async createTier() {
      let payload = {
        title: this.title,
        description: this.description,
        price: this.price,
        limit: this.limit,
        public: this.publik,
      };

      if (this.edit) {
        await TiersRepository.updateTier(payload, this.$route.params.id).then(
          () => {
            this.canExit = true;
            this.$router.push({ name: "edit-developer" });
          }
        );
      } else {
        await TiersRepository.createTier(payload).then(() => {
          this.canExit = true;
          this.$router.push({ name: "edit-developer" });
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

  .checkbox {
    padding-top: 0.375em;
  }
}
</style>
