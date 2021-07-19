<template>
    <footer>
        <div class="container has-text-white py-4">
            <div class="columns">
                <div class="column is-5">
                    <img src="../assets/brand-white.png" alt="white brand" width="180" class="mb-2">
                </div>
                <div class="column is-3 px-2">
                    <div class="has-text-light mb-1">Contact us</div>
                    <ul class="has-text-footer">
                        <li class="mb-1">
                            <span class="icon is-small">
                                <i class="el-icon-location"></i>
                            </span>
                            <span> Gran Via del Marqués del Túria, 12, 7B, 46005 Valencia</span>
                        </li>
                        <li class="mb-1">
                            <span class="icon is-small">
                                <i class="el-icon-phone"></i>
                            </span>
                            <span> +34 676814483</span>
                        </li>
                        <li class="mb-1">
                            <span class="icon is-small">
                                <i class="el-icon-s-promotion"></i>
                            </span>
                            <span> rsolano@dekalabs.com</span>
                        </li>
                    </ul>
                </div>
                <div class="column is-2 px-2">
                    <div class="has-text-light mb-1">Read more</div>
                    <ul class="has-text-footer">
                        <li class="mb-1">About</li>
                        <li class="mb-1">Pricing</li>
                        <li class="mb-1">Help</li>
                    </ul>
                </div>
                <div class="column is-2 px-2">
                    <div class="has-text-light mb-1">Developers</div>
                    <ul class="has-text-footer">
                        <li class="mb-1">The newest</li>
                        <li class="mb-1">With more fans</li>
                        <li class="mb-1">All developers</li>
                    </ul>
                </div>
            </div>
            <hr>
            <span class="copy">
            &copy; {{ new Date().getFullYear() }} All rights reserved
            </span>
        </div>
    </footer>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped lang="scss">
    hr {
        height: 1px;
        opacity: .25;
    }

    .copy {
        opacity: .25;
    }

    p {
        font-size: .9em !important;
    }

    i {
        opacity: .5;
        color: #fff !important;
    }
</style>
