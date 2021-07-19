<template>
  <layout name="LayoutSignup">
    <div class="login">
      <div
        class="user-account-form border-shadow has-background-white p-2"
        style="width: 400px;"
      >
        <div class="title is-3 has-text-centered mb-3 mt-1">
          Sign up
        </div>
        <form v-on:submit.prevent="checkEmail">
          <!--
          <div
            class="box-social has-text-weight-semibold has-text-centered"
            @click="authenticate('github')"
          >
            <span class="icon is-small">
              <img src="../../assets/icons/github.svg" alt="" />
            </span>
            <span>Sign up with GitHub</span>
          </div>
          <div class="has-text-centered my-2">
            <span>Or sign up with email</span>
          </div>
          -->
          <div
            class="has-text-centered mb-2 has-text-danger"
            v-if="accountExists"
          >
            This email address already<br />
            has an account.
          </div>
          <div
            class="box-auth has-text-weight-semibold"
            :class="{ 'input-active': activeEmail }"
          >
            <label>
              Email Address
              <input
                class="input"
                type="text"
                v-model.trim="$v.email.$model"
                placeholder="you@example.com"
                name="email"
                @focusin="activeEmail = true"
                @focusout="activeEmail = false"
                autofocus
              />
            </label>
          </div>
          <div class="checkboxes has-text-left">
            <b-checkbox class="my-2" size="is-small" v-model="terms">
              Accept terms and conditions
            </b-checkbox>
          </div>
          <button
            type="submit"
            class="button is-primary is-fullwidth mb-2"
            :disabled="
              this.$v.$invalid || (!terms && this.$v.$invalid) || !terms
            "
          >
            Create Free Account
          </button>
        </form>
        <div class="has-text-centered">
          <span>Have an account? </span>
          <router-link
            to="/login"
            class="has-text-weight-medium has-text-primary"
            >Log in</router-link
          >
        </div>
      </div>
      <b-loading
        :is-full-page="true"
        :active.sync="isLoading"
        :can-cancel="false"
      />
    </div>
  </layout>
</template>

<script>
import Layout from "../../layouts/index";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

import { RepositoryFactory } from "../../api/RepositoryFactory";

const UsersRepository = RepositoryFactory.get("users");

export default {
  name: "Signup",
  props: ["shared"],
  data() {
    return {
      email: this.shared.getEmail,
      activeEmail: false,
      accountExists: false,
      isLoading: false,
      terms: false,
      isAuthenticated: false,
    };
  },
  components: {
    Layout,
  },
  methods: {
    async checkEmail() {
      this.isLoading = true;
      const { data } = await UsersRepository.checkEmail(this.email);
      if (data.exists) {
        this.accountExists = true;
        this.isLoading = false;
      } else {
        this.signUp();
      }
    },
    signUp() {
      setTimeout(() => {
        this.shared.getEmail = this.email;
        this.isLoading = false;
        this.$router.push("/signup/steps/1");
      }, 500);
    },
    authenticate: function (provider) {
      this.$auth.authenticate(provider).then(function (lol) {
        // Execute application logic after successful social authentication
        // eslint-disable-next-line no-console
        console.log(lol);
      });
    },
  },
  mixins: [validationMixin],
  validations: {
    email: {
      required,
      email,
    },
  },
};
</script>

<style scoped>
a,
span {
  font-size: 14px;
}

.icon.is-small {
  height: 14px;
  width: 14px;
  margin-right: 0.5em;
}
</style>
