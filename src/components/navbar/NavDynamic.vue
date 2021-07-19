<template>
    <div class="nav-dynamic is-marginless" :class="{shadow: showNavbar}" :style="{transform: 'translate3d(0px, ' + positionNavbar + 'px, 0px)' }">
        <div class="container level">
            <div class="level-left">
                <span class="level-item"><router-link to="/"><img src="../../assets/brand.png" alt="" width="150"></router-link></span>
                <span class="level-item"><router-link to="/about">About</router-link></span>
                <span class="level-item"><a>Pricing</a></span>
                <span class="level-item"><a class="is-paddingless">Help</a></span>
            </div>
            <div class="level-right">
                <span class="level-item">
                    <router-link to="/login" class="button is-secondary is-radiusless">Login</router-link>
                </span>
                <span class="level-item">
                    <router-link to="/signup"
                                 class="button is-primary is-marginless is-radiusless">Create account</router-link>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NavDynamic",
        data() {
            return {
                showNavbar: false,
                positionNavbar: 0,
            }
        }, mounted() {
            window.addEventListener('scroll', this.onScroll)
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.onScroll)
        }, methods: {
            onScroll() {
                const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                currentScrollPosition === 0 ? this.showNavbar = false : this.showNavbar = true;

                if (currentScrollPosition >= 0 && currentScrollPosition < 73) {
                    this.positionNavbar = currentScrollPosition;
                } else if (currentScrollPosition > 72) {
                    this.positionNavbar = 72;
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .nav-dynamic {
        top: -72px;
        position: fixed;
        width: 100%;
        padding: 1em 1.5em;
        z-index: 100;
        transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
        background-color: #fff;
        transition: box-shadow 500ms ease-in;

        a {
            font-size: 1em;
            padding-right: 1em;
        }

        &.shadow {
            box-shadow: 0 15px 45px 0 rgba(139, 140, 185, .2);
        }

        .button.is-secondary {
            transition: background-color 150ms ease-in-out;

            &:hover {
                background-color: rgba(28, 0, 255, .07) !important;
            }
        }
    }
</style>
