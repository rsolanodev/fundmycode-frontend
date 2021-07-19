<template>
    <div class="nav-static">
        <div class="container level">
            <div class="level-left">
                <span class="level-item"><router-link to="/"><img src="../../assets/brand.png" alt="" width="150"></router-link></span>
            </div>
            <div class="level-right">
                <span class="level-item">
                    <router-link to="/login" class="button is-secondary is-radiusless"><i class="el-icon-user"></i> Login</router-link>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NavStatic",
    }
</script>

<style scoped lang="scss">
    .nav-static {
        width: 100%;
        padding: 2em 0 1em;

        a {
            font-size: 1em;
            padding-right: 1em;
        }
    }
</style>
