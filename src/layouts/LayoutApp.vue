<template>
    <div class="LayoutApp">
        <nav-app/>
        <main class="container mt-3">
            <div class="columns">
                <div class="column is-one-fifth">
                    <side-app/>
                </div>
                <div class="column">
                    <slot/>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import NavApp from "../components/navbar/NavApp";
    import SideApp from "../components/sidebar/SideApp";

    export default {
        name: "layout-app",
        components: {NavApp, SideApp},
    };
</script>

<style scoped>
    .LayoutApp {
        background-color: #FAFAFA;
        min-height: 100vh;
    }
</style>
