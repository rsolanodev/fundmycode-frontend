<template>
    <div class="LayoutSignup">
        <div class="columns is-full-width-and-height has-background-default">
            <div class="column is-5 column-left px-6 align-cv">
                <div class="brand absolute">
                    <router-link to="/"><img src="../assets/brand.png" alt="" width="150"></router-link>
                </div>
                <div class="card">
                    <slot/>
                </div>
            </div>
            <div class="column is-7 column-left column-right align-cv">
                <img src="https://res.cloudinary.com/contractbook/image/upload/v1561141411/v3/sign_up_pic_cropped.png"
                     alt="" class="is-fullwidth signup-img">
                <div class="title is-3 has-text-centered mb-3">Nice to meet you!</div>
                <div class="subtitle has-text-centered">
                    Access and start meeting people who<br />
                    are already earning income thanks to their fans
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "layout-signup",
        components: {}
    };
</script>

<style scoped>
    .is-full-width-and-height {
        max-width: 100vw;
        min-height: 100vh;
    }

    .columns {
        margin-top: 0;
    }

    .column-right {
        padding: 40px 7vw;
    }

    .column-left {
        padding: 0 30px;
    }

    .signup-img {
        width: 800px;
    }

    @media screen and (max-width: 1440px) {
        .signup-img {
            width: 500px;
        }
    }
</style>
