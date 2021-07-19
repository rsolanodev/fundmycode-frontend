<template>
  <layout name="LayoutRestore">
    <div class="forgot-password">
      <div class="title is-3 has-text-centered mb-3 mt-1">
        Forgot password
      </div>
      <div class="subtitle is-6" v-if="requested">
        Check your email for a link to reset your password. If it doesn’t appear
        within a few minutes, check your spam folder.
      </div>
      <div class="subtitle is-6" v-else>
        Enter your email address and we will send you a link to reset your
        password.
      </div>
      <hr v-if="!requested" />
      <div
        class="box-auth has-text-weight-bold"
        style="border-bottom: 0;"
        v-if="!requested"
      >
        <label>
          Email Address
          <input
            class="input"
            type="text"
            placeholder="you@example.com"
            name="email"
            v-model="email"
          />
        </label>
      </div>
      <button
        type="submit"
        class="button is-primary is-fullwidth mb-2"
        v-if="!requested"
        @click="resetPassword"
      >
        Reset Password
      </button>
    </div>
  </layout>
</template>

<script>
import Layout from "../../layouts/index";
import { RepositoryFactory } from "../../api/RepositoryFactory";

const RequestRepository = RepositoryFactory.get("request_restore_code");

export default {
  name: "ForgotPassword",
  components: {
    Layout,
  },
  data() {
    return {
      email: "",
      requested: false,
    };
  },
  methods: {
    async resetPassword() {
      await RequestRepository.request({ email: this.email });
      this.requested = true;
    },
  },
};
</script>

<style scoped>
.forgot-password {
  max-width: 25vw;
}

.box-auth {
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}
</style>
