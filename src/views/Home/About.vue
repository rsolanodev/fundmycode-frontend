<template>
  <layout name="LayoutDefault">
    <div class="about">
      <h1>About</h1>
      <p>
        {{ info }}
      </p>
    </div>
  </layout>
</template>
<script>
import Layout from "../../layouts";

export default {
  name: "about",
  components: {
    Layout,
  },
  data() {
    return {
      info: null,
    };
  },
};
</script>
