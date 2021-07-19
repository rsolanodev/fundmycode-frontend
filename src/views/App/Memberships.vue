<template>
  <layout name="LayoutApp">
    <div class="edit-page">
      <div class="content-box is-paddingless">
        <div class="has-text-centered mt-1 mb-3 py-4 px-4">
          <div class="title is-4">Active memberships</div>
          <div v-if="supporting.length > 0">
            <table class="table is-fullwidth my-3 mb-1">
              <tr>
                <th>Developer</th>
                <th>Tier</th>
                <th>Subscribed At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              <tr
                v-for="subscription in supporting"
                v-bind:key="subscription.id"
              >
                <td>{{ subscription.developer.public_name }}</td>
                <td>{{ subscription.tier.title }}</td>
                <td>
                  {{ moment(subscription.created).format("DD/MM/YYYY") }}
                </td>
                <td>{{ subscription.status }}</td>
                <td
                  class="action"
                  v-if="subscription.status === 'active'"
                  @click="unSubscribe(subscription)"
                >
                  unsubscribe
                </td>
              </tr>
            </table>
            <small>
              Note: If you cancel a subscription you will not be able to
              continue enjoying the privileges.
            </small>
          </div>
          <div class="subtitlte is-6" v-else>
            You aren't pledging to anyone right now.
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from "../../layouts";
import { mapGetters } from "vuex";

import { RepositoryFactory } from "../../api/RepositoryFactory";

const SubscriptionRepository = RepositoryFactory.get("subscriptions");

export default {
  name: "Memberships",
  components: {
    Layout,
  },
  data() {
    return {
      activeTab: 0,
      showBooks: false,
      developer: {},
      banner: {},
      picture: {},
      tiers: [],
    };
  },
  computed: {
    ...mapGetters({
      supporting: "mySupporting",
    }),
  },
  async created() {
    this.fetch();
  },
  methods: {
    async fetch() {},
    async unSubscribe(subscription) {
      await SubscriptionRepository.unsubscribe(subscription.id).then(
        () => {
          this.$buefy.toast.open({
            message: `You have unsubscribed from ${subscription.developer.public_name}`,
            type: "is-success",
            position: "is-bottom",
          });
          this.$store.dispatch("getUser");
        },
        () => {
          this.$buefy.toast.open({
            message: `Error trying unsubscribe from ${subscription.developer.public_name}`,
            type: "is-danger",
            position: "is-bottom",
          });
        }
      );
    },
  },
};
</script>

<style scoped lang="scss">
.table th,
.table td {
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: default;
}

.action {
  cursor: pointer !important;
}
</style>
