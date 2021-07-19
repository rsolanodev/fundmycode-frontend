<template>
  <layout name="LayoutLogin">
    <div class="login">
      <div class="user-account-form border-shadow has-background-white p-2">
        <div class="title is-3 has-text-centered mb-3 mt-1">
          Log in
        </div>
        <form @submit.prevent="logIn">
          <div class="has-text-centered pb-2 has-text-danger" v-if="wrongCred">
            Incorrect email or password.
          </div>
          <!--
                    <div class="has-text-centered pb-2 has-text-danger" v-if="notVerified">
                        The account hasn't been verified.
                    </div>
                    -->
          <div class="has-text-weight-semibold">
            <div
              class="box-auth"
              style="border-bottom: 0;"
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
            <div class="box-auth" :class="{ 'input-active': activePassword }">
              <label>
                Password
                <input
                  class="input"
                  name="password"
                  type="password"
                  v-model.trim="$v.password.$model"
                  placeholder="*********"
                  @focusin="activePassword = true"
                  @focusout="activePassword = false"
                />
              </label>
            </div>
          </div>
          <div class="level mt-2">
            <div class="level-left">
              <span class="level-item">
                <b-checkbox size="is-small">
                  Remember me
                </b-checkbox>
              </span>
            </div>
            <div class="level-right">
              <span class="level-item">
                <router-link
                  to="/forgot-password"
                  class="has-text-weight-medium has-text-primary"
                  >Forgot password?</router-link
                >
              </span>
            </div>
          </div>
          <button
            type="submit"
            class="button is-primary is-fullwidth mb-2"
            :disabled="this.$v.$invalid"
          >
            LOG IN
          </button>
        </form>
        <div class="has-text-centered">
          <span>New user? </span>
          <router-link
            to="/signup"
            class="has-text-weight-medium has-text-primary"
            >Sign up</router-link
          >
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from "../../layouts/index";
import { validationMixin } from "vuelidate";
import { email, required } from "vuelidate/lib/validators";
// import {RepositoryFactory} from "../../api/RepositoryFactory";

// const UsersRepository = RepositoryFactory.get('users');

export default {
  name: "Login",
  data() {
    return {
      activeEmail: false,
      activePassword: false,
      email: "",
      password: "",
      wrongCred: false,
      notVerified: false,
    };
  },
  methods: {
    async logIn() {
      let email = this.email;
      let password = this.password;

      this.$store.dispatch("login", { email, password }).then(
        async () => {
          /*
                    await UsersRepository.checkVerify(email).then((response) => {
                        response.data.is_verified ?*/
          this.$store.dispatch("getUser").finally(() => {
            this.$router.push({ name: "feed" });
          }); /*
                            : this.notVerified = true;
                    }, () => {
                        this.wrongCred = true;
                    });
                     */
        },
        () => {
          this.wrongCred = true;
        }
      );
    },
  },
  components: {
    Layout,
  },
  mixins: [validationMixin],
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
};
</script>

<style scoped>
a,
span {
  font-size: 14px;
}
</style>
