<template>
  <layout name="LayoutDefault">
    <div class="home">
      <div class="hero-absolute has-background-default"></div>
      <div class="container">
        <nav-static />
        <div class="columns is-desktop py-2 is-vcentered">
          <div class="column is-4">
            <div class="title is-1 mb-3">Start creating</div>
            <div class="subtitle is-5 mb-2">
              Start a membership business to develop a direct relationship with
              your biggest fans and generate predictable, recurring revenue from
              your creative work.
            </div>
            <router-link
              to="/signup"
              class="button is-primary is-marginless is-radiusless btn-shadow"
              >Get started
            </router-link>
          </div>
          <div class="column is-8 has-text-centered hero-images">
            <img
              src="../../assets/hero-illustration.png"
              alt=""
              class="px-5 py-2"
            />
            <img
              src="../../assets/swirl-blue.svg"
              alt=""
              class="swirl-animation blue"
            />
            <img
              src="../../assets/swirl-green.svg"
              alt=""
              class="swirl-animation green"
            />
          </div>
        </div>
      </div>
      <section class="hero is-bold has-background-white">
        <div class="hero-body">
          <div class="container">
            <div class="has-text-centered mb-2">
              <img src="../../assets/logo.png" alt="logo" width="60" />
            </div>
            <div class="title is-3 has-text-centered mb-3">
              Connect with your fans
            </div>
            <div class="subtitle has-text-centered">
              FundMyCode is a developer-founded company, helping developers<br />
              build membership businesses that empower them to create on their
              own terms.<br />
              Generate recurring and predictable income from your work
              <br />through fans who pay you monthly.
            </div>
          </div>
        </div>
      </section>
    </div>
  </layout>
</template>

<script>
import Layout from "../../layouts";
import NavStatic from "../../components/navbar/NavStatic";

export default {
  name: "home",
  components: {
    Layout,
    NavStatic,
  },
};
</script>

<style scoped lang="scss">
.hero-images {
  position: relative;

  .swirl-animation {
    width: 5vw;
    position: absolute;

    &.blue {
      left: 6vw;
      top: 1vh;
      -webkit-animation: spin 8s ease-in-out alternate-reverse infinite;
      -moz-animation: spin 8s ease-in-out alternate-reverse infinite;
      animation: spin 8s ease-in-out alternate-reverse infinite;

      @media screen and (max-width: 1440px) {
        left: 15vw !important;
      }
    }

    &.green {
      opacity: 0.5;
      left: 6.25vw;
      top: 1.25vh;
      -webkit-animation: spin 8s ease-in-out alternate-reverse infinite;
      -moz-animation: spin 8s ease-in-out alternate-reverse infinite;
      animation: spin 8s ease-in-out alternate-reverse infinite;

      @media screen and (max-width: 1440px) {
        left: 15.25vw !important;
      }
    }

    @-moz-keyframes spin {
      100% {
        -moz-transform: rotate(360deg);
      }
    }

    @-webkit-keyframes spin {
      100% {
        -webkit-transform: rotate(360deg);
      }
    }

    @keyframes spin {
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
  }
}
</style>
