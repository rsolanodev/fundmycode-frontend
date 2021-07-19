<template>
    <div class="LayoutRestore">
        <div class="brand absolute">
            <router-link to="/"><img src="../assets/brand.png" alt="" width="150"></router-link>
        </div>
        <div class="align-cv">
            <div class="card border-shadow has-background-white p-2 is-relative">
                <slot/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LayoutRestore"
    }
</script>

<style scoped>
    .LayoutRestore {
        background-color: #FAFAFA;
        min-height: 100vh;
    }

    .align-cv {
        height: 100vh;
    }

    .card {
        box-shadow: 0 15px 45px 0 rgba(139, 140, 185, 0.2) !important;
    }
</style>
